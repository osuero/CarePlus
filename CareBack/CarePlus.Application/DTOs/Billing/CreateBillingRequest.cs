using CarePlus.Domain.Enums;

namespace CarePlus.Application.DTOs.Billing;

public class CreateBillingRequest
{
    public string? TenantId { get; set; }
    public Guid AppointmentId { get; set; }
    public decimal? ConsultationAmount { get; set; }
    public string? Currency { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public bool UsesInsurance { get; set; }
    public Guid? InsuranceProviderId { get; set; }
    public string? InsurancePolicyNumber { get; set; }
    public decimal? CoveragePercentage { get; set; }
    public decimal? CopayAmount { get; set; }
    public decimal? AmountPaidByPatient { get; set; }
    public decimal? AmountBilledToInsurance { get; set; }
    public BillingStatus? Status { get; set; }
}
