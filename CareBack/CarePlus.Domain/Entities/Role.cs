using CarePlus.Domain.Base;

namespace CarePlus.Domain.Entities;

public class Role : TenantEntity
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public bool IsGlobal { get; set; }
}
