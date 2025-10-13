using CarePlus.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarePlus.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(user => user.Id);

        builder.HasIndex(user => new { user.TenantId, user.Email })
            .IsUnique()
            .HasFilter("[IsDeleted] = 0");

        builder.Property(user => user.TenantId)
            .HasMaxLength(64)
            .IsRequired();

        builder.Property(user => user.FirstName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(user => user.LastName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(user => user.Email)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(user => user.PhoneNumber)
            .HasMaxLength(32);

        builder.Property(user => user.Identification)
            .HasMaxLength(50);

        builder.Property(user => user.Country)
            .HasMaxLength(100);

        builder.Property(user => user.Gender)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(user => user.DateOfBirth)
            .HasColumnType("date");

        builder.Property(user => user.RoleId);

        builder.HasOne(user => user.Role)
            .WithMany()
            .HasForeignKey(user => user.RoleId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(user => user.CreatedAtUtc)
            .HasColumnType("datetime2");

        builder.Property(user => user.UpdatedAtUtc)
            .HasColumnType("datetime2");

        builder.Property(user => user.IsDeleted)
            .HasDefaultValue(false);

        builder.Property(user => user.DeletedAtUtc)
            .HasColumnType("datetime2");

        builder.HasQueryFilter(user => !user.IsDeleted);
    }
}
