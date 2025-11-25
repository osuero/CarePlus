using CarePlus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarePlus.Infrastructure.Persistence.Configurations;

public class ConsultationConfiguration : IEntityTypeConfiguration<Consultation>
{
    public void Configure(EntityTypeBuilder<Consultation> builder)
    {
        builder.HasKey(consultation => consultation.Id);
        builder.Property(consultation => consultation.ReasonForVisit).HasMaxLength(512);
        builder.Property(consultation => consultation.Notes).HasMaxLength(2000);

        builder
            .HasMany(consultation => consultation.Symptoms)
            .WithOne(symptom => symptom.Consultation)
            .HasForeignKey(symptom => symptom.ConsultationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(consultation => consultation.Prescription)
            .WithOne(prescription => prescription.Consultation)
            .HasForeignKey<Prescription>(prescription => prescription.ConsultationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(consultation => consultation.LabRequisition)
            .WithOne(requisition => requisition.Consultation)
            .HasForeignKey<LabRequisition>(requisition => requisition.ConsultationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
