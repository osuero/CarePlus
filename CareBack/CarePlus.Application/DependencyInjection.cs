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
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IRoleQueryService, RoleQueryService>();
        services.AddScoped<IPatientService, PatientService>();
        services.AddScoped<IPatientQueryService, PatientQueryService>();
        return services;
    }
}
