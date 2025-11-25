using CarePlus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarePlus.Infrastructure.Persistence.Configurations;

public class PrescriptionConfiguration : IEntityTypeConfiguration<Prescription>
{
    public void Configure(EntityTypeBuilder<Prescription> builder)
    {
        builder.HasKey(prescription => prescription.Id);

        builder.Property(prescription => prescription.DoctorName).HasMaxLength(256);
        builder.Property(prescription => prescription.DoctorCode).HasMaxLength(64);
        builder.Property(prescription => prescription.MedicalCenterName).HasMaxLength(256);
        builder.Property(prescription => prescription.Notes).HasMaxLength(1000);

        builder
            .HasMany(prescription => prescription.Items)
            .WithOne(item => item.Prescription)
            .HasForeignKey(item => item.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
