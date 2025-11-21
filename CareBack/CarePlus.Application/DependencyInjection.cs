using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Services;
using CarePlus.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace CarePlus.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IUserQueryService, UserQueryService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IRoleQueryService, RoleQueryService>();
        services.AddScoped<IPatientService, PatientService>();
        services.AddScoped<IPatientQueryService, PatientQueryService>();
        services.AddScoped<IAppointmentService, AppointmentService>();
        services.AddScoped<IAppointmentQueryService, AppointmentQueryService>();
        services.AddScoped<IBillingService, BillingService>();
        services.AddScoped<IBillingQueryService, BillingQueryService>();
        services.AddScoped<IInsuranceProviderService, InsuranceProviderService>();
        services.AddScoped<IAuthService, AuthService>();
        return services;
    }
}
