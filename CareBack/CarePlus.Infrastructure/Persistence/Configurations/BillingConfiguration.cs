using CarePlus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarePlus.Infrastructure.Persistence.Configurations;

public class BillingConfiguration : IEntityTypeConfiguration<Billing>
{
    public void Configure(EntityTypeBuilder<Billing> builder)
    {
        builder.ToTable("Billings");

        builder.HasKey(billing => billing.Id);

        builder.Property(billing => billing.TenantId)
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(billing => billing.ServiceDescription)
            .HasMaxLength(300)
            .IsRequired();

        builder.Property(billing => billing.Currency)
            .HasMaxLength(16)
            .IsRequired();

        builder.Property(billing => billing.ConsultationAmount)
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(billing => billing.CopayAmount)
            .HasPrecision(18, 2);

        builder.Property(billing => billing.AmountPaidByPatient)
            .HasPrecision(18, 2);

        builder.Property(billing => billing.AmountBilledToInsurance)
            .HasPrecision(18, 2);

        builder.Property(billing => billing.PaymentMethod)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(billing => billing.Status)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(billing => billing.InsurancePolicyNumber)
            .HasMaxLength(100);

        builder.HasIndex(billing => new { billing.TenantId, billing.AppointmentId })
            .IsUnique();

        builder.HasOne(billing => billing.Appointment)
            .WithMany()
            .HasForeignKey(billing => billing.AppointmentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(billing => billing.Patient)
            .WithMany()
            .HasForeignKey(billing => billing.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(billing => billing.Doctor)
            .WithMany()
            .HasForeignKey(billing => billing.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(billing => billing.InsuranceProvider)
            .WithMany()
            .HasForeignKey(billing => billing.InsuranceProviderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
