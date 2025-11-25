namespace CarePlus.Application.DTOs.Patients;

using System.Collections.Generic;

public class PatientInvoiceCollectionDto
{
    public required IReadOnlyList<PatientInvoiceDto> Items { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalCount { get; init; }
}
