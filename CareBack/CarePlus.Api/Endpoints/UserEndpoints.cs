using CarePlus.Application.DTOs.Countries;
using CarePlus.Application.DTOs.Users;
using CarePlus.Application.Interfaces;
using CarePlus.Application.Interfaces.Services;
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

    private static async Task<IResult> SearchCountriesAsync(
        [FromQuery(Name = "search")] string? search,
        ICountryService countryService,
        CancellationToken cancellationToken)
    {
        var countries = await countryService.SearchAsync(search, cancellationToken);
        return Results.Ok(countries);
    }
}
