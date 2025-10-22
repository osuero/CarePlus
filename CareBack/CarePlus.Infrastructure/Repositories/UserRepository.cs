using System;
using System.Linq;
using System.Threading;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Domain.Entities;
using CarePlus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CarePlus.Infrastructure.Repositories;

public class UserRepository(ApplicationDbContext context) : IUserRepository
{
    private readonly ApplicationDbContext _context = context;

    public async Task<User?> GetByEmailAsync(string tenantId, string email, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .Include(user => user.Role)
            .FirstOrDefaultAsync(user => user.TenantId == tenantId && user.Email == email, cancellationToken);
    }

    public async Task<User?> GetByEmailForAuthenticationAsync(string tenantId, string email, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .Include(user => user.Role)
            .FirstOrDefaultAsync(user => user.TenantId == tenantId && user.Email == email, cancellationToken);
    }

    public async Task<User?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .Include(user => user.Role)
            .FirstOrDefaultAsync(user => user.TenantId == tenantId && user.Id == id, cancellationToken);
    }

    public async Task<User?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .IgnoreQueryFilters()
            .Include(user => user.Role)
            .FirstOrDefaultAsync(user => user.Id == id, cancellationToken);
    }

    public async Task<User?> GetByPasswordSetupTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        var nowUtc = DateTime.UtcNow;
        return await _context.Users
            .IgnoreQueryFilters()
            .Include(user => user.Role)
            .FirstOrDefaultAsync(
                user => user.PasswordSetupToken == token
                    && user.PasswordSetupTokenExpiresAtUtc != null
                    && user.PasswordSetupTokenExpiresAtUtc >= nowUtc
                    && !user.IsDeleted,
                cancellationToken);
    }

    public async Task<IReadOnlyList<User>> SearchAsync(
        string tenantId,
        string? term,
        string? role,
        int skip,
        int take,
        CancellationToken cancellationToken = default)
    {
        var query = BuildSearchQuery(tenantId, term, role);

        return await query
            .Include(user => user.Role)
            .OrderByDescending(user => user.CreatedAtUtc)
            .Skip(skip)
            .Take(take)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> CountAsync(string tenantId, string? term, string? role, CancellationToken cancellationToken = default)
    {
        var query = BuildSearchQuery(tenantId, term, role);
        return await query.CountAsync(cancellationToken);
    }

    public async Task<User> AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _context.Users.AddAsync(user, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return user;
    }

    public async Task<User> UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);
        return user;
    }

    public async Task DeleteAsync(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);
    }

    private IQueryable<User> BuildSearchQuery(string tenantId, string? term, string? role)
    {
        var query = _context.Users
            .AsNoTracking()
            .Include(user => user.Role)
            .Where(user => user.TenantId == tenantId);

        if (!string.IsNullOrWhiteSpace(term))
        {
            var filteredTerm = term.Trim();
            query = query.Where(user =>
                EF.Functions.Like(user.FirstName, $"%{filteredTerm}%") ||
                EF.Functions.Like(user.LastName, $"%{filteredTerm}%") ||
                user.Identification == filteredTerm ||
                user.Email == filteredTerm ||
                user.Id.ToString() == filteredTerm);
        }

        if (!string.IsNullOrWhiteSpace(role))
        {
            var normalizedRole = role.Trim().ToLower();
            query = query.Where(user =>
                user.Role != null && user.Role.Name != null && user.Role.Name.ToLower() == normalizedRole);
        }

        return query;
    }
}
