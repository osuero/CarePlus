using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Patients;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Mappers;
using CarePlus.Application.Models;
using CarePlus.Domain.Entities;
using CarePlus.Domain.Enums;

namespace CarePlus.Application.Services;

public class PatientService : IPatientService
{
    private readonly IPatientRepository _patientRepository;
    private readonly IUserQueryService _userQueryService;

    public PatientService(
        IPatientRepository patientRepository,
        IUserQueryService userQueryService)
    {
        _patientRepository = patientRepository;
        _userQueryService = userQueryService;
    }

    public async Task<Result<PatientResponse>> RegisterAsync(
        string tenantId,
        RegisterPatientRequest request,
        CancellationToken cancellationToken = default)
    {
        var validationResult = Validate(request.FirstName, request.LastName, request.Email, request.Gender, request.DateOfBirth);
        if (!validationResult.IsSuccess)
        {
            return Result<PatientResponse>.Failure(validationResult.ErrorCode!, validationResult.ErrorMessage!);
        }

        var effectiveTenantId = NormalizeTenant(request.TenantId, tenantId);
        var normalizedEmail = NormalizeEmail(request.Email!);
        var existingPatient = await _patientRepository.GetByEmailAsync(effectiveTenantId, normalizedEmail, cancellationToken);
        if (existingPatient is not null)
        {
            return Result<PatientResponse>.Failure("patient.exists", "Ya existe un paciente registrado con el correo proporcionado.");
        }

        var assignedDoctorResult = await ResolveDoctorAsync(
            effectiveTenantId,
            request.AssignedDoctorId,
            cancellationToken);

        if (!assignedDoctorResult.IsSuccess)
        {
            return Result<PatientResponse>.Failure(
                assignedDoctorResult.ErrorCode!,
                assignedDoctorResult.ErrorMessage!);
        }

        var patient = new Patient
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
            AssignedDoctorId = assignedDoctorResult.Value?.DoctorId,
            AssignedDoctorName = assignedDoctorResult.Value?.DoctorName
        };

        patient = await _patientRepository.AddAsync(patient, cancellationToken);

        return Result<PatientResponse>.Success(PatientMapper.ToResponse(patient));
    }

    public async Task<Result<PatientResponse>> UpdateAsync(
        string tenantId,
        Guid id,
        UpdatePatientRequest request,
        CancellationToken cancellationToken = default)
    {
        var validationResult = Validate(request.FirstName, request.LastName, request.Email, request.Gender, request.DateOfBirth);
        if (!validationResult.IsSuccess)
        {
            return Result<PatientResponse>.Failure(validationResult.ErrorCode!, validationResult.ErrorMessage!);
        }

        var patient = await _patientRepository.GetByIdForUpdateAsync(id, cancellationToken);
        if (patient is null || patient.IsDeleted)
        {
            return Result<PatientResponse>.Failure("patient.notFound", "El paciente solicitado no existe.");
        }

        var effectiveTenantId = NormalizeTenant(request.TenantId, patient.TenantId);
        var normalizedEmail = NormalizeEmail(request.Email!);

        if (!string.Equals(patient.Email, normalizedEmail, StringComparison.OrdinalIgnoreCase) ||
            !string.Equals(patient.TenantId, effectiveTenantId, StringComparison.OrdinalIgnoreCase))
        {
            var existingPatient = await _patientRepository.GetByEmailAsync(effectiveTenantId, normalizedEmail, cancellationToken);
            if (existingPatient is not null && existingPatient.Id != patient.Id)
            {
                return Result<PatientResponse>.Failure("patient.exists", "Ya existe un paciente registrado con el correo proporcionado.");
            }
        }

        var assignedDoctorResult = await ResolveDoctorAsync(
            effectiveTenantId,
            request.AssignedDoctorId,
            cancellationToken);

        if (!assignedDoctorResult.IsSuccess)
        {
            return Result<PatientResponse>.Failure(
                assignedDoctorResult.ErrorCode!,
                assignedDoctorResult.ErrorMessage!);
        }

        patient.TenantId = effectiveTenantId;
        patient.FirstName = request.FirstName!.Trim();
        patient.LastName = request.LastName!.Trim();
        patient.Email = normalizedEmail;
        patient.PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber) ? null : request.PhoneNumber.Trim();
        patient.Identification = string.IsNullOrWhiteSpace(request.Identification) ? null : request.Identification.Trim();
        patient.Country = string.IsNullOrWhiteSpace(request.Country) ? null : request.Country.Trim();
        patient.Gender = MapGender(request.Gender!);
        patient.DateOfBirth = request.DateOfBirth!.Value;
        patient.AssignedDoctorId = assignedDoctorResult.Value?.DoctorId;
        patient.AssignedDoctorName = assignedDoctorResult.Value?.DoctorName;
        patient.Touch();

        var updatedPatient = await _patientRepository.UpdateAsync(patient, cancellationToken);
        return Result<PatientResponse>.Success(PatientMapper.ToResponse(updatedPatient));
    }

    public async Task<Result> DeleteAsync(
        string tenantId,
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var patient = await _patientRepository.GetByIdForUpdateAsync(id, cancellationToken);
        if (patient is null)
        {
            return Result.Failure("patient.notFound", "El paciente solicitado no existe.");
        }

        if (!string.Equals(patient.TenantId, tenantId, StringComparison.OrdinalIgnoreCase))
        {
            return Result.Failure("patient.forbidden", "No tienes permisos para eliminar pacientes de este tenant.");
        }

        if (patient.IsDeleted)
        {
            return Result.Success();
        }

        patient.MarkDeleted();
        await _patientRepository.DeleteAsync(patient, cancellationToken);
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

    private async Task<Result<(Guid DoctorId, string DoctorName)?>> ResolveDoctorAsync(
        string tenantId,
        Guid? doctorId,
        CancellationToken cancellationToken)
    {
        if (doctorId is null || doctorId == Guid.Empty)
        {
            return Result<(Guid, string)?>.Success(null);
        }

        var doctor = await _userQueryService.GetByIdAsync(tenantId, doctorId.Value, cancellationToken);
        if (doctor is null)
        {
            return Result<(Guid, string)?>.Failure(
                "patient.doctor.notFound",
                "El doctor seleccionado no existe en el tenant actual.");
        }

        if (!string.Equals(doctor.RoleName, "Doctor", StringComparison.OrdinalIgnoreCase))
        {
            return Result<(Guid, string)?>.Failure(
                "patient.doctor.invalidRole",
                "El usuario seleccionado no tiene el rol de doctor.");
        }

        var fullName = string.Join(
            " ",
            new[] { doctor.FirstName, doctor.LastName }
                .Where(part => !string.IsNullOrWhiteSpace(part))
                .Select(part => part.Trim()));

        return Result<(Guid, string)?>.Success((doctor.Id, fullName));
    }
}
