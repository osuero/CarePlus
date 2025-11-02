using System;
using CarePlus.Application.DTOs.Auth;
using CarePlus.Application.Interfaces;
using CarePlus.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarePlus.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/auth")
            .WithTags("Auth");

        group.MapPost("/login", LoginAsync)
            .WithName("Login")
            .Produces<LoginResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/setup-password", GetPasswordSetupInfoAsync)
            .WithName("GetPasswordSetupInfo")
            .Produces<PasswordSetupInfoResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPost("/setup-password", CompletePasswordSetupAsync)
            .WithName("CompletePasswordSetup")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        return endpoints;
    }

    private static async Task<IResult> LoginAsync(
        LoginRequest request,
        ITenantProvider tenantProvider,
        IAuthService authService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await authService.LoginAsync(tenantId, request, cancellationToken);

        if (!result.IsSuccess)
        {
            var statusCode = string.Equals(result.ErrorCode, "auth.invalidCredentials", StringComparison.OrdinalIgnoreCase)
                ? StatusCodes.Status401Unauthorized
                : StatusCodes.Status400BadRequest;

            return Results.Problem(new()
            {
                Status = statusCode,
                Title = "Autenticacion fallida",
                Detail = result.ErrorMessage,
                Extensions = { ["code"] = result.ErrorCode }
            });
        }

        return Results.Ok(result.Value);
    }

    private static async Task<IResult> GetPasswordSetupInfoAsync(
        [FromQuery] string? token,
        [FromQuery] Guid? userId,
        IAuthService authService,
        CancellationToken cancellationToken)
    {
        var result = await authService.GetPasswordSetupInfoAsync(token, userId, cancellationToken);
        if (!result.IsSuccess)
        {
            var status = string.Equals(result.ErrorCode, "auth.invalidToken", StringComparison.OrdinalIgnoreCase)
                ? StatusCodes.Status404NotFound
                : StatusCodes.Status400BadRequest;

            return Results.Problem(new()
            {
                Status = status,
                Title = "Token invalido",
                Detail = result.ErrorMessage,
                Extensions = { ["code"] = result.ErrorCode }
            });
        }

        return Results.Ok(result.Value);
    }

    private static async Task<IResult> CompletePasswordSetupAsync(
        CompletePasswordSetupRequest request,
        IAuthService authService,
        CancellationToken cancellationToken)
    {
        var result = await authService.CompletePasswordSetupAsync(request, cancellationToken);
        if (!result.IsSuccess)
        {
            return Results.BadRequest(new
            {
                error = result.ErrorCode,
                message = result.ErrorMessage
            });
        }

        return Results.NoContent();
    }
}
