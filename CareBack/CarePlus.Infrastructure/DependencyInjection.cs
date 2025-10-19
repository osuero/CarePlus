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

        services.Configure<ResendOptions>(configuration.GetSection("Resend"));

        services.AddSingleton<IResend>(sp =>
        {
            var options = sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<ResendOptions>>().Value;

            if (string.IsNullOrWhiteSpace(options.ApiKey))
            {
                throw new InvalidOperationException("La clave de API de Resend no está configurada.");
            }

            return ResendClient.Create(options.ApiKey);
        });

        services.AddScoped<IEmailService, ResendEmailService>();

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IPatientRepository, PatientRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
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
}
