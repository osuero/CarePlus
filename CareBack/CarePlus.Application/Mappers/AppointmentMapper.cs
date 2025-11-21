using CarePlus.Application.DTOs.Appointments;
using CarePlus.Domain.Entities;

namespace CarePlus.Application.Mappers;

public static class AppointmentMapper
{
    public static AppointmentResponse ToResponse(Appointment appointment)
    {
        return new AppointmentResponse
        {
            Id = appointment.Id,
            TenantId = appointment.TenantId,
            PatientId = appointment.PatientId,
            PatientName = appointment.PatientNameSnapshot ??
                (appointment.Patient is null
                    ? null
                    : $"{appointment.Patient.FirstName} {appointment.Patient.LastName}".Trim()),
            PatientEmail = appointment.Patient?.Email,
            ProspectFirstName = appointment.ProspectFirstName,
            ProspectLastName = appointment.ProspectLastName,
            ProspectPhoneNumber = appointment.ProspectPhoneNumber,
            ProspectEmail = appointment.ProspectEmail,
            DoctorId = appointment.DoctorId,
            DoctorName = appointment.DoctorNameSnapshot ??
                (appointment.Doctor is null
                    ? null
                    : $"{appointment.Doctor.FirstName} {appointment.Doctor.LastName}".Trim()),
            Title = appointment.Title,
            Description = appointment.Description,
            Location = appointment.Location,
            StartsAtUtc = appointment.StartsAtUtc,
            EndsAtUtc = appointment.EndsAtUtc,
            Status = appointment.Status,
            Notes = appointment.Notes,
            ConsultationFee = appointment.ConsultationFee,
            Currency = appointment.Currency,
            CreatedAtUtc = appointment.CreatedAtUtc,
            UpdatedAtUtc = appointment.UpdatedAtUtc
        };
    }
}
