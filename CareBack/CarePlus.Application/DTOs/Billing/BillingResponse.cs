using CarePlus.Domain.Enums;

namespace CarePlus.Application.DTOs.Billing;

public class BillingResponse
{
    public Guid Id { get; init; }
    public string TenantId { get; init; } = default!;
    public Guid AppointmentId { get; init; }
    public DateTime AppointmentStartsAtUtc { get; init; }
    public string? PatientName { get; init; }
    public Guid? PatientId { get; init; }
    public string? DoctorName { get; init; }
    public Guid? DoctorId { get; init; }
    public string ServiceDescription { get; init; } = string.Empty;
    public decimal ConsultationAmount { get; init; }
    public string Currency { get; init; } = "USD";
    public PaymentMethod PaymentMethod { get; init; }
    public bool UsesInsurance { get; init; }
    public Guid? InsuranceProviderId { get; init; }
    public string? InsuranceProviderName { get; init; }
    public string? InsurancePolicyNumber { get; init; }
    public decimal? CoveragePercentage { get; init; }
    public decimal? CopayAmount { get; init; }
    public decimal? AmountPaidByPatient { get; init; }
    public decimal? AmountBilledToInsurance { get; init; }
    public BillingStatus Status { get; init; }
    public DateTime CreatedAtUtc { get; init; }
    public DateTime UpdatedAtUtc { get; init; }
}
