using CarePlus.Application.DTOs.Billing;
using CarePlus.Domain.Entities;

namespace CarePlus.Application.Mappers;

public static class BillingMapper
{
    public static BillingResponse ToResponse(Billing billing)
    {
        return new BillingResponse
        {
            Id = billing.Id,
            TenantId = billing.TenantId,
            AppointmentId = billing.AppointmentId,
            AppointmentStartsAtUtc = billing.AppointmentStartsAtUtc,
            PatientId = billing.PatientId,
            PatientName = billing.Patient?.FullName() ?? billing.Appointment?.PatientNameSnapshot,
            DoctorId = billing.DoctorId,
            DoctorName = billing.Doctor is null
                ? billing.Appointment?.DoctorNameSnapshot
                : $"{billing.Doctor.FirstName} {billing.Doctor.LastName}".Trim(),
            ServiceDescription = billing.ServiceDescription,
            ConsultationAmount = billing.ConsultationAmount,
            Currency = billing.Currency,
            PaymentMethod = billing.PaymentMethod,
            UsesInsurance = billing.UsesInsurance,
            InsuranceProviderId = billing.InsuranceProviderId,
            InsuranceProviderName = billing.InsuranceProvider?.Name,
            InsurancePolicyNumber = billing.InsurancePolicyNumber,
            CoveragePercentage = billing.CoveragePercentage,
            CopayAmount = billing.CopayAmount,
            AmountPaidByPatient = billing.AmountPaidByPatient,
            AmountBilledToInsurance = billing.AmountBilledToInsurance,
            Status = billing.Status,
            CreatedAtUtc = billing.CreatedAtUtc,
            UpdatedAtUtc = billing.UpdatedAtUtc
        };
    }

    private static string? FullName(this Patient? patient)
    {
        if (patient is null)
        {
            return null;
        }

        return $"{patient.FirstName} {patient.LastName}".Trim();
    }
}
