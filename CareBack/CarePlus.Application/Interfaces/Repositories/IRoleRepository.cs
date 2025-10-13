using System;
using System.Collections.Generic;
using System.Threading;
using CarePlus.Domain.Entities;

namespace CarePlus.Application.Interfaces.Repositories;

public interface IRoleRepository
{
    Task<Role?> GetByIdAsync(string tenantId, Guid id, bool includeGlobal = true, CancellationToken cancellationToken = default);
    Task<Role?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Role?> GetByNameAsync(string tenantId, string name, CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<Role> Items, int TotalCount)> SearchAsync(
        string tenantId,
        int page,
        int pageSize,
        string? search,
        bool includeGlobal,
        CancellationToken cancellationToken = default);
    Task<Role> AddAsync(Role role, CancellationToken cancellationToken = default);
    Task<Role> UpdateAsync(Role role, CancellationToken cancellationToken = default);
    Task DeleteAsync(Role role, CancellationToken cancellationToken = default);
}
