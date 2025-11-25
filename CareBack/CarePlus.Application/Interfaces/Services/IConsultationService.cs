using System;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Consultations;
using CarePlus.Application.Models;

namespace CarePlus.Application.Interfaces.Services;

public interface IConsultationService
{
    Task<Result<ConsultationDetailDto>> CreateAsync(
        string tenantId,
        CreateConsultationRequest request,
        CancellationToken cancellationToken = default);

    Task<Result<ConsultationDetailDto>> UpdateAsync(
        string tenantId,
        Guid id,
        UpdateConsultationRequest request,
        CancellationToken cancellationToken = default);
}
