using System;
using System.Collections.Generic;
using CarePlus.Domain.Base;

namespace CarePlus.Domain.Entities;

public class Consultation : TenantEntity
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid MedicalCenterId { get; set; }
    public DateTime ConsultationDateTime { get; set; }
    public string ReasonForVisit { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Patient? Patient { get; set; }
    public User? Doctor { get; set; }
    public ICollection<SymptomEntry> Symptoms { get; set; } = new List<SymptomEntry>();
    public Prescription? Prescription { get; set; }
    public LabRequisition? LabRequisition { get; set; }
}
