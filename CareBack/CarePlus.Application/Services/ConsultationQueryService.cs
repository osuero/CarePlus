using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Consultations;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Mappers;
using CarePlus.Application.Models;

namespace CarePlus.Application.Services;

public class ConsultationQueryService(IConsultationRepository consultationRepository) : IConsultationQueryService
{
    private readonly IConsultationRepository _consultationRepository = consultationRepository;

    public async Task<PagedResult<ConsultationListItemDto>> GetByPatientAsync(
        string tenantId,
        Guid patientId,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var skip = (page - 1) * pageSize;

        var consultations = await _consultationRepository.GetByPatientAsync(
            tenantId,
            patientId,
            skip,
            pageSize,
            cancellationToken);

        var totalCount = await _consultationRepository.CountByPatientAsync(tenantId, patientId, cancellationToken);

        return new PagedResult<ConsultationListItemDto>
        {
            Items = consultations.Select(ConsultationMapper.ToListItem).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<ConsultationDetailDto?> GetDetailAsync(
        string tenantId,
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var consultation = await _consultationRepository.GetByIdWithSymptomsAsync(tenantId, id, cancellationToken);
        return consultation is null ? null : ConsultationMapper.ToDetail(consultation);
    }

    public async Task<PagedResult<ConsultationListItemDto>> SearchAsync(
        string tenantId,
        ConsultationSearchFilters filters,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var skip = (page - 1) * pageSize;

        var consultations = await _consultationRepository.SearchAsync(
            tenantId,
            filters,
            skip,
            pageSize,
            cancellationToken);

        var totalCount = await _consultationRepository.CountAsync(tenantId, filters, cancellationToken);

        return new PagedResult<ConsultationListItemDto>
        {
            Items = consultations.Select(ConsultationMapper.ToListItem).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }
}
