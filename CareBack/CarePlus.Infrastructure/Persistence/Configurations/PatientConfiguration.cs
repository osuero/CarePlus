using CarePlus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarePlus.Infrastructure.Persistence.Configurations;

public class PatientConfiguration : IEntityTypeConfiguration<Patient>
{
    public void Configure(EntityTypeBuilder<Patient> builder)
    {
        builder.ToTable("Patients");

        builder.HasKey(patient => patient.Id);

        builder.HasIndex(patient => new { patient.TenantId, patient.Email })
            .IsUnique()
            .HasFilter("[IsDeleted] = 0");

        builder.Property(patient => patient.TenantId)
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(patient => patient.FirstName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(patient => patient.LastName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(patient => patient.Email)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(patient => patient.PhoneNumber)
            .HasMaxLength(32);

        builder.Property(patient => patient.Identification)
            .HasMaxLength(50);

        builder.Property(patient => patient.Country)
            .HasMaxLength(100);

        builder.Property(patient => patient.Gender)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(patient => patient.DateOfBirth)
            .HasColumnType("date");

        builder.Property(patient => patient.CreatedAtUtc)
            .HasColumnType("datetime2");

        builder.Property(patient => patient.UpdatedAtUtc)
            .HasColumnType("datetime2");

        builder.Property(patient => patient.IsDeleted)
            .HasDefaultValue(false);

        builder.Property(patient => patient.DeletedAtUtc)
            .HasColumnType("datetime2");

        builder.HasQueryFilter(patient => !patient.IsDeleted);
    }
}
