using CarePlus.Application.DTOs.Billing;
using CarePlus.Application.Models;
using CarePlus.Domain.Enums;

namespace CarePlus.Application.Interfaces.Services;

public interface IBillingQueryService
{
    Task<PagedResult<BillingResponse>> SearchAsync(
        string tenantId,
        int page,
        int pageSize,
        DateTime? dateFromUtc,
        DateTime? dateToUtc,
        Guid? patientId,
        Guid? doctorId,
        PaymentMethod? paymentMethod,
        Guid? insuranceProviderId,
        CancellationToken cancellationToken = default);

    Task<BillingResponse?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default);
}
