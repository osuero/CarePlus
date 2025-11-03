using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Appointments;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Mappers;
using CarePlus.Application.Models;
using CarePlus.Domain.Enums;

namespace CarePlus.Application.Services;

public class AppointmentQueryService : IAppointmentQueryService
{
    private readonly IAppointmentRepository _appointmentRepository;

    public AppointmentQueryService(IAppointmentRepository appointmentRepository)
    {
        _appointmentRepository = appointmentRepository;
    }

    public async Task<PagedResult<AppointmentResponse>> SearchAsync(
        string tenantId,
        int page,
        int pageSize,
        string? search,
        Guid? patientId,
        Guid? doctorId,
        string? status,
        DateTime? fromUtc,
        DateTime? toUtc,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var skip = (page - 1) * pageSize;
        var normalizedSearch = string.IsNullOrWhiteSpace(search) ? null : search.Trim();
        var normalizedStatus = ParseStatus(status);

        var appointments = await _appointmentRepository.SearchAsync(
            tenantId,
            normalizedSearch,
            NormalizeGuid(patientId),
            NormalizeGuid(doctorId),
            normalizedStatus,
            fromUtc,
            toUtc,
            skip,
            pageSize,
            cancellationToken);

        var totalCount = await _appointmentRepository.CountAsync(
            tenantId,
            normalizedSearch,
            NormalizeGuid(patientId),
            NormalizeGuid(doctorId),
            normalizedStatus,
            fromUtc,
            toUtc,
            cancellationToken);

        return new PagedResult<AppointmentResponse>
        {
            Items = appointments.Select(AppointmentMapper.ToResponse).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<IReadOnlyList<AppointmentResponse>> ListByRangeAsync(
        string tenantId,
        DateTime fromUtc,
        DateTime toUtc,
        CancellationToken cancellationToken = default)
    {
        var appointments = await _appointmentRepository.ListByRangeAsync(
            tenantId,
            fromUtc,
            toUtc,
            cancellationToken);

        return appointments
            .Select(AppointmentMapper.ToResponse)
            .ToList();
    }

    public async Task<AppointmentResponse?> GetByIdAsync(
        string tenantId,
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(tenantId, id, cancellationToken);
        return appointment is null ? null : AppointmentMapper.ToResponse(appointment);
    }

    private static Guid? NormalizeGuid(Guid? value)
    {
        return value.HasValue && value.Value != Guid.Empty ? value : null;
    }

    private static AppointmentStatus? ParseStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status))
        {
            return null;
        }

        return Enum.TryParse<AppointmentStatus>(status, true, out var parsed)
            ? parsed
            : null;
    }
}
