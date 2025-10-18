using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Users;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Models;
using CarePlus.Application.Mappers;

namespace CarePlus.Application.Services;

public class UserQueryService(IUserRepository userRepository) : IUserQueryService
{
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<PagedResult<UserResponse>> SearchAsync(
        string tenantId,
        int page,
        int pageSize,
        string? search,
        string? role,
        CancellationToken cancellationToken = default)
    {
        if (page < 1)
        {
            page = 1;
        }

        if (pageSize <= 0)
        {
            pageSize = 20;
        }

        var skip = (page - 1) * pageSize;

        var users = await _userRepository.SearchAsync(tenantId, search, role, skip, pageSize, cancellationToken);
        var totalCount = await _userRepository.CountAsync(tenantId, search, role, cancellationToken);

        return new PagedResult<UserResponse>
        {
            Items = users.Select(UserMapper.ToResponse).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<UserResponse?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(tenantId, id, cancellationToken);
        return user is null ? null : UserMapper.ToResponse(user);
    }

    public async Task<UserResponse?> FindAsync(string tenantId, string search, CancellationToken cancellationToken = default)
    {
        if (Guid.TryParse(search, out var id))
        {
            return await GetByIdAsync(tenantId, id, cancellationToken);
        }

        var paged = await SearchAsync(tenantId, 1, 1, search, role: null, cancellationToken);
        return paged.Items.Count > 0 ? paged.Items[0] : null;
    }
}
