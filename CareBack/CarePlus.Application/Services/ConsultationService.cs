using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Consultations;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Mappers;
using CarePlus.Application.Models;
using CarePlus.Domain.Entities;

namespace CarePlus.Application.Services;

public class ConsultationService(
    IConsultationRepository consultationRepository,
    IPatientRepository patientRepository,
    IUserRepository userRepository) : IConsultationService
{
    private readonly IConsultationRepository _consultationRepository = consultationRepository;
    private readonly IPatientRepository _patientRepository = patientRepository;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<Result<ConsultationDetailDto>> CreateAsync(
        string tenantId,
        CreateConsultationRequest request,
        CancellationToken cancellationToken = default)
    {
        var validation = await ValidateParticipantsAsync(tenantId, request.PatientId, request.DoctorId, cancellationToken);
        if (!validation.IsSuccess)
        {
            return Result<ConsultationDetailDto>.Failure(validation.ErrorCode!, validation.ErrorMessage!);
        }

        var consultation = new Consultation
        {
            TenantId = tenantId,
            PatientId = request.PatientId!.Value,
            DoctorId = request.DoctorId!.Value,
            ConsultationDateTime = request.ConsultationDateTime!.Value,
            ReasonForVisit = request.ReasonForVisit!.Trim(),
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            MedicalCenterId = Guid.Empty,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var symptoms = BuildSymptoms(tenantId, request.Symptoms);
        consultation = await _consultationRepository.AddAsync(consultation, symptoms, cancellationToken);

        var persisted = await _consultationRepository.GetByIdWithSymptomsAsync(tenantId, consultation.Id, cancellationToken)
            ?? consultation;

        return Result<ConsultationDetailDto>.Success(ConsultationMapper.ToDetail(persisted));
    }

    public async Task<Result<ConsultationDetailDto>> UpdateAsync(
        string tenantId,
        Guid id,
        UpdateConsultationRequest request,
        CancellationToken cancellationToken = default)
    {
        var consultation = await _consultationRepository.GetByIdForUpdateAsync(id, cancellationToken);
        if (consultation is null)
        {
            return Result<ConsultationDetailDto>.Failure("consultation.notFound", "La consulta no existe.");
        }

        if (!string.Equals(consultation.TenantId, tenantId, StringComparison.Ordinal))
        {
            return Result<ConsultationDetailDto>.Failure("consultation.forbidden", "No tienes permisos para modificar esta consulta.");
        }

        consultation.ReasonForVisit = request.ReasonForVisit!.Trim();
        consultation.Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim();
        consultation.Touch();

        var symptoms = BuildSymptoms(tenantId, request.Symptoms);
        await _consultationRepository.UpdateAsync(consultation, symptoms, cancellationToken);

        var refreshed = await _consultationRepository.GetByIdWithSymptomsAsync(tenantId, id, cancellationToken)
            ?? consultation;

        return Result<ConsultationDetailDto>.Success(ConsultationMapper.ToDetail(refreshed));
    }

    private async Task<Result> ValidateParticipantsAsync(
        string tenantId,
        Guid? patientId,
        Guid? doctorId,
        CancellationToken cancellationToken)
    {
        if (!patientId.HasValue || patientId.Value == Guid.Empty)
        {
            return Result.Failure("consultation.patient.required", "El paciente es obligatorio.");
        }

        if (!doctorId.HasValue || doctorId.Value == Guid.Empty)
        {
            return Result.Failure("consultation.doctor.required", "El doctor es obligatorio.");
        }

        var patient = await _patientRepository.GetByIdAsync(tenantId, patientId.Value, cancellationToken);
        if (patient is null)
        {
            return Result.Failure("consultation.patient.notFound", "El paciente seleccionado no existe.");
        }

        var doctor = await _userRepository.GetByIdAsync(tenantId, doctorId.Value, cancellationToken);
        if (doctor is null)
        {
            return Result.Failure("consultation.doctor.notFound", "El doctor seleccionado no existe.");
        }

        return Result.Success();
    }

    private static IEnumerable<SymptomEntry> BuildSymptoms(string tenantId, IEnumerable<SymptomEntryDto> requestSymptoms)
    {
        return requestSymptoms
            .Where(symptom => !string.IsNullOrWhiteSpace(symptom.Description))
            .Select(symptom => new SymptomEntry
            {
                TenantId = tenantId,
                Description = symptom.Description!.Trim(),
                OnsetDate = symptom.OnsetDate,
                Severity = symptom.Severity,
                AdditionalNotes = string.IsNullOrWhiteSpace(symptom.AdditionalNotes)
                    ? null
                    : symptom.AdditionalNotes!.Trim()
            })
            .ToList();
    }
}
