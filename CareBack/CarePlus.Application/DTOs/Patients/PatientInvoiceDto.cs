namespace CarePlus.Application.DTOs.Patients;

using System;

public class PatientInvoiceDto
{
    public Guid Id { get; init; }
    public Guid? PatientId { get; init; }
    public Guid AppointmentId { get; init; }
    public DateTime Date { get; init; }
    public decimal TotalAmount { get; init; }
    public string PaymentMethod { get; init; } = string.Empty;
    public string? InsuranceProviderName { get; init; }
    public string Status { get; init; } = string.Empty;
}
