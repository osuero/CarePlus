using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Auth;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Mappers;
using CarePlus.Application.Models;
using CarePlus.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace CarePlus.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IOptions<JwtSettings> _jwtSettings;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher<User> passwordHasher,
        IOptions<JwtSettings> jwtSettings,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtSettings = jwtSettings;
        _logger = logger;
    }

    public async Task<Result<LoginResponse>> LoginAsync(string tenantId, LoginRequest request, CancellationToken cancellationToken = default)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return Result<LoginResponse>.Failure("auth.invalidRequest", "Las credenciales proporcionadas no son válidas.");
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await _userRepository.GetByEmailForAuthenticationAsync(tenantId, normalizedEmail, cancellationToken);

        if (user is null)
        {
            return Result<LoginResponse>.Failure("auth.invalidCredentials", "Correo o contraseña incorrectos.");
        }

        if (!user.IsPasswordConfirmed || string.IsNullOrWhiteSpace(user.PasswordHash))
        {
            return Result<LoginResponse>.Failure("auth.passwordNotConfigured", "El usuario aún no ha configurado su contraseña.");
        }

        var verification = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verification == PasswordVerificationResult.Failed)
        {
            return Result<LoginResponse>.Failure("auth.invalidCredentials", "Correo o contraseña incorrectos.");
        }

        if (verification == PasswordVerificationResult.SuccessRehashNeeded)
        {
            var rehashed = _passwordHasher.HashPassword(user, request.Password);
            user.AssignPassword(rehashed, confirmed: true);
            var updatedUser = await _userRepository.UpdateAsync(user, cancellationToken);
            user = updatedUser;
        }

        var (accessToken, expiresAtUtc) = GenerateAccessToken(user);
        var response = new LoginResponse
        {
            AccessToken = accessToken,
            ExpiresAtUtc = expiresAtUtc,
            User = UserMapper.ToResponse(user)
        };

        return Result<LoginResponse>.Success(response);
    }

    public async Task<Result<PasswordSetupInfoResponse>> GetPasswordSetupInfoAsync(string token, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return Result<PasswordSetupInfoResponse>.Failure("auth.invalidToken", "El token de configuracion de contrasena es requerido.");
        }

        var trimmedToken = token.Trim();
        var user = await _userRepository.GetByPasswordSetupTokenAsync(trimmedToken, cancellationToken);
        if (user is null)
        {
            return Result<PasswordSetupInfoResponse>.Failure("auth.invalidToken", "El enlace de configuracion de contrasena no es valido o ha expirado.");
        }

        var response = new PasswordSetupInfoResponse
        {
            UserId = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            IsPasswordConfirmed = user.IsPasswordConfirmed
        };

        return Result<PasswordSetupInfoResponse>.Success(response);
    }

    public async Task<Result> CompletePasswordSetupAsync(CompletePasswordSetupRequest request, CancellationToken cancellationToken = default)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.Token) || string.IsNullOrWhiteSpace(request.Password))
        {
            return Result.Failure("auth.invalidToken", "El token proporcionado no es válido.");
        }

        var trimmedToken = request.Token.Trim();
        var user = await _userRepository.GetByPasswordSetupTokenAsync(trimmedToken, cancellationToken);
        if (user is null)
        {
            return Result.Failure("auth.invalidToken", "El enlace de configuración de contraseña no es válido o ha expirado.");
        }

        var hashedPassword = _passwordHasher.HashPassword(user, request.Password);
        user.AssignPassword(hashedPassword, confirmed: true);
        user.CompletePasswordSetup();

        await _userRepository.UpdateAsync(user, cancellationToken);
        _logger.LogInformation("El usuario {UserId} completó la configuración de su contraseña.", user.Id);

        return Result.Success();
    }

    private (string Token, DateTime ExpiresAtUtc) GenerateAccessToken(User user)
    {
        var settings = _jwtSettings.Value;
        var expiresAtUtc = DateTime.UtcNow.AddMinutes(Math.Max(1, settings.AccessTokenExpiryMinutes));
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new("tenant", user.TenantId),
            new(ClaimTypes.Role, user.Role?.Name ?? "User"),
            new(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        if (!string.IsNullOrWhiteSpace(user.FirstName))
        {
            claims.Add(new(JwtRegisteredClaimNames.GivenName, user.FirstName));
        }

        if (!string.IsNullOrWhiteSpace(user.LastName))
        {
            claims.Add(new(JwtRegisteredClaimNames.FamilyName, user.LastName));
        }

        if (user.RoleId.HasValue)
        {
            claims.Add(new("roleId", user.RoleId.Value.ToString()));
        }

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.SigningKey));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var jwt = new JwtSecurityToken(
            issuer: settings.Issuer,
            audience: settings.Audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expiresAtUtc,
            signingCredentials: credentials);

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.WriteToken(jwt);
        return (token, expiresAtUtc);
    }
}
