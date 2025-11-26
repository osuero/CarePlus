using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CarePlus.Application.DTOs.Consultations;

public class LabRequisitionDto
{
    public Guid? Id { get; set; }
    public DateTime? RequisitionDate { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }

    public List<LabRequisitionItemDto> Items { get; set; } = new();
}
