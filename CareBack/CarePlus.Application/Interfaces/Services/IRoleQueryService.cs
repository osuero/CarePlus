using CarePlus.Application.DTOs.Roles;
using CarePlus.Application.Models;

namespace CarePlus.Application.Interfaces.Services;

public interface IRoleQueryService
{
    Task<PagedResult<RoleResponse>> SearchAsync(
        string tenantId,
        int page,
        int pageSize,
        string? search,
        bool includeGlobal,
        CancellationToken cancellationToken = default);

    Task<RoleResponse?> GetByIdAsync(string tenantId, Guid id, bool includeGlobal, CancellationToken cancellationToken = default);
}
