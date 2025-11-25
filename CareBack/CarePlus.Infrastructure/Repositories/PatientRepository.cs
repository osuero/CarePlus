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

public class PatientRepository(ApplicationDbContext context) : IPatientRepository
{
    private readonly ApplicationDbContext _context = context;

    public async Task<Patient?> GetByEmailAsync(string tenantId, string email, CancellationToken cancellationToken = default)
    {
        return await _context.Patients
            .AsNoTracking()
            .FirstOrDefaultAsync(patient => patient.TenantId == tenantId && patient.Email == email, cancellationToken);
    }

    public async Task<Patient?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Patients
            .AsNoTracking()
            .FirstOrDefaultAsync(patient => patient.TenantId == tenantId && patient.Id == id, cancellationToken);
    }

    public async Task<Patient?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Patients
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(patient => patient.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<Patient>> SearchAsync(
        string tenantId,
        string? term,
        string? gender,
        string? country,
        int skip,
        int take,
        CancellationToken cancellationToken = default)
    {
        var query = BuildSearchQuery(tenantId, term, gender, country);

        return await query
            .OrderByDescending(patient => patient.CreatedAtUtc)
            .Skip(skip)
            .Take(take)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> CountAsync(
        string tenantId,
        string? term,
        string? gender,
        string? country,
        CancellationToken cancellationToken = default)
    {
        var query = BuildSearchQuery(tenantId, term, gender, country);
        return await query.CountAsync(cancellationToken);
    }

    public async Task<Patient> AddAsync(Patient patient, CancellationToken cancellationToken = default)
    {
        patient.Id = await EnsureUniqueIdAsync(patient.Id, cancellationToken);

        await _context.Patients.AddAsync(patient, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return patient;
    }

    public async Task<Patient> UpdateAsync(Patient patient, CancellationToken cancellationToken = default)
    {
        _context.Patients.Update(patient);
        await _context.SaveChangesAsync(cancellationToken);
        return patient;
    }

    public async Task DeleteAsync(Patient patient, CancellationToken cancellationToken = default)
    {
        _context.Patients.Update(patient);
        await _context.SaveChangesAsync(cancellationToken);
    }

    private IQueryable<Patient> BuildSearchQuery(string tenantId, string? term, string? gender, string? country)
    {
        var query = _context.Patients
            .AsNoTracking()
            .Where(patient => patient.TenantId == tenantId);

        if (!string.IsNullOrWhiteSpace(term))
        {
            var filteredTerm = term.Trim();
            query = query.Where(patient =>
                EF.Functions.Like(patient.FirstName, $"%{filteredTerm}%") ||
                EF.Functions.Like(patient.LastName, $"%{filteredTerm}%") ||
                patient.Identification == filteredTerm ||
                patient.Email == filteredTerm ||
                patient.Id.ToString() == filteredTerm);
        }

        if (!string.IsNullOrWhiteSpace(country))
        {
            var filteredCountry = country.Trim();
            query = query.Where(patient => patient.Country != null && EF.Functions.Like(patient.Country, $"%{filteredCountry}%"));
        }

        if (!string.IsNullOrWhiteSpace(gender))
        {
            if (Enum.TryParse<Gender>(gender, true, out var parsed))
            {
                query = query.Where(patient => patient.Gender == parsed);
            }
        }

        return query;
    }

    private async Task<Guid> EnsureUniqueIdAsync(Guid currentId, CancellationToken cancellationToken)
    {
        var candidateId = currentId == Guid.Empty ? Guid.NewGuid() : currentId;

        while (await _context.Patients
            .IgnoreQueryFilters()
            .AnyAsync(patient => patient.Id == candidateId, cancellationToken))
        {
            candidateId = Guid.NewGuid();
        }

        return candidateId;
    }
}
