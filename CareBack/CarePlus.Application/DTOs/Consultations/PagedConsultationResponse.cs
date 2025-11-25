using System.Collections.Generic;

namespace CarePlus.Application.DTOs.Consultations;

public class PagedConsultationResponse
{
    public IReadOnlyList<ConsultationListItemDto> Items { get; init; } = new List<ConsultationListItemDto>();
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalCount { get; init; }
}
