using System;
using System.Linq;
using CarePlus.Application.DTOs.Consultations;
using CarePlus.Domain.Entities;

namespace CarePlus.Application.Mappers;

public static class ConsultationMapper
{
    public static ConsultationDetailDto ToDetail(Consultation consultation)
    {
        var patientName = consultation.Patient is null
            ? string.Empty
            : $"{consultation.Patient.FirstName} {consultation.Patient.LastName}".Trim();

        var doctorName = consultation.Doctor is null
            ? string.Empty
            : $"{consultation.Doctor.FirstName} {consultation.Doctor.LastName}".Trim();

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
                .ToList()
        };
    }

    public static ConsultationListItemDto ToListItem(Consultation consultation)
    {
        var doctorName = consultation.Doctor is null
            ? string.Empty
            : $"{consultation.Doctor.FirstName} {consultation.Doctor.LastName}".Trim();

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
}
