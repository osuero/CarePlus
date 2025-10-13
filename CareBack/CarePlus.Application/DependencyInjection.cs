using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CarePlus.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IUserQueryService, UserQueryService>();
        return services;
    }
}
