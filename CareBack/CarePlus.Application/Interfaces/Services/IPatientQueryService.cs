using System;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Patients;
using CarePlus.Application.Models;

namespace CarePlus.Application.Interfaces.Services;

public interface IPatientQueryService
{
    Task<PagedResult<PatientResponse>> SearchAsync(
        string tenantId,
        int page,
        int pageSize,
        string? search,
        string? gender,
        string? country,
        CancellationToken cancellationToken = default);

    Task<PatientResponse?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default);

    Task<PatientResponse?> FindAsync(string tenantId, string search, CancellationToken cancellationToken = default);
}
