using System;

namespace CarePlus.Application.DTOs.Consultations;

public class ConsultationListItemDto
{
    public Guid Id { get; init; }
    public DateTime ConsultationDateTime { get; init; }
    public string DoctorName { get; init; } = string.Empty;
    public string ReasonForVisit { get; init; } = string.Empty;
    public string SymptomSummary { get; init; } = string.Empty;
}
