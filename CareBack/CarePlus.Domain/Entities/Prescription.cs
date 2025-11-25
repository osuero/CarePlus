using System;
using System.Collections.Generic;
using CarePlus.Domain.Base;

namespace CarePlus.Domain.Entities;

public class Prescription : TenantEntity
{
    public Guid Id { get; set; }
    public Guid ConsultationId { get; set; }
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid MedicalCenterId { get; set; }
    public DateTime PrescriptionDate { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public string DoctorCode { get; set; } = string.Empty;
    public string MedicalCenterName { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }

    public Consultation? Consultation { get; set; }
    public ICollection<PrescriptionItem> Items { get; set; } = new List<PrescriptionItem>();
}
