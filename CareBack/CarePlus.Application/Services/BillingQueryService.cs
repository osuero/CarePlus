using CarePlus.Application.DTOs.Billing;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Mappers;
using CarePlus.Application.Models;
using CarePlus.Domain.Enums;

namespace CarePlus.Application.Services;

public class BillingQueryService(IBillingRepository billingRepository) : IBillingQueryService
{
    private readonly IBillingRepository _billingRepository = billingRepository;

    public async Task<PagedResult<BillingResponse>> SearchAsync(
        string tenantId,
        int page,
        int pageSize,
        DateTime? dateFromUtc,
        DateTime? dateToUtc,
        Guid? patientId,
        Guid? doctorId,
        PaymentMethod? paymentMethod,
        Guid? insuranceProviderId,
        CancellationToken cancellationToken = default)
    {
        var skip = (Math.Max(page, 1) - 1) * Math.Max(pageSize, 1);
        var take = Math.Max(pageSize, 1);

        var items = await _billingRepository.SearchAsync(
            tenantId,
            dateFromUtc,
            dateToUtc,
            patientId,
            doctorId,
            paymentMethod,
            insuranceProviderId,
            skip,
            take,
            cancellationToken);

        var total = await _billingRepository.CountAsync(
            tenantId,
            dateFromUtc,
            dateToUtc,
            patientId,
            doctorId,
            paymentMethod,
            insuranceProviderId,
            cancellationToken);

        return new PagedResult<BillingResponse>
        {
            Items = items.Select(BillingMapper.ToResponse).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    public async Task<BillingResponse?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default)
    {
        var billing = await _billingRepository.GetByIdAsync(tenantId, id, cancellationToken);
        return billing is null ? null : BillingMapper.ToResponse(billing);
    }
}
