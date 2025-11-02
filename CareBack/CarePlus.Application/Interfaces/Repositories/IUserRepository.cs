using System;
using CarePlus.Domain.Entities;

namespace CarePlus.Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string tenantId, string email, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailForAuthenticationAsync(string tenantId, string email, CancellationToken cancellationToken = default);
    Task<User?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default);
    Task<User?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default);
    Task<User?> GetByPasswordSetupTokenAsync(string token, CancellationToken cancellationToken = default);
    Task<User?> GetByIdForPasswordSetupAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<User>> SearchAsync(string tenantId, string? term, string? role, int skip, int take, CancellationToken cancellationToken = default);
    Task<int> CountAsync(string tenantId, string? term, string? role, CancellationToken cancellationToken = default);
    Task<User> AddAsync(User user, CancellationToken cancellationToken = default);
    Task<User> UpdateAsync(User user, CancellationToken cancellationToken = default);
    Task DeleteAsync(User user, CancellationToken cancellationToken = default);
}
