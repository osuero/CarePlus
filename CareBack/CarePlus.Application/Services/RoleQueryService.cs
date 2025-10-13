using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Roles;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Mappers;
using CarePlus.Application.Models;

namespace CarePlus.Application.Services;

public class RoleQueryService(IRoleRepository roleRepository) : IRoleQueryService
{
    private readonly IRoleRepository _roleRepository = roleRepository;

    public async Task<PagedResult<RoleResponse>> SearchAsync(
        string tenantId,
        int page,
        int pageSize,
        string? search,
        bool includeGlobal,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await _roleRepository.SearchAsync(tenantId, page, pageSize, search, includeGlobal, cancellationToken);

        var responses = items.Select(RoleMapper.ToResponse).ToList();

        return new PagedResult<RoleResponse>
        {
            Items = responses,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<RoleResponse?> GetByIdAsync(string tenantId, Guid id, bool includeGlobal, CancellationToken cancellationToken = default)
    {
        var role = await _roleRepository.GetByIdAsync(tenantId, id, includeGlobal, cancellationToken);
        return role is null ? null : RoleMapper.ToResponse(role);
    }
}
