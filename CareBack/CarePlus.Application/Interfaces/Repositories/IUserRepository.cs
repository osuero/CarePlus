using CarePlus.Domain.Entities;

namespace CarePlus.Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string tenantId, string email, CancellationToken cancellationToken = default);
    Task<User?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<User>> SearchAsync(string tenantId, string? term, int skip, int take, CancellationToken cancellationToken = default);
    Task<int> CountAsync(string tenantId, string? term, CancellationToken cancellationToken = default);
    Task<User> AddAsync(User user, CancellationToken cancellationToken = default);
}
