using System;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Users;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Mappers;
using CarePlus.Application.Models;
using CarePlus.Domain.Entities;
using CarePlus.Domain.Enums;

namespace CarePlus.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;

    public UserService(IUserRepository userRepository, IRoleRepository roleRepository)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
    }

    public async Task<Result<UserResponse>> RegisterAsync(
        string tenantId,
        RegisterUserRequest request,
        CancellationToken cancellationToken = default)
    {
        var validationResult = Validate(request.FirstName, request.LastName, request.Email, request.Gender, request.DateOfBirth);
        if (!validationResult.IsSuccess)
        {
            return Result<UserResponse>.Failure(validationResult.ErrorCode!, validationResult.ErrorMessage!);
        }

        var effectiveTenantId = NormalizeTenant(request.TenantId, tenantId);
        var normalizedEmail = NormalizeEmail(request.Email!);
        var existingUser = await _userRepository.GetByEmailAsync(effectiveTenantId, normalizedEmail, cancellationToken);
        if (existingUser is not null)
        {
            return Result<UserResponse>.Failure("user.exists", "Ya existe un usuario registrado con el correo electronico proporcionado.");
        }

        var roleResult = await ResolveRoleAsync(effectiveTenantId, request.RoleId, cancellationToken);
        if (!roleResult.IsSuccess)
        {
            return Result<UserResponse>.Failure(roleResult.ErrorCode!, roleResult.ErrorMessage!);
        }

        var user = new User
        {
            TenantId = effectiveTenantId,
            FirstName = request.FirstName!.Trim(),
            LastName = request.LastName!.Trim(),
            Email = normalizedEmail,
            PhoneNumber = request.PhoneNumber?.Trim(),
            Identification = request.Identification?.Trim(),
            Country = request.Country?.Trim(),
            Gender = MapGender(request.Gender!),
            DateOfBirth = request.DateOfBirth!.Value,
            RoleId = roleResult.Value
        };

        user = await _userRepository.AddAsync(user, cancellationToken);

        return Result<UserResponse>.Success(UserMapper.ToResponse(user));
    }

    public async Task<Result<UserResponse>> UpdateAsync(
        string tenantId,
        Guid id,
        UpdateUserRequest request,
        CancellationToken cancellationToken = default)
    {
        var validationResult = Validate(request.FirstName, request.LastName, request.Email, request.Gender, request.DateOfBirth);
        if (!validationResult.IsSuccess)
        {
            return Result<UserResponse>.Failure(validationResult.ErrorCode!, validationResult.ErrorMessage!);
        }

        var user = await _userRepository.GetByIdForUpdateAsync(id, cancellationToken);
        if (user is null || user.IsDeleted)
        {
            return Result<UserResponse>.Failure("user.notFound", "El usuario solicitado no existe.");
        }

        var effectiveTenantId = NormalizeTenant(request.TenantId, user.TenantId);
        var normalizedEmail = NormalizeEmail(request.Email!);

        if (!string.Equals(user.Email, normalizedEmail, StringComparison.OrdinalIgnoreCase) || !string.Equals(user.TenantId, effectiveTenantId, StringComparison.OrdinalIgnoreCase))
        {
            var existingUser = await _userRepository.GetByEmailAsync(effectiveTenantId, normalizedEmail, cancellationToken);
            if (existingUser is not null && existingUser.Id != user.Id)
            {
                return Result<UserResponse>.Failure("user.exists", "Ya existe un usuario registrado con el correo electronico proporcionado.");
            }
        }

        var roleResult = await ResolveRoleAsync(effectiveTenantId, request.RoleId ?? user.RoleId, cancellationToken);
        if (!roleResult.IsSuccess)
        {
            return Result<UserResponse>.Failure(roleResult.ErrorCode!, roleResult.ErrorMessage!);
        }

        user.TenantId = effectiveTenantId;
        user.FirstName = request.FirstName!.Trim();
        user.LastName = request.LastName!.Trim();
        user.Email = normalizedEmail;
        user.PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber) ? null : request.PhoneNumber.Trim();
        user.Identification = string.IsNullOrWhiteSpace(request.Identification) ? null : request.Identification.Trim();
        user.Country = string.IsNullOrWhiteSpace(request.Country) ? null : request.Country.Trim();
        user.Gender = MapGender(request.Gender!);
        user.DateOfBirth = request.DateOfBirth!.Value;
        user.RoleId = roleResult.Value;
        user.Touch();

        var updatedUser = await _userRepository.UpdateAsync(user, cancellationToken);
        return Result<UserResponse>.Success(UserMapper.ToResponse(updatedUser));
    }

    public async Task<Result> DeleteAsync(
        string tenantId,
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdForUpdateAsync(id, cancellationToken);
        if (user is null)
        {
            return Result.Failure("user.notFound", "El usuario solicitado no existe.");
        }

        if (!string.Equals(user.TenantId, tenantId, StringComparison.OrdinalIgnoreCase))
        {
            return Result.Failure("user.forbidden", "No tienes permisos para eliminar usuarios de este tenant.");
        }

        if (user.IsDeleted)
        {
            return Result.Success();
        }

        user.MarkDeleted();
        await _userRepository.DeleteAsync(user, cancellationToken);
        return Result.Success();
    }

    private static Result Validate(string? firstName, string? lastName, string? email, string? gender, DateOnly? dateOfBirth)
    {
        if (string.IsNullOrWhiteSpace(firstName))
        {
            return Result.Failure("validation.firstName.required", "El nombre es requerido.");
        }

        if (string.IsNullOrWhiteSpace(lastName))
        {
            return Result.Failure("validation.lastName.required", "El apellido es requerido.");
        }

        if (string.IsNullOrWhiteSpace(email))
        {
            return Result.Failure("validation.email.required", "El correo es requerido.");
        }

        if (!email.Contains('@', StringComparison.Ordinal))
        {
            return Result.Failure("validation.email.invalid", "El formato del correo no es valido.");
        }

        if (string.IsNullOrWhiteSpace(gender))
        {
            return Result.Failure("validation.gender.required", "El genero es requerido.");
        }

        if (dateOfBirth is null)
        {
            return Result.Failure("validation.dateOfBirth.required", "La fecha de nacimiento es requerida.");
        }

        if (dateOfBirth > DateOnly.FromDateTime(DateTime.UtcNow))
        {
            return Result.Failure("validation.dateOfBirth.future", "La fecha de nacimiento no puede estar en el futuro.");
        }

        return Result.Success();
    }

    private async Task<Result<Guid?>> ResolveRoleAsync(string tenantId, Guid? roleId, CancellationToken cancellationToken)
    {
        if (!roleId.HasValue)
        {
            return Result<Guid?>.Success(null);
        }

        var role = await _roleRepository.GetByIdAsync(tenantId, roleId.Value, includeGlobal: true, cancellationToken);
        if (role is null)
        {
            return Result<Guid?>.Failure("role.notFound", "El rol seleccionado no existe.");
        }

        return Result<Guid?>.Success(role.Id);
    }

    private static string NormalizeTenant(string? requestTenantId, string fallbackTenantId)
    {
        return string.IsNullOrWhiteSpace(requestTenantId) ? fallbackTenantId : requestTenantId.Trim();
    }

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();

    private static Gender MapGender(string gender)
    {
        return Enum.TryParse<Gender>(gender, true, out var parsed)
            ? parsed
            : Gender.Other;
    }
}
