using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Patients;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Mappers;
using CarePlus.Application.Models;
using CarePlus.Domain.Enums;

namespace CarePlus.Application.Services;

public class PatientQueryService : IPatientQueryService
{
    private readonly IPatientRepository _patientRepository;

    public PatientQueryService(IPatientRepository patientRepository)
    {
        _patientRepository = patientRepository;
    }

    public async Task<PagedResult<PatientResponse>> SearchAsync(
        string tenantId,
        int page,
        int pageSize,
        string? search,
        string? gender,
        string? country,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var skip = (page - 1) * pageSize;
        var normalizedSearch = string.IsNullOrWhiteSpace(search) ? null : search.Trim();
        var normalizedCountry = string.IsNullOrWhiteSpace(country) ? null : country.Trim();
        var normalizedGender = NormalizeGender(gender);

        var patients = await _patientRepository.SearchAsync(
            tenantId,
            normalizedSearch,
            normalizedGender,
            normalizedCountry,
            skip,
            pageSize,
            cancellationToken);

        var totalCount = await _patientRepository.CountAsync(
            tenantId,
            normalizedSearch,
            normalizedGender,
            normalizedCountry,
            cancellationToken);

        return new PagedResult<PatientResponse>
        {
            Items = patients.Select(PatientMapper.ToResponse).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<PatientResponse?> GetByIdAsync(string tenantId, Guid id, CancellationToken cancellationToken = default)
    {
        var patient = await _patientRepository.GetByIdAsync(tenantId, id, cancellationToken);
        return patient is null ? null : PatientMapper.ToResponse(patient);
    }

    public async Task<PatientResponse?> FindAsync(string tenantId, string search, CancellationToken cancellationToken = default)
    {
        var normalizedSearch = search.Trim();
        var patients = await _patientRepository.SearchAsync(
            tenantId,
            normalizedSearch,
            null,
            null,
            skip: 0,
            take: 1,
            cancellationToken);

        var patient = patients.FirstOrDefault();
        return patient is null ? null : PatientMapper.ToResponse(patient);
    }

    private static string? NormalizeGender(string? gender)
    {
        if (string.IsNullOrWhiteSpace(gender))
        {
            return null;
        }

        return Enum.TryParse<Gender>(gender, true, out var parsed)
            ? parsed.ToString()
            : null;
    }
}
