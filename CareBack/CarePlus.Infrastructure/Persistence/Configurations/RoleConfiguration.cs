using System;
using CarePlus.Domain.Constants;
using CarePlus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarePlus.Infrastructure.Persistence.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");

        builder.HasKey(role => role.Id);

        builder.HasIndex(role => new { role.TenantId, role.Name })
            .IsUnique()
            .HasFilter("[IsDeleted] = 0");

        builder.Property(role => role.TenantId)
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(role => role.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(role => role.Description)
            .HasMaxLength(256);

        builder.Property(role => role.CreatedAtUtc)
            .HasColumnType("datetime2");

        builder.Property(role => role.UpdatedAtUtc)
            .HasColumnType("datetime2");

        builder.Property(role => role.IsDeleted)
            .HasDefaultValue(false);

        builder.Property(role => role.DeletedAtUtc)
            .HasColumnType("datetime2");

        builder.HasQueryFilter(role => !role.IsDeleted);

        var seedTimestamp = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        builder.HasData(
            new Role
            {
                Id = RoleConstants.AdministratorRoleId,
                TenantId = TenantConstants.DefaultTenantId,
                Name = "Administrator",
                Description = "Global administrator role",
                IsGlobal = false,
                CreatedAtUtc = seedTimestamp,
                UpdatedAtUtc = seedTimestamp
            },
            new Role
            {
                Id = RoleConstants.DoctorRoleId,
                TenantId = TenantConstants.DefaultTenantId,
                Name = "Doctor",
                Description = "Global doctor role",
                IsGlobal = false,
                CreatedAtUtc = seedTimestamp,
                UpdatedAtUtc = seedTimestamp
            },
            new Role
            {
                Id = RoleConstants.PatientRoleId,
                TenantId = TenantConstants.DefaultTenantId,
                Name = "Patient",
                Description = "Global patient role",
                IsGlobal = false,
                CreatedAtUtc = seedTimestamp,
                UpdatedAtUtc = seedTimestamp
            });
    }
}
