using System;
using System.Collections.Generic;

namespace CarePlus.Application.DTOs.Consultations;

public class ConsultationDetailDto
{
    public Guid Id { get; init; }
    public Guid PatientId { get; init; }
    public string PatientFullName { get; init; } = string.Empty;
    public Guid DoctorId { get; init; }
    public string DoctorName { get; init; } = string.Empty;
    public DateTime ConsultationDateTime { get; init; }
    public string ReasonForVisit { get; init; } = string.Empty;
    public string? Notes { get; init; }
    public List<SymptomEntryDto> Symptoms { get; init; } = new();
    public LabRequisitionDto? LabRequisition { get; init; }
    public PrescriptionDto? Prescription { get; init; }
}
