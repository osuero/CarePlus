using CarePlus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarePlus.Infrastructure.Persistence.Configurations;

public class InsuranceProviderConfiguration : IEntityTypeConfiguration<InsuranceProvider>
{
    public void Configure(EntityTypeBuilder<InsuranceProvider> builder)
    {
        builder.ToTable("InsuranceProviders");

        builder.HasKey(provider => provider.Id);

        builder.Property(provider => provider.TenantId)
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(provider => provider.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(provider => provider.ContactInformation)
            .HasMaxLength(500);

        builder.HasIndex(provider => new { provider.TenantId, provider.Name })
            .IsUnique();
    }
}
