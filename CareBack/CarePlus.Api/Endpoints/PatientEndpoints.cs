using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Countries;
using CarePlus.Application.DTOs.Patients;
using CarePlus.Application.Interfaces;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarePlus.Api.Endpoints;

public static class PatientEndpoints
{
    public static IEndpointRouteBuilder MapPatientEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/patients")
            .WithTags("Patients");

        group.MapPost("/register", RegisterAsync)
            .WithName("RegisterPatient")
            .Produces<PatientResponse>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/", ListAsync)
            .WithName("ListPatients")
            .Produces<PatientCollectionDto>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:guid}", GetAsync)
            .WithName("GetPatientById")
            .Produces<PatientResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPut("/{id:guid}", UpdateAsync)
            .WithName("UpdatePatient")
            .Produces<PatientResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapDelete("/{id:guid}", DeleteAsync)
            .WithName("DeletePatient")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/countries", SearchCountriesAsync)
            .WithName("SearchPatientCountries")
            .Produces<IReadOnlyList<CountryResponse>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        return endpoints;
    }

    private static async Task<IResult> RegisterAsync(
        RegisterPatientRequest request,
        ITenantProvider tenantProvider,
        IPatientService patientService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await patientService.RegisterAsync(tenantId, request, cancellationToken);

        if (!result.IsSuccess)
        {
            return Results.BadRequest(new
            {
                error = result.ErrorCode,
                message = result.ErrorMessage
            });
        }

        var patient = result.Value!;
        return Results.Created($"/api/patients/{patient.Id}", patient);
    }

    private static async Task<IResult> ListAsync(
        [FromQuery] int page,
        [FromQuery] int pageSize,
        [FromQuery] string? search,
        [FromQuery] string? gender,
        [FromQuery] string? country,
        ITenantProvider tenantProvider,
        IPatientQueryService patientQueryService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await patientQueryService.SearchAsync(
            tenantId,
            page <= 0 ? 1 : page,
            pageSize <= 0 ? 10 : pageSize,
            search,
            gender,
            country,
            cancellationToken);

        var payload = new PatientCollectionDto
        {
            Nodes = result.Items,
            TotalCount = result.TotalCount,
            Page = result.Page,
            PageSize = result.PageSize,
            TotalPages = result.TotalPages,
            HasNextPage = result.HasNextPage,
            HasPreviousPage = result.HasPreviousPage
        };

        return Results.Ok(payload);
    }

    private static async Task<IResult> GetAsync(
        Guid id,
        ITenantProvider tenantProvider,
        IPatientQueryService patientQueryService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var patient = await patientQueryService.GetByIdAsync(tenantId, id, cancellationToken);

        return patient is null ? Results.NotFound() : Results.Ok(patient);
    }

    private static async Task<IResult> UpdateAsync(
        Guid id,
        UpdatePatientRequest request,
        ITenantProvider tenantProvider,
        IPatientService patientService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await patientService.UpdateAsync(tenantId, id, request, cancellationToken);

        if (!result.IsSuccess)
        {
            if (string.Equals(result.ErrorCode, "patient.notFound", StringComparison.OrdinalIgnoreCase))
            {
                return Results.NotFound(new
                {
                    error = result.ErrorCode,
                    message = result.ErrorMessage
                });
            }

            return Results.BadRequest(new
            {
                error = result.ErrorCode,
                message = result.ErrorMessage
            });
        }

        return Results.Ok(result.Value);
    }

    private static async Task<IResult> DeleteAsync(
        Guid id,
        ITenantProvider tenantProvider,
        IPatientService patientService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await patientService.DeleteAsync(tenantId, id, cancellationToken);

        if (!result.IsSuccess)
        {
            if (string.Equals(result.ErrorCode, "patient.notFound", StringComparison.OrdinalIgnoreCase))
            {
                return Results.NotFound(new
                {
                    error = result.ErrorCode,
                    message = result.ErrorMessage
                });
            }

            return Results.BadRequest(new
            {
                error = result.ErrorCode,
                message = result.ErrorMessage
            });
        }

        return Results.NoContent();
    }

    private static async Task<IResult> SearchCountriesAsync(
        [FromQuery(Name = "search")] string? search,
        ICountryService countryService,
        CancellationToken cancellationToken)
    {
        var countries = await countryService.SearchAsync(search, cancellationToken);
        return Results.Ok(countries);
    }

    private sealed class PatientCollectionDto
    {
        public required IReadOnlyList<PatientResponse> Nodes { get; init; }
        public required int TotalCount { get; init; }
        public required int Page { get; init; }
        public required int PageSize { get; init; }
        public required int TotalPages { get; init; }
        public required bool HasNextPage { get; init; }
        public required bool HasPreviousPage { get; init; }
    }
}
