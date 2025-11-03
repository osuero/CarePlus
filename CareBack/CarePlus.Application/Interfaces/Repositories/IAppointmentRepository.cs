using System;
using CarePlus.Domain.Entities;
using CarePlus.Domain.Enums;

namespace CarePlus.Application.Interfaces.Repositories;

public interface IAppointmentRepository
{
    Task<Appointment?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default);
    Task<Appointment?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Appointment>> SearchAsync(
        string tenantId,
        string? search,
        Guid? patientId,
        Guid? doctorId,
        AppointmentStatus? status,
        DateTime? fromUtc,
        DateTime? toUtc,
        int skip,
        int take,
        CancellationToken cancellationToken = default);
    Task<int> CountAsync(
        string tenantId,
        string? search,
        Guid? patientId,
        Guid? doctorId,
        AppointmentStatus? status,
        DateTime? fromUtc,
        DateTime? toUtc,
        CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Appointment>> ListByRangeAsync(
        string tenantId,
        DateTime fromUtc,
        DateTime toUtc,
        CancellationToken cancellationToken = default);
    Task<Appointment> AddAsync(Appointment appointment, CancellationToken cancellationToken = default);
    Task<Appointment> UpdateAsync(Appointment appointment, CancellationToken cancellationToken = default);
    Task DeleteAsync(Appointment appointment, CancellationToken cancellationToken = default);
}
