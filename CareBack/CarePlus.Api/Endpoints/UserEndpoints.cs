using System;
using System.Collections.Generic;
using CarePlus.Application.DTOs.Countries;
using CarePlus.Application.DTOs.Users;
using CarePlus.Application.Interfaces;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarePlus.Api.Endpoints;

public static class UserEndpoints
{
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/users")
            .WithTags("Users");

        group.MapPost("/register", RegisterAsync)
            .WithName("RegisterUser")
            .Produces<UserResponse>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/", ListAsync)
            .WithName("ListUsers")
            .Produces<UserCollectionDto>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:guid}", GetAsync)
            .WithName("GetUserById")
            .Produces<UserResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPut("/{id:guid}", UpdateAsync)
            .WithName("UpdateUser")
            .Produces<UserResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapDelete("/{id:guid}", DeleteAsync)
            .WithName("DeleteUser")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/countries", SearchCountriesAsync)
            .WithName("SearchCountries")
            .Produces<IReadOnlyList<CountryResponse>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        return endpoints;
    }

    private static async Task<IResult> RegisterAsync(
        RegisterUserRequest request,
        ITenantProvider tenantProvider,
        IUserService userService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await userService.RegisterAsync(tenantId, request, cancellationToken);

        if (!result.IsSuccess)
        {
            return Results.BadRequest(new
            {
                error = result.ErrorCode,
                message = result.ErrorMessage
            });
        }

        var user = result.Value!;
        return Results.Created($"/api/users/{user.Id}", user);
    }

    private static async Task<IResult> ListAsync(
        [FromQuery] int page,
        [FromQuery] int pageSize,
        [FromQuery] string? search,
        [FromQuery] string? role,
        ITenantProvider tenantProvider,
        IUserQueryService userQueryService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await userQueryService.SearchAsync(
            tenantId,
            page <= 0 ? 1 : page,
            pageSize <= 0 ? 10 : pageSize,
            search,
            role,
            cancellationToken);

        var payload = new UserCollectionDto
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
        IUserQueryService userQueryService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var user = await userQueryService.GetByIdAsync(tenantId, id, cancellationToken);

        return user is null ? Results.NotFound() : Results.Ok(user);
    }

    private static async Task<IResult> UpdateAsync(
        Guid id,
        UpdateUserRequest request,
        ITenantProvider tenantProvider,
        IUserService userService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await userService.UpdateAsync(tenantId, id, request, cancellationToken);

        if (!result.IsSuccess)
        {
            if (string.Equals(result.ErrorCode, "user.notFound", StringComparison.OrdinalIgnoreCase))
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
        IUserService userService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await userService.DeleteAsync(tenantId, id, cancellationToken);

        if (!result.IsSuccess)
        {
            if (string.Equals(result.ErrorCode, "user.notFound", StringComparison.OrdinalIgnoreCase))
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

    private sealed class UserCollectionDto
    {
        public required IReadOnlyList<UserResponse> Nodes { get; init; }
        public required int TotalCount { get; init; }
        public required int Page { get; init; }
        public required int PageSize { get; init; }
        public required int TotalPages { get; init; }
        public required bool HasNextPage { get; init; }
        public required bool HasPreviousPage { get; init; }
    }
}
