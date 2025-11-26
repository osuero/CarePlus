using System;
using System.Linq;
using CarePlus.Application.DTOs.Consultations;
using CarePlus.Domain.Entities;

namespace CarePlus.Application.Mappers;

public static class ConsultationMapper
{
    public static ConsultationDetailDto ToDetail(Consultation consultation)
    {
        var patientName = BuildFullName(consultation.Patient?.FirstName, consultation.Patient?.LastName);

        var doctorName = BuildFullName(consultation.Doctor?.FirstName, consultation.Doctor?.LastName);

        return new ConsultationDetailDto
        {
            Id = consultation.Id,
            PatientId = consultation.PatientId,
            PatientFullName = patientName,
            DoctorId = consultation.DoctorId,
            DoctorName = doctorName,
            ConsultationDateTime = consultation.ConsultationDateTime,
            ReasonForVisit = consultation.ReasonForVisit,
            Notes = consultation.Notes,
            Symptoms = consultation.Symptoms
                .OrderBy(symptom => symptom.OnsetDate ?? DateTime.MaxValue)
                .ThenBy(symptom => symptom.Description)
                .Select(ToSymptomDto)
                .ToList(),
            LabRequisition = ToLabRequisitionDto(consultation.LabRequisition),
            Prescription = ToPrescriptionDto(consultation.Prescription)
        };
    }

    public static ConsultationListItemDto ToListItem(Consultation consultation)
    {
        var doctorName = BuildFullName(consultation.Doctor?.FirstName, consultation.Doctor?.LastName);
        var patientName = BuildFullName(consultation.Patient?.FirstName, consultation.Patient?.LastName);

        var summary = consultation.Symptoms.Count == 0
            ? string.Empty
            : string.Join(", ", consultation.Symptoms
                .Where(symptom => !string.IsNullOrWhiteSpace(symptom.Description))
                .Select(symptom => symptom.Description.Trim())
                .Where(description => description.Length > 0)
                .Take(3));

        return new ConsultationListItemDto
        {
            Id = consultation.Id,
            PatientId = consultation.PatientId,
            PatientFullName = patientName,
            ConsultationDateTime = consultation.ConsultationDateTime,
            DoctorName = doctorName,
            ReasonForVisit = consultation.ReasonForVisit,
            SymptomSummary = summary
        };
    }

    public static SymptomEntryDto ToSymptomDto(SymptomEntry symptom)
    {
        return new SymptomEntryDto
        {
            Description = symptom.Description,
            OnsetDate = symptom.OnsetDate,
            Severity = symptom.Severity,
            AdditionalNotes = symptom.AdditionalNotes
        };
    }

    private static LabRequisitionDto? ToLabRequisitionDto(LabRequisition? requisition)
    {
        if (requisition is null)
        {
            return null;
        }

        return new LabRequisitionDto
        {
            Id = requisition.Id,
            RequisitionDate = requisition.RequisitionDate,
            Notes = requisition.Notes,
            Items = requisition.Items
                .OrderBy(item => item.TestName)
                .Select(item => new LabRequisitionItemDto
                {
                    Id = item.Id,
                    TestName = item.TestName,
                    TestCode = item.TestCode,
                    Instructions = item.Instructions
                })
                .ToList()
        };
    }

    private static PrescriptionDto? ToPrescriptionDto(Prescription? prescription)
    {
        if (prescription is null)
        {
            return null;
        }

        return new PrescriptionDto
        {
            Id = prescription.Id,
            PrescriptionDate = prescription.PrescriptionDate,
            DoctorName = prescription.DoctorName,
            DoctorCode = prescription.DoctorCode,
            MedicalCenterName = prescription.MedicalCenterName,
            Notes = prescription.Notes,
            Items = prescription.Items
                .OrderBy(item => item.DrugName)
                .Select(item => new PrescriptionItemDto
                {
                    Id = item.Id,
                    DrugName = item.DrugName,
                    Dosage = item.Dosage,
                    Frequency = item.Frequency,
                    Route = item.Route,
                    Duration = item.Duration,
                    Instructions = item.Instructions
                })
                .ToList()
        };
    }

    private static string BuildFullName(string? firstName, string? lastName)
    {
        return $"{firstName ?? string.Empty} {lastName ?? string.Empty}".Trim();
    }
}
