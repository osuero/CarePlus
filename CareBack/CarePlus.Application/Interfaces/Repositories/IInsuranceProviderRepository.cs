using CarePlus.Domain.Entities;

namespace CarePlus.Application.Interfaces.Repositories;

public interface IInsuranceProviderRepository
{
    Task<IReadOnlyList<InsuranceProvider>> ListAsync(string tenantId, CancellationToken cancellationToken = default);

    Task<InsuranceProvider?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default);
}
