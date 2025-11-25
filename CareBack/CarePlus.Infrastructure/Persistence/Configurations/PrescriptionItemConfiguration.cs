using CarePlus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarePlus.Infrastructure.Persistence.Configurations;

public class PrescriptionItemConfiguration : IEntityTypeConfiguration<PrescriptionItem>
{
    public void Configure(EntityTypeBuilder<PrescriptionItem> builder)
    {
        builder.HasKey(item => item.Id);
        builder.Property(item => item.DrugName).HasMaxLength(256);
        builder.Property(item => item.Dosage).HasMaxLength(128);
        builder.Property(item => item.Frequency).HasMaxLength(128);
        builder.Property(item => item.Route).HasMaxLength(128);
        builder.Property(item => item.Duration).HasMaxLength(128);
        builder.Property(item => item.Instructions).HasMaxLength(512);
    }
}
