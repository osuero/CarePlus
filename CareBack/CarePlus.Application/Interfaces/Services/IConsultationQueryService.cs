using System;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Consultations;
using CarePlus.Application.Models;

namespace CarePlus.Application.Interfaces.Services;

public interface IConsultationQueryService
{
    Task<PagedResult<ConsultationListItemDto>> GetByPatientAsync(
        string tenantId,
        Guid patientId,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);

    Task<ConsultationDetailDto?> GetDetailAsync(
        string tenantId,
        Guid id,
        CancellationToken cancellationToken = default);
}
