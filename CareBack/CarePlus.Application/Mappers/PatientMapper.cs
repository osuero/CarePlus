using CarePlus.Application.DTOs.Patients;
using CarePlus.Domain.Entities;

namespace CarePlus.Application.Mappers;

internal static class PatientMapper
{
    public static PatientResponse ToResponse(Patient patient)
    {
        return new PatientResponse
        {
            Id = patient.Id,
            TenantId = patient.TenantId,
            FirstName = patient.FirstName,
            LastName = patient.LastName,
            Email = patient.Email,
            PhoneNumber = patient.PhoneNumber,
            Identification = patient.Identification,
            Country = patient.Country,
            Gender = patient.Gender.ToString(),
            DateOfBirth = patient.DateOfBirth,
            Age = patient.Age,
            CreatedAtUtc = patient.CreatedAtUtc,
            UpdatedAtUtc = patient.UpdatedAtUtc
        };
    }
}
