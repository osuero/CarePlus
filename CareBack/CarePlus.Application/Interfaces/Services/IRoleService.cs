using CarePlus.Application.DTOs.Roles;
using CarePlus.Application.Models;

namespace CarePlus.Application.Interfaces.Services;

public interface IRoleService
{
    Task<Result<RoleResponse>> CreateAsync(string tenantId, CreateRoleRequest request, CancellationToken cancellationToken = default);
    Task<Result<RoleResponse>> UpdateAsync(string tenantId, Guid id, UpdateRoleRequest request, CancellationToken cancellationToken = default);
    Task<Result> DeleteAsync(string tenantId, Guid id, CancellationToken cancellationToken = default);
}
