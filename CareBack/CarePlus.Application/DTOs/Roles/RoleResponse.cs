using System;

namespace CarePlus.Application.DTOs.Roles;

public class RoleResponse
{
    public Guid Id { get; init; }
    public string TenantId { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public bool IsGlobal { get; init; }
    public DateTime CreatedAtUtc { get; init; }
    public DateTime UpdatedAtUtc { get; init; }
}
