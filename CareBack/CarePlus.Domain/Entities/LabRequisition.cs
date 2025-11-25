using System;
using System.Collections.Generic;
using CarePlus.Domain.Base;

namespace CarePlus.Domain.Entities;

public class LabRequisition : TenantEntity
{
    public Guid Id { get; set; }
    public Guid ConsultationId { get; set; }
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid MedicalCenterId { get; set; }
    public DateTime RequisitionDate { get; set; }
    public string? Notes { get; set; }

    public Consultation? Consultation { get; set; }
    public ICollection<LabRequisitionItem> Items { get; set; } = new List<LabRequisitionItem>();
}
