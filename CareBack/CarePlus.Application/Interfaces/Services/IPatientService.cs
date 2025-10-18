using System;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Patients;
using CarePlus.Application.Models;

namespace CarePlus.Application.Interfaces.Services;

public interface IPatientService
{
    Task<Result<PatientResponse>> RegisterAsync(string tenantId, RegisterPatientRequest request, CancellationToken cancellationToken = default);
    Task<Result<PatientResponse>> UpdateAsync(string tenantId, Guid id, UpdatePatientRequest request, CancellationToken cancellationToken = default);
    Task<Result> DeleteAsync(string tenantId, Guid id, CancellationToken cancellationToken = default);
}
