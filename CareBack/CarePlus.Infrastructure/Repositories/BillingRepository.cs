using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Domain.Entities;
using CarePlus.Domain.Enums;
using CarePlus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;

namespace CarePlus.Infrastructure.Repositories;

public class BillingRepository(ApplicationDbContext context) : IBillingRepository
{
    private readonly ApplicationDbContext _context = context;

    public async Task<Billing?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Billings
            .AsNoTracking()
            .Include(billing => billing.Patient)
            .Include(billing => billing.Doctor)
            .Include(billing => billing.Appointment)
            .Include(billing => billing.InsuranceProvider)
            .FirstOrDefaultAsync(billing => billing.TenantId == tenantId && billing.Id == id, cancellationToken);
    }

    public async Task<bool> ExistsForAppointmentAsync(string tenantId, Guid appointmentId, CancellationToken cancellationToken = default)
    {
        return await _context.Billings
            .AnyAsync(billing => billing.TenantId == tenantId && billing.AppointmentId == appointmentId, cancellationToken);
    }

    public async Task<IReadOnlyList<Billing>> SearchAsync(
        string tenantId,
        DateTime? dateFromUtc,
        DateTime? dateToUtc,
        Guid? patientId,
        Guid? doctorId,
        PaymentMethod? paymentMethod,
        Guid? insuranceProviderId,
        int skip,
        int take,
        CancellationToken cancellationToken = default)
    {
        var query = BuildQuery(tenantId, dateFromUtc, dateToUtc, patientId, doctorId, paymentMethod, insuranceProviderId);

        return await query
            .OrderByDescending(billing => billing.AppointmentStartsAtUtc)
            .Skip(skip)
            .Take(take)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<int> CountAsync(
        string tenantId,
        DateTime? dateFromUtc,
        DateTime? dateToUtc,
        Guid? patientId,
        Guid? doctorId,
        PaymentMethod? paymentMethod,
        Guid? insuranceProviderId,
        CancellationToken cancellationToken = default)
    {
        var query = BuildQuery(tenantId, dateFromUtc, dateToUtc, patientId, doctorId, paymentMethod, insuranceProviderId);
        return await query.CountAsync(cancellationToken);
    }

    public async Task<Billing> AddAsync(Billing billing, CancellationToken cancellationToken = default)
    {
        await _context.Billings.AddAsync(billing, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return billing;
    }

    private IQueryable<Billing> BuildQuery( 
        string tenantId,
        DateTime? dateFromUtc,
        DateTime? dateToUtc,
        Guid? patientId,
        Guid? doctorId,
        PaymentMethod? paymentMethod,
        Guid? insuranceProviderId)
    {
        var query = _context.Billings
            .Include(billing => billing.Patient)
            .Include(billing => billing.Doctor)
            .Include(billing => billing.Appointment)
            .Include(billing => billing.InsuranceProvider)
            .Where(billing => billing.TenantId == tenantId);

        if (dateFromUtc.HasValue)
        {
            query = query.Where(billing => billing.AppointmentStartsAtUtc >= dateFromUtc.Value);
        }

        if (dateToUtc.HasValue)
        {
            query = query.Where(billing => billing.AppointmentStartsAtUtc <= dateToUtc.Value);
        }

        if (patientId.HasValue && patientId.Value != Guid.Empty)
        {
            query = query.Where(billing => billing.PatientId == patientId.Value);
        }

        if (doctorId.HasValue && doctorId.Value != Guid.Empty)
        {
            query = query.Where(billing => billing.DoctorId == doctorId.Value);
        }

        if (paymentMethod.HasValue)
        {
            query = query.Where(billing => billing.PaymentMethod == paymentMethod.Value);
        }

        if (insuranceProviderId.HasValue && insuranceProviderId.Value != Guid.Empty)
        {
            query = query.Where(billing => billing.InsuranceProviderId == insuranceProviderId.Value);
        }

        return query;
    }
}
