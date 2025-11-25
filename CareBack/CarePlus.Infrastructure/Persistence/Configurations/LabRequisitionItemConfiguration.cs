using CarePlus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarePlus.Infrastructure.Persistence.Configurations;

public class LabRequisitionItemConfiguration : IEntityTypeConfiguration<LabRequisitionItem>
{
    public void Configure(EntityTypeBuilder<LabRequisitionItem> builder)
    {
        builder.HasKey(item => item.Id);
        builder.Property(item => item.TestName).HasMaxLength(256);
        builder.Property(item => item.TestCode).HasMaxLength(64);
        builder.Property(item => item.Instructions).HasMaxLength(512);
    }
}
