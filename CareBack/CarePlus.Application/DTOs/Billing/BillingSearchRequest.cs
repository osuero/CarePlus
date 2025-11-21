using CarePlus.Domain.Enums;

namespace CarePlus.Application.DTOs.Billing;

public class BillingSearchRequest
{
    public DateTime? DateFromUtc { get; init; }
    public DateTime? DateToUtc { get; init; }
    public Guid? PatientId { get; init; }
    public Guid? DoctorId { get; init; }
    public PaymentMethod? PaymentMethod { get; init; }
    public Guid? InsuranceProviderId { get; init; }
}
