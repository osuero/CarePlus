using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CarePlus.Application.DTOs.Consultations;

public class PrescriptionDto
{
    public Guid? Id { get; set; }
    public DateTime? PrescriptionDate { get; set; }

    [MaxLength(256)]
    public string? DoctorName { get; set; }

    [MaxLength(64)]
    public string? DoctorCode { get; set; }

    [MaxLength(256)]
    public string? MedicalCenterName { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }

    public List<PrescriptionItemDto> Items { get; set; } = new();
}
