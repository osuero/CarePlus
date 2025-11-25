using System;
using CarePlus.Domain.Base;

namespace CarePlus.Domain.Entities;

public class LabRequisitionItem : TenantEntity
{
    public Guid Id { get; set; }
    public Guid LabRequisitionId { get; set; }
    public string TestName { get; set; } = string.Empty;
    public string? TestCode { get; set; }
    public string? Instructions { get; set; }

    public LabRequisition? LabRequisition { get; set; }
}
