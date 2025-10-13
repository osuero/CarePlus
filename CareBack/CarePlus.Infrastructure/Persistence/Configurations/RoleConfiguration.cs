using System;
using CarePlus.Domain.Constants;
using CarePlus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarePlus.Infrastructure.Persistence.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    private static readonly Guid AdminRoleId = Guid.Parse("7B65C5F7-8B06-4F97-92F1-9F81E1F66D26");
    private static readonly Guid DoctorRoleId = Guid.Parse("A2A4F51F-2A7C-4B8E-94E6-4E6E1B4B19D3");
    private static readonly Guid PatientRoleId = Guid.Parse("B13C7B8E-2E0F-4F6C-B2C5-6BC3E623EAF0");

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
                Id = AdminRoleId,
                TenantId = TenantConstants.GlobalTenantId,
                Name = "Administrator",
                Description = "Global administrator role",
                IsGlobal = true,
                CreatedAtUtc = seedTimestamp,
                UpdatedAtUtc = seedTimestamp
            },
            new Role
            {
                Id = DoctorRoleId,
                TenantId = TenantConstants.GlobalTenantId,
                Name = "Doctor",
                Description = "Global doctor role",
                IsGlobal = true,
                CreatedAtUtc = seedTimestamp,
                UpdatedAtUtc = seedTimestamp
            },
            new Role
            {
                Id = PatientRoleId,
                TenantId = TenantConstants.GlobalTenantId,
                Name = "Patient",
                Description = "Global patient role",
                IsGlobal = true,
                CreatedAtUtc = seedTimestamp,
                UpdatedAtUtc = seedTimestamp
            });
    }
}
