using System;
using System.ComponentModel.DataAnnotations;

namespace CarePlus.Application.DTOs.Consultations;

public class SymptomEntryDto
{
    [Required, MaxLength(512)]
    public string? Description { get; set; }

    public DateTime? OnsetDate { get; set; }

    public int? Severity { get; set; }

    [MaxLength(1000)]
    public string? AdditionalNotes { get; set; }
}
