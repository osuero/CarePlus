using CarePlus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarePlus.Infrastructure.Persistence.Configurations;

public class LabRequisitionConfiguration : IEntityTypeConfiguration<LabRequisition>
{
    public void Configure(EntityTypeBuilder<LabRequisition> builder)
    {
        builder.HasKey(requisition => requisition.Id);
        builder.Property(requisition => requisition.Notes).HasMaxLength(1000);

        builder
            .HasMany(requisition => requisition.Items)
            .WithOne(item => item.LabRequisition)
            .HasForeignKey(item => item.LabRequisitionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
