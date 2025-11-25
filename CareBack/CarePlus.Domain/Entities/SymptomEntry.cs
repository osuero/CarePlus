using System;
using CarePlus.Domain.Base;

namespace CarePlus.Domain.Entities;

public class SymptomEntry : TenantEntity
{
    public Guid Id { get; set; }
    public Guid ConsultationId { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime? OnsetDate { get; set; }
    public int? Severity { get; set; }
    public string? AdditionalNotes { get; set; }

    public Consultation? Consultation { get; set; }
}
