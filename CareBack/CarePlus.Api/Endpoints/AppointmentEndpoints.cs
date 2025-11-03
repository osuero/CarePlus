using System;
using System.Collections.Generic;
using System.Linq;
using CarePlus.Application.DTOs.Appointments;
using CarePlus.Application.Interfaces;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarePlus.Api.Endpoints;

public static class AppointmentEndpoints
{
    public static IEndpointRouteBuilder MapAppointmentEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/appointments")
            .WithTags("Appointments")
            .RequireAuthorization("DoctorOrAdmin");

        group.MapPost("/", ScheduleAsync)
            .WithName("ScheduleAppointment")
            .Produces<AppointmentResponse>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/", SearchAsync)
            .WithName("SearchAppointments")
            .Produces<PagedAppointmentResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/metadata", GetMetadataAsync)
            .WithName("GetAppointmentMetadata")
            .Produces<AppointmentMetadataResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/calendar", ListByRangeAsync)
            .WithName("ListAppointmentsByRange")
            .Produces<IReadOnlyList<AppointmentResponse>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:guid}", GetByIdAsync)
            .WithName("GetAppointmentById")
            .Produces<AppointmentResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPut("/{id:guid}", UpdateAsync)
            .WithName("UpdateAppointment")
            .Produces<AppointmentResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPost("/{id:guid}/cancel", CancelAsync)
            .WithName("CancelAppointment")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapDelete("/{id:guid}", DeleteAsync)
            .WithName("DeleteAppointment")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        return endpoints;
    }

    private static async Task<IResult> ScheduleAsync(
        ScheduleAppointmentRequest request,
        ITenantProvider tenantProvider,
        IAppointmentService appointmentService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await appointmentService.ScheduleAsync(tenantId, request, cancellationToken);

        if (!result.IsSuccess)
        {
            return Results.BadRequest(new
            {
                error = result.ErrorCode,
                message = result.ErrorMessage
            });
        }

        var appointment = result.Value!;
        return Results.Created($"/api/appointments/{appointment.Id}", appointment);
    }

    private static async Task<IResult> SearchAsync(
        [FromQuery] int page,
        [FromQuery] int pageSize,
        [FromQuery] string? search,
        [FromQuery] Guid? patientId,
        [FromQuery] Guid? doctorId,
        [FromQuery] string? status,
        [FromQuery] DateTime? fromUtc,
        [FromQuery] DateTime? toUtc,
        ITenantProvider tenantProvider,
        IAppointmentQueryService appointmentQueryService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await appointmentQueryService.SearchAsync(
            tenantId,
            page <= 0 ? 1 : page,
            pageSize <= 0 ? 10 : pageSize,
            search,
            patientId,
            doctorId,
            status,
            fromUtc,
            toUtc,
            cancellationToken);

        var payload = new PagedAppointmentResponse
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

    private static async Task<IResult> GetMetadataAsync(
        ITenantProvider tenantProvider,
        IPatientQueryService patientQueryService,
        IUserQueryService userQueryService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();

        var patientsResult = await patientQueryService.SearchAsync(
            tenantId,
            page: 1,
            pageSize: 100,
            search: null,
            gender: null,
            country: null,
            cancellationToken);

        var doctorsResult = await userQueryService.SearchAsync(
            tenantId,
            page: 1,
            pageSize: 100,
            search: null,
            role: "Doctor",
            cancellationToken);

        var payload = new AppointmentMetadataResponse
        {
            Patients = patientsResult.Items
                .Select(patient => new AppointmentParticipant
                {
                    Id = patient.Id,
                    Name = $"{patient.FirstName} {patient.LastName}".Trim(),
                    Email = patient.Email
                })
                .ToList(),
            Doctors = doctorsResult.Items
                .Select(doctor => new AppointmentParticipant
                {
                    Id = doctor.Id,
                    Name = $"{doctor.FirstName} {doctor.LastName}".Trim(),
                    Email = doctor.Email
                })
                .ToList()
        };

        return Results.Ok(payload);
    }

    private static async Task<IResult> ListByRangeAsync(
        [FromQuery] DateTime fromUtc,
        [FromQuery] DateTime toUtc,
        ITenantProvider tenantProvider,
        IAppointmentQueryService appointmentQueryService,
        CancellationToken cancellationToken)
    {
        if (toUtc <= fromUtc)
        {
            return Results.BadRequest(new
            {
                error = "validation.range.invalid",
                message = "El rango de fechas es invalido."
            });
        }

        var tenantId = tenantProvider.GetTenantId();
        var appointments = await appointmentQueryService.ListByRangeAsync(
            tenantId,
            fromUtc,
            toUtc,
            cancellationToken);

        return Results.Ok(appointments);
    }

    private static async Task<IResult> GetByIdAsync(
        Guid id,
        ITenantProvider tenantProvider,
        IAppointmentQueryService appointmentQueryService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var appointment = await appointmentQueryService.GetByIdAsync(tenantId, id, cancellationToken);

        return appointment is null ? Results.NotFound() : Results.Ok(appointment);
    }

    private static async Task<IResult> UpdateAsync(
        Guid id,
        UpdateAppointmentRequest request,
        ITenantProvider tenantProvider,
        IAppointmentService appointmentService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await appointmentService.UpdateAsync(tenantId, id, request, cancellationToken);

        if (!result.IsSuccess)
        {
            if (string.Equals(result.ErrorCode, "appointment.notFound", StringComparison.OrdinalIgnoreCase))
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

    private static async Task<IResult> CancelAsync(
        Guid id,
        ITenantProvider tenantProvider,
        IAppointmentService appointmentService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await appointmentService.CancelAsync(tenantId, id, cancellationToken);

        if (!result.IsSuccess)
        {
            if (string.Equals(result.ErrorCode, "appointment.notFound", StringComparison.OrdinalIgnoreCase))
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

    private static async Task<IResult> DeleteAsync(
        Guid id,
        ITenantProvider tenantProvider,
        IAppointmentService appointmentService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await appointmentService.DeleteAsync(tenantId, id, cancellationToken);

        if (!result.IsSuccess)
        {
            if (string.Equals(result.ErrorCode, "appointment.notFound", StringComparison.OrdinalIgnoreCase))
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

    private sealed class PagedAppointmentResponse
    {
        public required IReadOnlyList<AppointmentResponse> Nodes { get; init; }
        public required int TotalCount { get; init; }
        public required int Page { get; init; }
        public required int PageSize { get; init; }
        public required int TotalPages { get; init; }
        public required bool HasNextPage { get; init; }
        public required bool HasPreviousPage { get; init; }
    }

    public sealed class AppointmentMetadataResponse
    {
        public required IReadOnlyList<AppointmentParticipant> Patients { get; init; }
        public required IReadOnlyList<AppointmentParticipant> Doctors { get; init; }
    }

    public sealed class AppointmentParticipant
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public string? Email { get; init; }
    }
}
