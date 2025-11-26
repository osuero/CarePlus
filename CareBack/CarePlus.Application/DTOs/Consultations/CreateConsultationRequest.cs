using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CarePlus.Application.DTOs.Consultations;

public class CreateConsultationRequest
{
    [Required]
    public Guid? PatientId { get; set; }

    [Required]
    public Guid? DoctorId { get; set; }

    [Required]
    public DateTime? ConsultationDateTime { get; set; }

    [Required, MaxLength(512)]
    public string? ReasonForVisit { get; set; }

    [MaxLength(2000)]
    public string? Notes { get; set; }

    public List<SymptomEntryDto> Symptoms { get; set; } = new();
    public LabRequisitionDto? LabRequisition { get; set; }
    public PrescriptionDto? Prescription { get; set; }
}
