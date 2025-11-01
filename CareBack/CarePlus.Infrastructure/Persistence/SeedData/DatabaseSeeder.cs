using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Domain.Constants;
using CarePlus.Domain.Entities;
using CarePlus.Domain.Enums;
using CarePlus.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CarePlus.Infrastructure.Persistence.SeedData;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(serviceProvider);

        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var loggerFactory = scope.ServiceProvider.GetService<ILoggerFactory>();
        var logger = loggerFactory?.CreateLogger("DatabaseSeeder");
        var configuration = scope.ServiceProvider.GetService<IConfiguration>();
        var passwordHasher = scope.ServiceProvider.GetService<IPasswordHasher<User>>();

        if (context.Database.IsRelational())
        {
            await context.Database.MigrateAsync(cancellationToken);
        }
        else
        {
            await context.Database.EnsureCreatedAsync(cancellationToken);
            logger?.LogInformation("Using non-relational provider; executed EnsureCreated instead of migrations.");
        }

        await ResetRolesAsync(context, logger, cancellationToken);

        if (passwordHasher is not null)
        {
            await EnsureDefaultAdministratorAsync(context, configuration, passwordHasher, logger, cancellationToken);
        }
        else
        {
            logger?.LogWarning("No se encontro un IPasswordHasher<User> registrado; se omitio la creacion del administrador por defecto.");
        }
    }

    private static async Task ResetRolesAsync(ApplicationDbContext context, ILogger? logger, CancellationToken cancellationToken)
    {
        var desiredRoles = new[]
        {
            (Id: RoleConstants.AdministratorRoleId, Name: "Administrator", Description: "Default administrator role"),
            (Id: RoleConstants.DoctorRoleId, Name: "Doctor", Description: "Default doctor role"),
            (Id: RoleConstants.PatientRoleId, Name: "Patient", Description: "Default patient role")
        };

        var desiredIds = desiredRoles.Select(role => role.Id).ToHashSet();

        var existingRoles = await context.Roles
            .IgnoreQueryFilters()
            .Where(role => desiredIds.Contains(role.Id))
            .ToDictionaryAsync(role => role.Id, cancellationToken);

        var requiresReset = existingRoles.Count != desiredRoles.Length ||
            existingRoles.Values.Any(role => !RoleMatchesExpectation(role, desiredRoles));

        if (!requiresReset)
        {
            logger?.LogInformation("Default roles already configured for tenant {TenantId}.", TenantConstants.DefaultTenantId);
            return;
        }

        if (existingRoles.Count > 0)
        {
            context.Roles.RemoveRange(existingRoles.Values);
            await context.SaveChangesAsync(cancellationToken);
            logger?.LogInformation("Removed {Count} outdated seeded roles.", existingRoles.Count);
        }

        var timestampUtc = DateTime.UtcNow;
        var rolesToInsert = desiredRoles
            .Select(role => CreateRole(role.Id, role.Name, role.Description, timestampUtc))
            .ToArray();

        await context.Roles.AddRangeAsync(rolesToInsert, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);

        logger?.LogInformation("Seeded {Count} default roles for tenant {TenantId}.", rolesToInsert.Length, TenantConstants.DefaultTenantId);
    }

    private static Role CreateRole(Guid id, string name, string description, DateTime timestampUtc)
    {
        return new Role
        {
            Id = id,
            TenantId = TenantConstants.DefaultTenantId,
            Name = name,
            Description = description,
            IsGlobal = false,
            CreatedAtUtc = timestampUtc,
            UpdatedAtUtc = timestampUtc
        };
    }

    private static bool RoleMatchesExpectation(Role role, (Guid Id, string Name, string Description)[] desiredRoles)
    {
        var desired = desiredRoles.First(candidate => candidate.Id == role.Id);

        return string.Equals(role.TenantId, TenantConstants.DefaultTenantId, StringComparison.OrdinalIgnoreCase)
            && !role.IsGlobal
            && string.Equals(role.Name, desired.Name, StringComparison.Ordinal)
            && string.Equals(role.Description ?? string.Empty, desired.Description ?? string.Empty, StringComparison.Ordinal);
    }

    private static async Task EnsureDefaultAdministratorAsync(
        ApplicationDbContext context,
        IConfiguration? configuration,
        IPasswordHasher<User> passwordHasher,
        ILogger? logger,
        CancellationToken cancellationToken)
    {
        var adminEmail = configuration?["SeedAdmin:Email"] ?? "admin@careplus.local";
        var adminPassword = configuration?["SeedAdmin:Password"] ?? "ChangeMe!123";
        var adminFirstName = configuration?["SeedAdmin:FirstName"] ?? "Default";
        var adminLastName = configuration?["SeedAdmin:LastName"] ?? "Admin";

        var adminRole = await context.Roles
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(role => role.Id == RoleConstants.AdministratorRoleId, cancellationToken);

        if (adminRole is null)
        {
            logger?.LogWarning("No se encontro el rol administrador al asegurar el usuario semilla.");
            return;
        }

        var normalizedEmail = adminEmail.ToLowerInvariant();
        var existingUser = await context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(user => user.Email == normalizedEmail, cancellationToken);

        if (existingUser is null)
        {
            existingUser = new User
            {
                TenantId = TenantConstants.DefaultTenantId,
                FirstName = adminFirstName,
                LastName = adminLastName,
                Email = normalizedEmail,
                Gender = Gender.Other,
                DateOfBirth = new DateOnly(1990, 1, 1),
                RoleId = adminRole.Id,
                CreatedAtUtc = DateTime.UtcNow,
                UpdatedAtUtc = DateTime.UtcNow
            };

            await context.Users.AddAsync(existingUser, cancellationToken);
            logger?.LogInformation("Se creo el administrador por defecto con el correo {Email}.", adminEmail);
        }
        else
        {
            existingUser.FirstName = adminFirstName;
            existingUser.LastName = adminLastName;
            existingUser.RoleId = adminRole.Id;
            existingUser.TenantId = TenantConstants.DefaultTenantId;
            existingUser.Gender = existingUser.Gender == Gender.Unknown ? Gender.Other : existingUser.Gender;
            existingUser.Touch();
        }

        var hashedPassword = passwordHasher.HashPassword(existingUser, adminPassword);
        existingUser.AssignPassword(hashedPassword, confirmed: true);
        existingUser.PasswordSetupToken = null;
        existingUser.PasswordSetupTokenExpiresAtUtc = null;

        await context.SaveChangesAsync(cancellationToken);

        logger?.LogInformation("Administrador por defecto asegurado con el correo {Email}.", adminEmail);
    }
}
