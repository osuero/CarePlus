using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Domain.Entities;

namespace CarePlus.Application.Services;

public class InsuranceProviderService(IInsuranceProviderRepository repository) : IInsuranceProviderService
{
    private readonly IInsuranceProviderRepository _repository = repository;

    public Task<IReadOnlyList<InsuranceProvider>> ListAsync(string tenantId, CancellationToken cancellationToken = default)
    {
        return _repository.ListAsync(tenantId, cancellationToken);
    }
}
