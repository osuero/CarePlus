using System;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Users;
using CarePlus.Application.Models;

namespace CarePlus.Application.Interfaces.Services;

public interface IUserQueryService
{
    Task<PagedResult<UserResponse>> SearchAsync(
        string tenantId,
        int page,
        int pageSize,
        string? search,
        string? role,
        CancellationToken cancellationToken = default);

    Task<UserResponse?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default);

    Task<UserResponse?> FindAsync(string tenantId, string search, CancellationToken cancellationToken = default);
}
