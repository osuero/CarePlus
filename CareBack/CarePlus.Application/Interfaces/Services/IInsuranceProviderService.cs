using CarePlus.Domain.Entities;

namespace CarePlus.Application.Interfaces.Services;

public interface IInsuranceProviderService
{
    Task<IReadOnlyList<InsuranceProvider>> ListAsync(string tenantId, CancellationToken cancellationToken = default);
}
