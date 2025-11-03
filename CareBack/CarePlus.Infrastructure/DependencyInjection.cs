using System;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Infrastructure.Options;
using CarePlus.Infrastructure.Persistence;
using CarePlus.Infrastructure.Repositories;
using CarePlus.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Resend;

namespace CarePlus.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        AddDatabase(services, configuration);
        RegisterEmailProvider(services, configuration);

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IPatientRepository, PatientRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IAppointmentRepository, AppointmentRepository>();
        services.AddSingleton<ICountryService, CountryService>();

        return services;
    }

    private static void AddDatabase(IServiceCollection services, IConfiguration configuration)
    {
        var provider = configuration["Database:Provider"]?.ToLowerInvariant();

        if (provider is "sqlserver")
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("La cadena de conexion 'DefaultConnection' no esta configurada.");

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));
        }
        else
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase("CarePlusDb"));
        }
    }

    private static void RegisterEmailProvider(IServiceCollection services, IConfiguration configuration)
    {
        var resendSection = configuration.GetSection("Resend");
        services.Configure<ResendOptions>(resendSection);

        var resendOptions = resendSection.Get<ResendOptions>();
        var hasResend = !string.IsNullOrWhiteSpace(resendOptions?.ApiKey);

        if (hasResend)
        {
            services.AddSingleton<IResend>(sp =>
            {
                var options = sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<ResendOptions>>().Value;
                return ResendClient.Create(options.ApiKey);
            });

            services.AddScoped<IEmailService, ResendEmailService>();
        }
        else
        {
            services.AddScoped<IEmailService, EmailService>();
        }
    }
}
