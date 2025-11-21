using CarePlus.Application.DTOs.Billing;
using CarePlus.Application.Models;

namespace CarePlus.Application.Interfaces.Services;

public interface IBillingService
{
    Task<Result<BillingResponse>> CreateAsync(string tenantId, CreateBillingRequest request, CancellationToken cancellationToken = default);
}
