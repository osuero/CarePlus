using System;
using CarePlus.Domain.Enums;

namespace CarePlus.Application.DTOs.Appointments;

public class AppointmentResponse
{
    public Guid Id { get; init; }
    public string TenantId { get; init; } = default!;
    public Guid? PatientId { get; init; }
    public string? PatientName { get; init; }
    public string? PatientEmail { get; init; }
    public string? ProspectFirstName { get; init; }
    public string? ProspectLastName { get; init; }
    public string? ProspectPhoneNumber { get; init; }
    public string? ProspectEmail { get; init; }
    public Guid? DoctorId { get; init; }
    public string? DoctorName { get; init; }
    public string Title { get; init; } = default!;
    public string? Description { get; init; }
    public string? Location { get; init; }
    public DateTime StartsAtUtc { get; init; }
    public DateTime EndsAtUtc { get; init; }
    public AppointmentStatus Status { get; init; }
    public string? Notes { get; init; }
    public decimal ConsultationFee { get; init; }
    public string Currency { get; init; } = "USD";
    public DateTime CreatedAtUtc { get; init; }
    public DateTime UpdatedAtUtc { get; init; }
}
