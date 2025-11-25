using System;
using CarePlus.Application.DTOs.Consultations;
using CarePlus.Application.Interfaces;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarePlus.Api.Endpoints;

public static class ConsultationEndpoints
{
    public static IEndpointRouteBuilder MapConsultationEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/v1/consultations")
            .WithTags("Consultations")
            .RequireAuthorization("DoctorOrAdmin");

        group.MapPost("/", CreateAsync)
            .WithName("CreateConsultation")
            .Produces<ConsultationDetailDto>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        group.MapGet("/", GetByPatientAsync)
            .WithName("GetConsultationsByPatient")
            .Produces<PagedConsultationResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        group.MapGet("/{id:guid}", GetDetailAsync)
            .WithName("GetConsultationDetail")
            .Produces<ConsultationDetailDto>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPut("/{id:guid}", UpdateAsync)
            .WithName("UpdateConsultation")
            .Produces<ConsultationDetailDto>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound);

        return endpoints;
    }

    private static async Task<IResult> CreateAsync(
        [FromBody] CreateConsultationRequest request,
        ITenantProvider tenantProvider,
        IConsultationService consultationService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await consultationService.CreateAsync(tenantId, request, cancellationToken);

        if (!result.IsSuccess)
        {
            return Results.BadRequest(new { error = result.ErrorCode, message = result.ErrorMessage });
        }

        var consultation = result.Value!;
        return Results.Created($"/api/v1/consultations/{consultation.Id}", consultation);
    }

    private static async Task<IResult> GetByPatientAsync(
        [FromQuery] Guid patientId,
        [FromQuery] int page,
        [FromQuery] int pageSize,
        ITenantProvider tenantProvider,
        IConsultationQueryService consultationQueryService,
        CancellationToken cancellationToken)
    {
        if (patientId == Guid.Empty)
        {
            return Results.BadRequest(new { error = "consultation.patient.required", message = "El paciente es obligatorio." });
        }

        var tenantId = tenantProvider.GetTenantId();
        var result = await consultationQueryService.GetByPatientAsync(
            tenantId,
            patientId,
            page <= 0 ? 1 : page,
            pageSize <= 0 ? 10 : pageSize,
            cancellationToken);

        var payload = new PagedConsultationResponse
        {
            Items = result.Items,
            Page = result.Page,
            PageSize = result.PageSize,
            TotalCount = result.TotalCount
        };

        return Results.Ok(payload);
    }

    private static async Task<IResult> GetDetailAsync(
        Guid id,
        ITenantProvider tenantProvider,
        IConsultationQueryService consultationQueryService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var detail = await consultationQueryService.GetDetailAsync(tenantId, id, cancellationToken);

        return detail is null ? Results.NotFound() : Results.Ok(detail);
    }

    private static async Task<IResult> UpdateAsync(
        Guid id,
        [FromBody] UpdateConsultationRequest request,
        ITenantProvider tenantProvider,
        IConsultationService consultationService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await consultationService.UpdateAsync(tenantId, id, request, cancellationToken);

        if (!result.IsSuccess)
        {
            var status = string.Equals(result.ErrorCode, "consultation.notFound", StringComparison.Ordinal)
                ? Results.NotFound()
                : Results.BadRequest(new { error = result.ErrorCode, message = result.ErrorMessage });

            return status;
        }

        return Results.Ok(result.Value);
    }
}
