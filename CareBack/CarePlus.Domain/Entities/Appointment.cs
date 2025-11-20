using System;
using CarePlus.Domain.Base;
using CarePlus.Domain.Enums;

namespace CarePlus.Domain.Entities;

public class Appointment : TenantEntity
{
    public Guid? PatientId { get; set; }
    public Patient? Patient { get; set; }

    public Guid? DoctorId { get; set; }
    public User? Doctor { get; set; }

    public required string Title { get; set; }
    public string? Description { get; set; }
    public string? Location { get; set; }

    public DateTime StartsAtUtc { get; set; }
    public DateTime EndsAtUtc { get; set; }

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;

    public string? Notes { get; set; }

    public string? DoctorNameSnapshot { get; set; }
    public string? PatientNameSnapshot { get; set; }
    public string? ProspectFirstName { get; set; }
    public string? ProspectLastName { get; set; }
    public string? ProspectPhoneNumber { get; set; }
    public string? ProspectEmail { get; set; }
}
