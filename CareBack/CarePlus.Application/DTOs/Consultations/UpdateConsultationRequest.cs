using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CarePlus.Application.DTOs.Consultations;

public class UpdateConsultationRequest
{
    [Required, MaxLength(512)]
    public string? ReasonForVisit { get; set; }

    [MaxLength(2000)]
    public string? Notes { get; set; }

    public List<SymptomEntryDto> Symptoms { get; set; } = new();
}
