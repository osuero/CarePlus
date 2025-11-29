using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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
            .Include(consultation => consultation.LabRequisition)
            .Include(consultation => consultation.Prescription)
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
            .Include(consultation => consultation.Symptoms)
            .Include(consultation => consultation.LabRequisition)
                .ThenInclude(requisition => requisition!.Items)
            .Include(consultation => consultation.Prescription)
                .ThenInclude(prescription => prescription!.Items)
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
        LabRequisition? labRequisition,
        IEnumerable<LabRequisitionItem> labItems,
        Prescription? prescription,
        IEnumerable<PrescriptionItem> prescriptionItems,
        CancellationToken cancellationToken = default)
    {
        await using var transaction = _context.Database.IsRelational()
            ? await _context.Database.BeginTransactionAsync(cancellationToken)
            : null;

        await _context.Consultations.AddAsync(consultation, cancellationToken);

        var symptomList = symptoms.ToList();
        if (symptomList.Count > 0)
        {
            foreach (var symptom in symptomList)
            {
                symptom.ConsultationId = consultation.Id;
                symptom.TenantId = consultation.TenantId;
            }

            await _context.SymptomEntries.AddRangeAsync(symptomList, cancellationToken);
        }

        var labItemList = labItems.ToList();
        if (labRequisition is not null)
        {
            labRequisition.ConsultationId = consultation.Id;
            labRequisition.TenantId = consultation.TenantId;

            await _context.LabRequisitions.AddAsync(labRequisition, cancellationToken);

            if (labItemList.Count > 0)
            {
                foreach (var item in labItemList)
                {
                    item.LabRequisitionId = labRequisition.Id;
                    item.TenantId = consultation.TenantId;
                }

                await _context.LabRequisitionItems.AddRangeAsync(labItemList, cancellationToken);
            }
        }

        var prescriptionItemList = prescriptionItems.ToList();
        if (prescription is not null)
        {
            prescription.ConsultationId = consultation.Id;
            prescription.TenantId = consultation.TenantId;

            await _context.Prescriptions.AddAsync(prescription, cancellationToken);

            if (prescriptionItemList.Count > 0)
            {
                foreach (var item in prescriptionItemList)
                {
                    item.PrescriptionId = prescription.Id;
                    item.TenantId = consultation.TenantId;
                }

                await _context.PrescriptionItems.AddRangeAsync(prescriptionItemList, cancellationToken);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        if (transaction is not null)
        {
            await transaction.CommitAsync(cancellationToken);
        }

        return consultation;
    }

    public async Task<Consultation> UpdateAsync(
        Consultation consultation,
        IEnumerable<SymptomEntry> symptoms,
        LabRequisition? labRequisition,
        IEnumerable<LabRequisitionItem> labItems,
        Prescription? prescription,
        IEnumerable<PrescriptionItem> prescriptionItems,
        CancellationToken cancellationToken = default)
    {
        await using var transaction = _context.Database.IsRelational()
            ? await _context.Database.BeginTransactionAsync(cancellationToken)
            : null;

        _context.Consultations.Update(consultation);

        var existingSymptoms = await _context.SymptomEntries
            .Where(symptom => symptom.ConsultationId == consultation.Id)
            .ToListAsync(cancellationToken);

        if (existingSymptoms.Count > 0)
        {
            _context.SymptomEntries.RemoveRange(existingSymptoms);
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
        }

        var existingRequisition = await _context.LabRequisitions
            .Include(requisition => requisition.Items)
            .FirstOrDefaultAsync(requisition => requisition.ConsultationId == consultation.Id, cancellationToken);

        if (existingRequisition is not null)
        {
            _context.LabRequisitions.Remove(existingRequisition);
        }

        var labItemList = labItems.ToList();
        if (labRequisition is not null)
        {
            labRequisition.ConsultationId = consultation.Id;
            labRequisition.TenantId = consultation.TenantId;

            await _context.LabRequisitions.AddAsync(labRequisition, cancellationToken);

            if (labItemList.Count > 0)
            {
                foreach (var item in labItemList)
                {
                    item.LabRequisitionId = labRequisition.Id;
                    item.TenantId = consultation.TenantId;
                }

                await _context.LabRequisitionItems.AddRangeAsync(labItemList, cancellationToken);
            }
        }

        var existingPrescription = await _context.Prescriptions
            .Include(p => p.Items)
            .FirstOrDefaultAsync(p => p.ConsultationId == consultation.Id, cancellationToken);

        if (existingPrescription is not null)
        {
            _context.Prescriptions.Remove(existingPrescription);
        }

        var prescriptionItemList = prescriptionItems.ToList();
        if (prescription is not null)
        {
            prescription.ConsultationId = consultation.Id;
            prescription.TenantId = consultation.TenantId;

            await _context.Prescriptions.AddAsync(prescription, cancellationToken);

            if (prescriptionItemList.Count > 0)
            {
                foreach (var item in prescriptionItemList)
                {
                    item.PrescriptionId = prescription.Id;
                    item.TenantId = consultation.TenantId;
                }

                await _context.PrescriptionItems.AddRangeAsync(prescriptionItemList, cancellationToken);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        if (transaction is not null)
        {
            await transaction.CommitAsync(cancellationToken);
        }

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

    public async Task<IReadOnlyList<Consultation>> SearchAsync(
        string tenantId,
        ConsultationSearchFilters filters,
        int skip,
        int take,
        CancellationToken cancellationToken = default)
    {
        var query = BuildSearchQuery(tenantId, filters);

        return await query
            .OrderByDescending(consultation => consultation.ConsultationDateTime)
            .Skip(skip)
            .Take(take)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<int> CountAsync(
        string tenantId,
        ConsultationSearchFilters filters,
        CancellationToken cancellationToken = default)
    {
        var query = BuildSearchQuery(tenantId, filters);
        return await query.CountAsync(cancellationToken);
    }

    private IQueryable<Consultation> BuildSearchQuery(string tenantId, ConsultationSearchFilters filters)
    {
        var query = _context.Consultations
            .Include(consultation => consultation.Patient)
            .Include(consultation => consultation.Doctor)
            .Include(consultation => consultation.Symptoms)
            .Where(consultation => consultation.TenantId == tenantId);

        if (filters.PatientId.HasValue && filters.PatientId.Value != Guid.Empty)
        {
            query = query.Where(consultation => consultation.PatientId == filters.PatientId.Value);
        }

        if (filters.DoctorId.HasValue && filters.DoctorId.Value != Guid.Empty)
        {
            query = query.Where(consultation => consultation.DoctorId == filters.DoctorId.Value);
        }

        if (filters.DateFrom.HasValue)
        {
            query = query.Where(consultation => consultation.ConsultationDateTime >= filters.DateFrom.Value);
        }

        if (filters.DateTo.HasValue)
        {
            query = query.Where(consultation => consultation.ConsultationDateTime <= filters.DateTo.Value);
        }

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var term = filters.Search.Trim();
            query = query.Where(consultation =>
                EF.Functions.Like(consultation.ReasonForVisit, $"%{term}%") ||
                (consultation.Patient != null &&
                    (EF.Functions.Like(consultation.Patient.FirstName, $"%{term}%") ||
                     EF.Functions.Like(consultation.Patient.LastName, $"%{term}%"))) ||
                (consultation.Doctor != null &&
                    (EF.Functions.Like(consultation.Doctor.FirstName, $"%{term}%") ||
                     EF.Functions.Like(consultation.Doctor.LastName, $"%{term}%"))));
        }

        return query;
    }
}
