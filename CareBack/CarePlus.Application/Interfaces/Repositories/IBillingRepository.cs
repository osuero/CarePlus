using CarePlus.Domain.Entities;
using CarePlus.Domain.Enums;

namespace CarePlus.Application.Interfaces.Repositories;

public interface IBillingRepository
{
    Task<Billing?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default);

    Task<bool> ExistsForAppointmentAsync(string tenantId, Guid appointmentId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Billing>> SearchAsync(
        string tenantId,
        DateTime? dateFromUtc,
        DateTime? dateToUtc,
        Guid? patientId,
        Guid? doctorId,
        PaymentMethod? paymentMethod,
        Guid? insuranceProviderId,
        int skip,
        int take,
        CancellationToken cancellationToken = default);

    Task<int> CountAsync(
        string tenantId,
        DateTime? dateFromUtc,
        DateTime? dateToUtc,
        Guid? patientId,
        Guid? doctorId,
        PaymentMethod? paymentMethod,
        Guid? insuranceProviderId,
        CancellationToken cancellationToken = default);

    Task<Billing> AddAsync(Billing billing, CancellationToken cancellationToken = default);
}
