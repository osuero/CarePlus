using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Models;
using CarePlus.Domain.Entities;
using CarePlus.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CarePlus.Infrastructure.Repositories;

public class ConsultationRepository(ApplicationDbContext context) : IConsultationRepository
{
    private readonly ApplicationDbContext _context = context;

    public async Task<Consultation?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Consultations
            .AsNoTracking()
            .Include(consultation => consultation.Patient)
            .Include(consultation => consultation.Doctor)
            .FirstOrDefaultAsync(
                consultation => consultation.TenantId == tenantId && consultation.Id == id,
                cancellationToken);
    }

    public async Task<Consultation?> GetByIdWithSymptomsAsync(string tenantId, Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Consultations
            .AsNoTracking()
            .Include(consultation => consultation.Patient)
            .Include(consultation => consultation.Doctor)
            .Include(consultation => consultation.Symptoms.OrderBy(symptom => symptom.OnsetDate))
            .FirstOrDefaultAsync(
                consultation => consultation.TenantId == tenantId && consultation.Id == id,
                cancellationToken);
    }

    public async Task<Consultation?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Consultations
            .Include(consultation => consultation.Symptoms)
            .FirstOrDefaultAsync(consultation => consultation.Id == id, cancellationToken);
    }

    public async Task<Consultation> AddAsync(
        Consultation consultation,
        IEnumerable<SymptomEntry> symptoms,
        CancellationToken cancellationToken = default)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        await _context.Consultations.AddAsync(consultation, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        var symptomList = symptoms.ToList();
        if (symptomList.Count > 0)
        {
            foreach (var symptom in symptomList)
            {
                symptom.ConsultationId = consultation.Id;
                symptom.TenantId = consultation.TenantId;
            }

            await _context.SymptomEntries.AddRangeAsync(symptomList, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        await transaction.CommitAsync(cancellationToken);
        return consultation;
    }

    public async Task<Consultation> UpdateAsync(
        Consultation consultation,
        IEnumerable<SymptomEntry> symptoms,
        CancellationToken cancellationToken = default)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        _context.Consultations.Update(consultation);
        await _context.SaveChangesAsync(cancellationToken);

        var existingSymptoms = await _context.SymptomEntries
            .Where(symptom => symptom.ConsultationId == consultation.Id)
            .ToListAsync(cancellationToken);

        if (existingSymptoms.Count > 0)
        {
            _context.SymptomEntries.RemoveRange(existingSymptoms);
            await _context.SaveChangesAsync(cancellationToken);
        }

        var symptomList = symptoms.ToList();
        if (symptomList.Count > 0)
        {
            foreach (var symptom in symptomList)
            {
                symptom.ConsultationId = consultation.Id;
                symptom.TenantId = consultation.TenantId;
            }

            await _context.SymptomEntries.AddRangeAsync(symptomList, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        await transaction.CommitAsync(cancellationToken);
        return consultation;
    }

    public async Task<IReadOnlyList<Consultation>> GetByPatientAsync(
        string tenantId,
        Guid patientId,
        int skip,
        int take,
        CancellationToken cancellationToken = default)
    {
        return await _context.Consultations
            .AsNoTracking()
            .Include(consultation => consultation.Doctor)
            .Include(consultation => consultation.Symptoms)
            .Where(consultation => consultation.TenantId == tenantId && consultation.PatientId == patientId)
            .OrderByDescending(consultation => consultation.ConsultationDateTime)
            .Skip(skip)
            .Take(take)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> CountByPatientAsync(string tenantId, Guid patientId, CancellationToken cancellationToken = default)
    {
        return await _context.Consultations
            .Where(consultation => consultation.TenantId == tenantId && consultation.PatientId == patientId)
            .CountAsync(cancellationToken);
    }

    public Task<Consultation> AddAsync(Consultation consultation, IEnumerable<SymptomEntry> symptoms, LabRequisition? labRequisition, IEnumerable<LabRequisitionItem> labItems, Prescription? prescription, IEnumerable<PrescriptionItem> prescriptionItems, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<Consultation> UpdateAsync(Consultation consultation, IEnumerable<SymptomEntry> symptoms, LabRequisition? labRequisition, IEnumerable<LabRequisitionItem> labItems, Prescription? prescription, IEnumerable<PrescriptionItem> prescriptionItems, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<IReadOnlyList<Consultation>> SearchAsync(string tenantId, ConsultationSearchFilters filters, int skip, int take, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<int> CountAsync(string tenantId, ConsultationSearchFilters filters, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}
