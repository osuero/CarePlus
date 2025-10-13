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

    public async Task<IReadOnlyList<User>> SearchAsync(string tenantId, string? term, int skip, int take, CancellationToken cancellationToken = default)
    {
        var query = BuildSearchQuery(tenantId, term);

        return await query
            .Include(user => user.Role)
            .OrderByDescending(user => user.CreatedAtUtc)
            .Skip(skip)
            .Take(take)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> CountAsync(string tenantId, string? term, CancellationToken cancellationToken = default)
    {
        var query = BuildSearchQuery(tenantId, term);
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

    private IQueryable<User> BuildSearchQuery(string tenantId, string? term)
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

        return query;
    }
}
