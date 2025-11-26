using System;
using System.ComponentModel.DataAnnotations;

namespace CarePlus.Application.DTOs.Consultations;

public class PrescriptionItemDto
{
    public Guid? Id { get; set; }

    [Required, MaxLength(256)]
    public string? DrugName { get; set; }

    [MaxLength(128)]
    public string? Dosage { get; set; }

    [MaxLength(128)]
    public string? Frequency { get; set; }

    [MaxLength(128)]
    public string? Route { get; set; }

    [MaxLength(128)]
    public string? Duration { get; set; }

    [MaxLength(512)]
    public string? Instructions { get; set; }
}
