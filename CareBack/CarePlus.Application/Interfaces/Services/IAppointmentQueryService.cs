using System;
using CarePlus.Application.DTOs.Appointments;
using CarePlus.Application.Models;

namespace CarePlus.Application.Interfaces.Services;

public interface IAppointmentQueryService
{
    Task<PagedResult<AppointmentResponse>> SearchAsync(
        string tenantId,
        int page,
        int pageSize,
        string? search,
        Guid? patientId,
        Guid? doctorId,
        string? status,
        DateTime? fromUtc,
        DateTime? toUtc,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<AppointmentResponse>> ListByRangeAsync(
        string tenantId,
        DateTime fromUtc,
        DateTime toUtc,
        CancellationToken cancellationToken = default);

    Task<AppointmentResponse?> GetByIdAsync(
        string tenantId,
        Guid id,
        CancellationToken cancellationToken = default);
}
