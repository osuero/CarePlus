using CarePlus.Application.DTOs.Billing;
using CarePlus.Application.Interfaces;
using CarePlus.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarePlus.Api.Endpoints;

public static class BillingEndpoints
{
    public static IEndpointRouteBuilder MapBillingEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/v1/billing")
            .WithTags("Billing")
            .RequireAuthorization("DoctorOrAdmin");

        group.MapPost("/", CreateAsync)
            .WithName("CreateBilling")
            .Produces<BillingResponse>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound);

        group.MapGet("/", SearchAsync)
            .WithName("SearchBilling")
            .Produces<PagedBillingResponse>(StatusCodes.Status200OK);

        group.MapGet("/{id:guid}", GetByIdAsync)
            .WithName("GetBillingById")
            .Produces<BillingResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        group.MapGet("/providers", ListProvidersAsync)
            .WithName("ListInsuranceProviders")
            .Produces<IReadOnlyList<InsuranceProviderResponse>>(StatusCodes.Status200OK);

        return endpoints;
    }

    private static async Task<IResult> CreateAsync(
        CreateBillingRequest request,
        ITenantProvider tenantProvider,
        IBillingService billingService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await billingService.CreateAsync(tenantId, request, cancellationToken);

        if (!result.IsSuccess)
        {
            var payload = new
            {
                error = result.ErrorCode,
                message = result.ErrorMessage
            };

            return string.Equals(result.ErrorCode, "billing.appointment.notFound", StringComparison.OrdinalIgnoreCase)
                ? Results.NotFound(payload)
                : Results.BadRequest(payload);
        }

        return Results.Created($"/api/v1/billing/{result.Value!.Id}", result.Value);
    }

    private static async Task<IResult> SearchAsync(
        [FromQuery] int page,
        [FromQuery] int pageSize,
        [FromQuery] DateTime? dateFrom,
        [FromQuery] DateTime? dateTo,
        [FromQuery] Guid? patientId,
        [FromQuery] Guid? doctorId,
        [FromQuery] string? paymentMethod,
        [FromQuery] Guid? insuranceProviderId,
        ITenantProvider tenantProvider,
        IBillingQueryService billingQueryService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var parsedPayment = Enum.TryParse<Domain.Enums.PaymentMethod>(paymentMethod, true, out var method)
            ? method
            : (Domain.Enums.PaymentMethod?)null;

        var result = await billingQueryService.SearchAsync(
            tenantId,
            page <= 0 ? 1 : page,
            pageSize <= 0 ? 10 : pageSize,
            dateFrom,
            dateTo,
            patientId,
            doctorId,
            parsedPayment,
            insuranceProviderId,
            cancellationToken);

        var payload = new PagedBillingResponse
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

    private static async Task<IResult> GetByIdAsync(
        Guid id,
        ITenantProvider tenantProvider,
        IBillingQueryService billingQueryService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var billing = await billingQueryService.GetByIdAsync(tenantId, id, cancellationToken);

        return billing is null ? Results.NotFound() : Results.Ok(billing);
    }

    private static async Task<IResult> ListProvidersAsync(
        ITenantProvider tenantProvider,
        IInsuranceProviderService insuranceProviderService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var providers = await insuranceProviderService.ListAsync(tenantId, cancellationToken);

        var response = providers
            .Select(provider => new InsuranceProviderResponse
            {
                Id = provider.Id,
                Name = provider.Name
            })
            .ToList();

        return Results.Ok(response);
    }

    private sealed class PagedBillingResponse
    {
        public required IReadOnlyList<BillingResponse> Nodes { get; init; }
        public required int TotalCount { get; init; }
        public required int Page { get; init; }
        public required int PageSize { get; init; }
        public required int TotalPages { get; init; }
        public required bool HasNextPage { get; init; }
        public required bool HasPreviousPage { get; init; }
    }

    public sealed class InsuranceProviderResponse
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
    }
}
