using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Domain.Entities;
using CarePlus.Domain.Enums;
using CarePlus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CarePlus.Infrastructure.Repositories;

public class AppointmentRepository(ApplicationDbContext context) : IAppointmentRepository
{
    private readonly ApplicationDbContext _context = context;

    public async Task<Appointment?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Appointments
            .AsNoTracking()
            .Include(appointment => appointment.Patient)
            .Include(appointment => appointment.Doctor)
            .FirstOrDefaultAsync(appointment =>
                appointment.TenantId == tenantId &&
                appointment.Id == id,
                cancellationToken);
    }

    public async Task<Appointment?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Appointments
            .Include(appointment => appointment.Patient)
            .Include(appointment => appointment.Doctor)
            .FirstOrDefaultAsync(appointment => appointment.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<Appointment>> SearchAsync(
        string tenantId,
        string? search,
        Guid? patientId,
        Guid? doctorId,
        AppointmentStatus? status,
        DateTime? fromUtc,
        DateTime? toUtc,
        int skip,
        int take,
        CancellationToken cancellationToken = default)
    {
        var query = BuildSearchQuery(tenantId, search, patientId, doctorId, status, fromUtc, toUtc);

        return await query
            .OrderBy(appointment => appointment.StartsAtUtc)
            .Skip(skip)
            .Take(take)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<int> CountAsync(
        string tenantId,
        string? search,
        Guid? patientId,
        Guid? doctorId,
        AppointmentStatus? status,
        DateTime? fromUtc,
        DateTime? toUtc,
        CancellationToken cancellationToken = default)
    {
        var query = BuildSearchQuery(tenantId, search, patientId, doctorId, status, fromUtc, toUtc);
        return await query.CountAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Appointment>> ListByRangeAsync(
        string tenantId,
        DateTime fromUtc,
        DateTime toUtc,
        CancellationToken cancellationToken = default)
    {
        return await _context.Appointments
            .AsNoTracking()
            .Include(appointment => appointment.Patient)
            .Include(appointment => appointment.Doctor)
            .Where(appointment =>
                appointment.TenantId == tenantId &&
                appointment.StartsAtUtc < toUtc &&
                appointment.EndsAtUtc > fromUtc)
            .OrderBy(appointment => appointment.StartsAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<Appointment> AddAsync(Appointment appointment, CancellationToken cancellationToken = default)
    {
        await _context.Appointments.AddAsync(appointment, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return appointment;
    }

    public async Task<Appointment> UpdateAsync(Appointment appointment, CancellationToken cancellationToken = default)
    {
        _context.Appointments.Update(appointment);
        await _context.SaveChangesAsync(cancellationToken);
        return appointment;
    }

    public async Task DeleteAsync(Appointment appointment, CancellationToken cancellationToken = default)
    {
        _context.Appointments.Update(appointment);
        await _context.SaveChangesAsync(cancellationToken);
    }

    private IQueryable<Appointment> BuildSearchQuery(
        string tenantId,
        string? search,
        Guid? patientId,
        Guid? doctorId,
        AppointmentStatus? status,
        DateTime? fromUtc,
        DateTime? toUtc)
    {
        var query = _context.Appointments
            .Include(appointment => appointment.Patient)
            .Include(appointment => appointment.Doctor)
            .Where(appointment => appointment.TenantId == tenantId);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var filteredTerm = search.Trim();
            query = query.Where(appointment =>
                EF.Functions.Like(appointment.Title, $"%{filteredTerm}%") ||
                (appointment.Patient != null &&
                    (EF.Functions.Like(appointment.Patient.FirstName, $"%{filteredTerm}%") ||
                     EF.Functions.Like(appointment.Patient.LastName, $"%{filteredTerm}%"))) ||
                (appointment.Patient != null && appointment.Patient.Email == filteredTerm) ||
                (appointment.Doctor != null &&
                    (EF.Functions.Like(appointment.Doctor.FirstName, $"%{filteredTerm}%") ||
                     EF.Functions.Like(appointment.Doctor.LastName, $"%{filteredTerm}%"))));
        }

        if (patientId.HasValue && patientId.Value != Guid.Empty)
        {
            query = query.Where(appointment => appointment.PatientId == patientId.Value);
        }

        if (doctorId.HasValue && doctorId.Value != Guid.Empty)
        {
            query = query.Where(appointment => appointment.DoctorId == doctorId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(appointment => appointment.Status == status.Value);
        }

        if (fromUtc.HasValue)
        {
            query = query.Where(appointment => appointment.EndsAtUtc > fromUtc.Value);
        }

        if (toUtc.HasValue)
        {
            query = query.Where(appointment => appointment.StartsAtUtc < toUtc.Value);
        }

        return query;
    }
}
