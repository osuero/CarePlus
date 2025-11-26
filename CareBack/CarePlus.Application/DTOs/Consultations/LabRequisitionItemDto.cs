using System;
using System.ComponentModel.DataAnnotations;

namespace CarePlus.Application.DTOs.Consultations;

public class LabRequisitionItemDto
{
    public Guid? Id { get; set; }

    [Required, MaxLength(256)]
    public string? TestName { get; set; }

    [MaxLength(64)]
    public string? TestCode { get; set; }

    [MaxLength(512)]
    public string? Instructions { get; set; }
}
