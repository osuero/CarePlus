using System;

namespace CarePlus.Application.DTOs.Patients;

public class PatientResponse
{
    public Guid Id { get; init; }
    public string TenantId { get; init; } = default!;
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string Email { get; init; } = default!;
    public string? PhoneNumber { get; init; }
    public string? Identification { get; init; }
    public string? Country { get; init; }
    public string Gender { get; init; } = default!;
    public DateOnly DateOfBirth { get; init; }
    public int Age { get; init; }
    public DateTime CreatedAtUtc { get; init; }
    public DateTime UpdatedAtUtc { get; init; }
}
