using CarePlus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarePlus.Infrastructure.Persistence.Configurations;

public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder.ToTable("Appointments");

        builder.HasKey(appointment => appointment.Id);

        builder.Property(appointment => appointment.TenantId)
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(appointment => appointment.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(appointment => appointment.Description)
            .HasMaxLength(1000);

        builder.Property(appointment => appointment.Location)
            .HasMaxLength(200);

        builder.Property(appointment => appointment.Notes)
            .HasMaxLength(2000);

        builder.Property(appointment => appointment.PatientNameSnapshot)
            .HasMaxLength(200);

        builder.Property(appointment => appointment.ProspectFirstName)
            .HasMaxLength(100);

        builder.Property(appointment => appointment.ProspectLastName)
            .HasMaxLength(100);

        builder.Property(appointment => appointment.ProspectPhoneNumber)
            .HasMaxLength(50);

        builder.Property(appointment => appointment.ProspectEmail)
            .HasMaxLength(150);

        builder.Property(appointment => appointment.DoctorNameSnapshot)
            .HasMaxLength(200);

        builder.Property(appointment => appointment.Status)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(appointment => appointment.ConsultationFee)
            .HasPrecision(18, 2)
            .HasDefaultValue(0);

        builder.Property(appointment => appointment.Currency)
            .HasMaxLength(16)
            .HasDefaultValue("USD");

        builder.HasIndex(appointment => new { appointment.TenantId, appointment.StartsAtUtc });
        builder.HasIndex(appointment => new { appointment.TenantId, appointment.PatientId });
        builder.HasIndex(appointment => new { appointment.TenantId, appointment.DoctorId });

        builder.HasOne(appointment => appointment.Patient)
            .WithMany()
            .HasForeignKey(appointment => appointment.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(appointment => appointment.Doctor)
            .WithMany()
            .HasForeignKey(appointment => appointment.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
