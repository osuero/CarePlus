using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Domain.Entities;
using CarePlus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CarePlus.Infrastructure.Repositories;

public class InsuranceProviderRepository(ApplicationDbContext context) : IInsuranceProviderRepository
{
    private readonly ApplicationDbContext _context = context;

    public async Task<IReadOnlyList<InsuranceProvider>> ListAsync(string tenantId, CancellationToken cancellationToken = default)
    {
        return await _context.InsuranceProviders
            .Where(provider => provider.TenantId == tenantId)
            .OrderBy(provider => provider.Name)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<InsuranceProvider?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.InsuranceProviders
            .AsNoTracking()
            .FirstOrDefaultAsync(provider => provider.TenantId == tenantId && provider.Id == id, cancellationToken);
    }
}
