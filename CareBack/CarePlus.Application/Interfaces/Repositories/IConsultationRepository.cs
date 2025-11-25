using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Domain.Entities;

namespace CarePlus.Application.Interfaces.Repositories;

public interface IConsultationRepository
{
    Task<Consultation?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default);
    Task<Consultation?> GetByIdWithSymptomsAsync(string tenantId, Guid id, CancellationToken cancellationToken = default);
    Task<Consultation?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Consultation> AddAsync(Consultation consultation, IEnumerable<SymptomEntry> symptoms, CancellationToken cancellationToken = default);
    Task<Consultation> UpdateAsync(Consultation consultation, IEnumerable<SymptomEntry> symptoms, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Consultation>> GetByPatientAsync(string tenantId, Guid patientId, int skip, int take, CancellationToken cancellationToken = default);
    Task<int> CountByPatientAsync(string tenantId, Guid patientId, CancellationToken cancellationToken = default);
}
