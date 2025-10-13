using System.ComponentModel.DataAnnotations;

namespace CarePlus.Application.DTOs.Roles;

public class UpdateRoleRequest
{
    [Required, MaxLength(100)]
    public string? Name { get; set; }

    [MaxLength(256)]
    public string? Description { get; set; }

    public bool IsGlobal { get; set; }
}
