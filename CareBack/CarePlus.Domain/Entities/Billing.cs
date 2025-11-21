using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CarePlus.Domain.Base;
using CarePlus.Domain.Enums;

namespace CarePlus.Domain.Entities;

public class Billing : TenantEntity
{
    [Required]
    public Guid AppointmentId { get; set; }

    public Appointment? Appointment { get; set; }

    public Guid? PatientId { get; set; }
    public Patient? Patient { get; set; }

    public Guid? DoctorId { get; set; }
    public User? Doctor { get; set; }

    [Required]
    public DateTime AppointmentStartsAtUtc { get; set; }

    [Required]
    [MaxLength(300)]
    public string ServiceDescription { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    [Range(0, double.MaxValue)]
    public decimal ConsultationAmount { get; set; }

    [Required]
    [MaxLength(16)]
    public string Currency { get; set; } = "USD";

    [Required]
    public PaymentMethod PaymentMethod { get; set; }

    public bool UsesInsurance { get; set; }

    public Guid? InsuranceProviderId { get; set; }
    public InsuranceProvider? InsuranceProvider { get; set; }

    [MaxLength(100)]
    public string? InsurancePolicyNumber { get; set; }

    [Range(0, 100)]
    public decimal? CoveragePercentage { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    [Range(0, double.MaxValue)]
    public decimal? CopayAmount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    [Range(0, double.MaxValue)]
    public decimal? AmountPaidByPatient { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    [Range(0, double.MaxValue)]
    public decimal? AmountBilledToInsurance { get; set; }

    [Required]
    public BillingStatus Status { get; set; } = BillingStatus.Pending;
}
