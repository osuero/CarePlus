using System;

namespace CarePlus.Application.DTOs.Appointments;

public class ScheduleAppointmentRequest
{
    public string? TenantId { get; set; }
    public Guid PatientId { get; set; }
    public Guid? DoctorId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Location { get; set; }
    public DateTime? StartsAtUtc { get; set; }
    public DateTime? EndsAtUtc { get; set; }
    public string? Notes { get; set; }
    public string? Status { get; set; }
}
