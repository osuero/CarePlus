using System;
using CarePlus.Domain.Constants;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace CarePlus.Infrastructure.Persistence;

/// <summary>
/// Design-time factory that allows EF Core tools to instantiate the context when creating migrations.
/// </summary>
public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var configuration = BuildConfiguration();
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? GetFallbackConnectionString();

        optionsBuilder.UseSqlServer(connectionString);

        return new ApplicationDbContext(optionsBuilder.Options);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        return new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();
    }

    private static string GetFallbackConnectionString()
    {
        var databaseName = TenantConstants.DefaultTenantId.Replace('-', '_');
        return $"Server=(localdb)\\\\MSSQLLocalDB;Database=CarePlus_{databaseName};Trusted_Connection=True;MultipleActiveResultSets=true";
    }
}
