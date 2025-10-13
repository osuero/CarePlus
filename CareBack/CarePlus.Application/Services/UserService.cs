using System;
using System.Threading;
using CarePlus.Application.DTOs.Users;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Mappers;
using CarePlus.Application.Models;
using CarePlus.Domain.Entities;
using CarePlus.Domain.Enums;

namespace CarePlus.Application.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<Result<UserResponse>> RegisterAsync(
        string tenantId,
        RegisterUserRequest request,
        CancellationToken cancellationToken = default)
    {
        var validationResult = Validate(request);
        if (!validationResult.IsSuccess)
        {
            return Result<UserResponse>.Failure(validationResult.ErrorCode!, validationResult.ErrorMessage!);
        }

        var normalizedEmail = request.Email!.Trim().ToLowerInvariant();
        var existingUser = await _userRepository.GetByEmailAsync(tenantId, normalizedEmail, cancellationToken);
        if (existingUser is not null)
        {
            return Result<UserResponse>.Failure("user.exists", "Ya existe un usuario registrado con el correo electronico proporcionado.");
        }

        var user = new User
        {
            TenantId = tenantId,
            FirstName = request.FirstName!.Trim(),
            LastName = request.LastName!.Trim(),
            Email = normalizedEmail,
            PhoneNumber = request.PhoneNumber?.Trim(),
            Identification = request.Identification?.Trim(),
            Country = request.Country?.Trim(),
            Gender = MapGender(request.Gender!),
            DateOfBirth = request.DateOfBirth!.Value
        };

        user = await _userRepository.AddAsync(user, cancellationToken);

        return Result<UserResponse>.Success(UserMapper.ToResponse(user));
    }

    private static Result Validate(RegisterUserRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FirstName))
        {
            return Result.Failure("validation.firstName.required", "El nombre es requerido.");
        }

        if (string.IsNullOrWhiteSpace(request.LastName))
        {
            return Result.Failure("validation.lastName.required", "El apellido es requerido.");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return Result.Failure("validation.email.required", "El correo es requerido.");
        }

        if (!request.Email.Contains('@', StringComparison.Ordinal))
        {
            return Result.Failure("validation.email.invalid", "El formato del correo no es valido.");
        }

        if (string.IsNullOrWhiteSpace(request.Gender))
        {
            return Result.Failure("validation.gender.required", "El genero es requerido.");
        }

        if (request.DateOfBirth is null)
        {
            return Result.Failure("validation.dateOfBirth.required", "La fecha de nacimiento es requerida.");
        }

        if (request.DateOfBirth > DateOnly.FromDateTime(DateTime.UtcNow))
        {
            return Result.Failure("validation.dateOfBirth.future", "La fecha de nacimiento no puede estar en el futuro.");
        }

        return Result.Success();
    }

    private static Gender MapGender(string gender)
    {
        return Enum.TryParse<Gender>(gender, true, out var parsed)
            ? parsed
            : Gender.Other;
    }
}
