using System;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Appointments;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Mappers;
using CarePlus.Application.Models;
using CarePlus.Domain.Entities;
using CarePlus.Domain.Enums;

namespace CarePlus.Application.Services;

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IUserRepository _userRepository;

    public AppointmentService(
        IAppointmentRepository appointmentRepository,
        IPatientRepository patientRepository,
        IUserRepository userRepository)
    {
        _appointmentRepository = appointmentRepository;
        _patientRepository = patientRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<AppointmentResponse>> ScheduleAsync(
        string tenantId,
        ScheduleAppointmentRequest request,
        CancellationToken cancellationToken = default)
    {
        var validation = await ValidateAsync(tenantId, request, cancellationToken);
        if (!validation.IsSuccess)
        {
            return Result<AppointmentResponse>.Failure(
                validation.ErrorCode!,
                validation.ErrorMessage!);
        }

        var patient = validation.Value!.Patient;
        var doctor = validation.Value.Doctor;

        var appointment = new Appointment
        {
            TenantId = tenantId,
            PatientId = patient?.Id,
            PatientNameSnapshot = patient is not null
                ? $"{patient.FirstName} {patient.LastName}".Trim()
                : BuildProspectName(request),
            ProspectFirstName = patient is null ? request.ProspectFirstName?.Trim() : null,
            ProspectLastName = patient is null ? request.ProspectLastName?.Trim() : null,
            ProspectPhoneNumber = patient is null ? request.ProspectPhoneNumber?.Trim() : null,
            ProspectEmail = patient is null ? request.ProspectEmail?.Trim() : patient.Email,
            DoctorId = doctor?.Id,
            DoctorNameSnapshot = doctor is null ? null : $"{doctor.FirstName} {doctor.LastName}".Trim(),
            Title = request.Title!.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            Location = string.IsNullOrWhiteSpace(request.Location) ? null : request.Location.Trim(),
            StartsAtUtc = request.StartsAtUtc!.Value,
            EndsAtUtc = request.EndsAtUtc!.Value,
            Status = MapStatus(request.Status),
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            ConsultationFee = request.ConsultationFee ?? 0,
            Currency = string.IsNullOrWhiteSpace(request.Currency)
                ? "USD"
                : request.Currency!.Trim().ToUpperInvariant()
        };

        appointment = await _appointmentRepository.AddAsync(appointment, cancellationToken);

        return Result<AppointmentResponse>.Success(AppointmentMapper.ToResponse(appointment));
    }

    public async Task<Result<AppointmentResponse>> UpdateAsync(
        string tenantId,
        Guid id,
        UpdateAppointmentRequest request,
        CancellationToken cancellationToken = default)
    {
        var appointment = await _appointmentRepository.GetByIdForUpdateAsync(id, cancellationToken);
        if (appointment is null)
        {
            return Result<AppointmentResponse>.Failure("appointment.notFound", "La cita solicitada no existe.");
        }

        if (!string.Equals(appointment.TenantId, tenantId, StringComparison.Ordinal))
        {
            return Result<AppointmentResponse>.Failure("appointment.forbidden", "No tienes permisos para actualizar esta cita.");
        }

        var validation = await ValidateAsync(tenantId, request, cancellationToken);
        if (!validation.IsSuccess)
        {
            return Result<AppointmentResponse>.Failure(
                validation.ErrorCode!,
                validation.ErrorMessage!);
        }

        var patient = validation.Value!.Patient;
        var doctor = validation.Value.Doctor;

        appointment.PatientId = patient?.Id;
        appointment.PatientNameSnapshot = patient is not null
            ? $"{patient.FirstName} {patient.LastName}".Trim()
            : BuildProspectName(request);
        appointment.ProspectFirstName = patient is null ? request.ProspectFirstName?.Trim() : null;
        appointment.ProspectLastName = patient is null ? request.ProspectLastName?.Trim() : null;
        appointment.ProspectPhoneNumber = patient is null ? request.ProspectPhoneNumber?.Trim() : null;
        appointment.ProspectEmail = patient is null ? request.ProspectEmail?.Trim() : patient?.Email;
        appointment.DoctorId = doctor?.Id;
        appointment.DoctorNameSnapshot = doctor is null ? null : $"{doctor.FirstName} {doctor.LastName}".Trim();
        appointment.Title = request.Title!.Trim();
        appointment.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        appointment.Location = string.IsNullOrWhiteSpace(request.Location) ? null : request.Location.Trim();
        appointment.StartsAtUtc = request.StartsAtUtc!.Value;
        appointment.EndsAtUtc = request.EndsAtUtc!.Value;
        appointment.Status = MapStatus(request.Status);
        appointment.Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim();
        appointment.ConsultationFee = request.ConsultationFee ?? 0;
        appointment.Currency = string.IsNullOrWhiteSpace(request.Currency)
            ? appointment.Currency
            : request.Currency!.Trim().ToUpperInvariant();
        appointment.Touch();

        appointment = await _appointmentRepository.UpdateAsync(appointment, cancellationToken);

        return Result<AppointmentResponse>.Success(AppointmentMapper.ToResponse(appointment));
    }

    public async Task<Result> CancelAsync(
        string tenantId,
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var appointment = await _appointmentRepository.GetByIdForUpdateAsync(id, cancellationToken);
        if (appointment is null)
        {
            return Result.Failure("appointment.notFound", "La cita solicitada no existe.");
        }

        if (!string.Equals(appointment.TenantId, tenantId, StringComparison.Ordinal))
        {
            return Result.Failure("appointment.forbidden", "No tienes permisos para cancelar esta cita.");
        }

        if (appointment.Status == AppointmentStatus.Cancelled)
        {
            return Result.Success();
        }

        appointment.Status = AppointmentStatus.Cancelled;
        appointment.Touch();
        await _appointmentRepository.UpdateAsync(appointment, cancellationToken);

        return Result.Success();
    }

    public async Task<Result> DeleteAsync(
        string tenantId,
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var appointment = await _appointmentRepository.GetByIdForUpdateAsync(id, cancellationToken);
        if (appointment is null)
        {
            return Result.Failure("appointment.notFound", "La cita solicitada no existe.");
        }

        if (!string.Equals(appointment.TenantId, tenantId, StringComparison.Ordinal))
        {
            return Result.Failure("appointment.forbidden", "No tienes permisos para eliminar esta cita.");
        }

        if (appointment.IsDeleted)
        {
            return Result.Success();
        }

        appointment.MarkDeleted();
        await _appointmentRepository.DeleteAsync(appointment, cancellationToken);

        return Result.Success();
    }

    private async Task<Result<(Patient? Patient, User? Doctor)>> ValidateAsync(
        string tenantId,
        ScheduleAppointmentRequest request,
        CancellationToken cancellationToken)
    {
        Patient? patient = null;

        if (request.PatientId.HasValue && request.PatientId.Value != Guid.Empty)
        {
            patient = await _patientRepository.GetByIdAsync(tenantId, request.PatientId.Value, cancellationToken);
            if (patient is null)
            {
                return Result<(Patient?, User?)>.Failure("patient.notFound", "El paciente seleccionado no existe.");
            }
        }

        if (patient is null)
        {
            if (string.IsNullOrWhiteSpace(request.ProspectFirstName))
            {
                return Result<(Patient?, User?)>.Failure("validation.prospect.firstName", "El nombre del paciente es requerido.");
            }

            if (string.IsNullOrWhiteSpace(request.ProspectLastName))
            {
                return Result<(Patient?, User?)>.Failure("validation.prospect.lastName", "El apellido del paciente es requerido.");
            }

            if (string.IsNullOrWhiteSpace(request.ProspectPhoneNumber))
            {
                return Result<(Patient?, User?)>.Failure("validation.prospect.phone", "El telefono del paciente es requerido.");
            }
        }

        if (string.IsNullOrWhiteSpace(request.Title))
        {
            return Result<(Patient?, User?)>.Failure("validation.title.required", "El titulo de la cita es requerido.");
        }

        if (request.StartsAtUtc is null)
        {
            return Result<(Patient?, User?)>.Failure("validation.startsAt.required", "La fecha de inicio es requerida.");
        }

        if (request.EndsAtUtc is null)
        {
            return Result<(Patient?, User?)>.Failure("validation.endsAt.required", "La fecha de finalizacion es requerida.");
        }

        if (request.EndsAtUtc <= request.StartsAtUtc)
        {
            return Result<(Patient?, User?)>.Failure("validation.endsAt.beforeStart", "La fecha de finalizacion debe ser posterior a la fecha de inicio.");
        }

        if (request.ConsultationFee.HasValue && request.ConsultationFee.Value < 0)
        {
            return Result<(Patient?, User?)>.Failure("validation.consultation.amount", "El costo de la consulta no puede ser negativo.");
        }

        if (!string.IsNullOrWhiteSpace(request.Currency) && request.Currency!.Trim().Length > 16)
        {
            return Result<(Patient?, User?)>.Failure("validation.consultation.currency", "La moneda es demasiado larga.");
        }

        User? doctor = null;
        if (request.DoctorId.HasValue)
        {
            doctor = await _userRepository.GetByIdAsync(tenantId, request.DoctorId.Value, cancellationToken);
            if (doctor is null)
            {
                return Result<(Patient?, User?)>.Failure("doctor.notFound", "El doctor seleccionado no existe.");
            }
        }

        return Result<(Patient?, User?)>.Success((patient, doctor));
    }

    private static AppointmentStatus MapStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status))
        {
            return AppointmentStatus.Scheduled;
        }

        return Enum.TryParse<AppointmentStatus>(status, true, out var parsed)
            ? parsed
            : AppointmentStatus.Scheduled;
    }

    private static string BuildProspectName(ScheduleAppointmentRequest request)
    {
        var firstName = request.ProspectFirstName?.Trim() ?? string.Empty;
        var lastName = request.ProspectLastName?.Trim() ?? string.Empty;
        return $"{firstName} {lastName}".Trim();
    }
}
