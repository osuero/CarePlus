using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Domain.Constants;
using CarePlus.Domain.Entities;
using CarePlus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CarePlus.Infrastructure.Repositories;

public class RoleRepository(ApplicationDbContext context) : IRoleRepository
{
    private readonly ApplicationDbContext _context = context;

    public async Task<Role?> GetByIdAsync(string tenantId, Guid id, bool includeGlobal = true, CancellationToken cancellationToken = default)
    {
        return await _context.Roles
            .AsNoTracking()
            .FirstOrDefaultAsync(role => role.Id == id && (role.TenantId == tenantId || (includeGlobal && role.IsGlobal)), cancellationToken);
    }

    public async Task<Role?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Roles
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(role => role.Id == id, cancellationToken);
    }

    public async Task<Role?> GetByNameAsync(string tenantId, string name, CancellationToken cancellationToken = default)
    {
        var normalized = name.Trim();
        var normalizedLower = normalized.ToLower();

        return await _context.Roles
            .IgnoreQueryFilters()
            .AsNoTracking()
            .FirstOrDefaultAsync(role => role.TenantId == tenantId && !role.IsDeleted && role.Name.ToLower() == normalizedLower, cancellationToken);
    }

    public async Task<(IReadOnlyList<Role> Items, int TotalCount)> SearchAsync(
        string tenantId,
        int page,
        int pageSize,
        string? search,
        bool includeGlobal,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Roles
            .AsNoTracking()
            .Where(role => role.TenantId == tenantId || (includeGlobal && role.IsGlobal));

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = $"%{search.Trim()}%";
            query = query.Where(role =>
                EF.Functions.Like(role.Name, term) ||
                (role.Description != null && EF.Functions.Like(role.Description, term)));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderBy(role => role.IsGlobal ? 0 : 1)
            .ThenBy(role => role.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<Role> AddAsync(Role role, CancellationToken cancellationToken = default)
    {
        if (role.IsGlobal)
        {
            role.TenantId = TenantConstants.GlobalTenantId;
        }

        await _context.Roles.AddAsync(role, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return role;
    }

    public async Task<Role> UpdateAsync(Role role, CancellationToken cancellationToken = default)
    {
        if (role.IsGlobal)
        {
            role.TenantId = TenantConstants.GlobalTenantId;
        }

        _context.Roles.Update(role);
        await _context.SaveChangesAsync(cancellationToken);
        return role;
    }

    public async Task DeleteAsync(Role role, CancellationToken cancellationToken = default)
    {
        _context.Roles.Update(role);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
