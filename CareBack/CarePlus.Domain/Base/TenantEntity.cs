using System;

namespace CarePlus.Domain.Base;

/// <summary>
/// Base class that enforces tenant awareness for all persisted entities.
/// </summary>
public abstract class TenantEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Logical identifier that segregates data per tenant.
    /// </summary>
    public required string TenantId { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public bool IsDeleted { get; private set; }

    public DateTime? DeletedAtUtc { get; private set; }

    public void Touch() => UpdatedAtUtc = DateTime.UtcNow;

    public void MarkDeleted()
    {
        if (IsDeleted)
        {
            return;
        }

        IsDeleted = true;
        DeletedAtUtc = DateTime.UtcNow;
        Touch();
    }

    public void Restore()
    {
        if (!IsDeleted)
        {
            return;
        }

        IsDeleted = false;
        DeletedAtUtc = null;
        Touch();
    }
}
