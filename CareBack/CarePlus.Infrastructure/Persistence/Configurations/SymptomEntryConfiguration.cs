using CarePlus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarePlus.Infrastructure.Persistence.Configurations;

public class SymptomEntryConfiguration : IEntityTypeConfiguration<SymptomEntry>
{
    public void Configure(EntityTypeBuilder<SymptomEntry> builder)
    {
        builder.HasKey(symptom => symptom.Id);
        builder.Property(symptom => symptom.Description).HasMaxLength(512);
        builder.Property(symptom => symptom.AdditionalNotes).HasMaxLength(1000);
    }
}
