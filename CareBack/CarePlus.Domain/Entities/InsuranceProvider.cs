using System.ComponentModel.DataAnnotations;
using CarePlus.Domain.Base;

namespace CarePlus.Domain.Entities;

public class InsuranceProvider : TenantEntity
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? ContactInformation { get; set; }
}
