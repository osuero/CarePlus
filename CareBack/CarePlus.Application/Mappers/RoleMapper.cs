using CarePlus.Application.DTOs.Roles;
using CarePlus.Domain.Entities;

namespace CarePlus.Application.Mappers;

internal static class RoleMapper
{
    public static RoleResponse ToResponse(Role role)
    {
        return new RoleResponse
        {
            Id = role.Id,
            TenantId = role.TenantId,
            Name = role.Name,
            Description = role.Description,
            IsGlobal = role.IsGlobal,
            CreatedAtUtc = role.CreatedAtUtc,
            UpdatedAtUtc = role.UpdatedAtUtc
        };
    }
}
