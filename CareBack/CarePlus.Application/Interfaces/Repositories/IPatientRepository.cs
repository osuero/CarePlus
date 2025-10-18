using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Domain.Entities;

namespace CarePlus.Application.Interfaces.Repositories;

public interface IPatientRepository
{
    Task<Patient?> GetByEmailAsync(string tenantId, string email, CancellationToken cancellationToken = default);
    Task<Patient?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default);
    Task<Patient?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Patient>> SearchAsync(
        string tenantId,
        string? term,
        string? gender,
        string? country,
        int skip,
        int take,
        CancellationToken cancellationToken = default);
    Task<int> CountAsync(
        string tenantId,
        string? term,
        string? gender,
        string? country,
        CancellationToken cancellationToken = default);
    Task<Patient> AddAsync(Patient patient, CancellationToken cancellationToken = default);
    Task<Patient> UpdateAsync(Patient patient, CancellationToken cancellationToken = default);
    Task DeleteAsync(Patient patient, CancellationToken cancellationToken = default);
}
