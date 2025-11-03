using System;
using CarePlus.Application.DTOs.Appointments;
using CarePlus.Application.Models;

namespace CarePlus.Application.Interfaces.Services;

public interface IAppointmentService
{
    Task<Result<AppointmentResponse>> ScheduleAsync(
        string tenantId,
        ScheduleAppointmentRequest request,
        CancellationToken cancellationToken = default);

    Task<Result<AppointmentResponse>> UpdateAsync(
        string tenantId,
        Guid id,
        UpdateAppointmentRequest request,
        CancellationToken cancellationToken = default);

    Task<Result> CancelAsync(
        string tenantId,
        Guid id,
        CancellationToken cancellationToken = default);

    Task<Result> DeleteAsync(
        string tenantId,
        Guid id,
        CancellationToken cancellationToken = default);
}
