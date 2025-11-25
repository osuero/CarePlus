using System;
using CarePlus.Domain.Base;

namespace CarePlus.Domain.Entities;

public class PrescriptionItem : TenantEntity
{
    public Guid Id { get; set; }
    public Guid PrescriptionId { get; set; }
    public string DrugName { get; set; } = string.Empty;
    public string Dosage { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public string Route { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty;
    public string? Instructions { get; set; }

    public Prescription? Prescription { get; set; }
}
