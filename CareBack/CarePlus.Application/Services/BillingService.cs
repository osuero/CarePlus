using CarePlus.Application.DTOs.Billing;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Mappers;
using CarePlus.Application.Models;
using CarePlus.Domain.Entities;
using CarePlus.Domain.Enums;

namespace CarePlus.Application.Services;

public class BillingService(
    IAppointmentRepository appointmentRepository,
    IBillingRepository billingRepository,
    IInsuranceProviderRepository insuranceProviderRepository) : IBillingService
{
    private readonly IAppointmentRepository _appointmentRepository = appointmentRepository;
    private readonly IBillingRepository _billingRepository = billingRepository;
    private readonly IInsuranceProviderRepository _insuranceProviderRepository = insuranceProviderRepository;

    public async Task<Result<BillingResponse>> CreateAsync(
        string tenantId,
        CreateBillingRequest request,
        CancellationToken cancellationToken = default)
    {
        if (request.AppointmentId == Guid.Empty)
        {
            return Result<BillingResponse>.Failure("billing.appointment.required", "El identificador de la cita es requerido.");
        }

        var appointment = await _appointmentRepository.GetByIdAsync(tenantId, request.AppointmentId, cancellationToken);
        if (appointment is null)
        {
            return Result<BillingResponse>.Failure("billing.appointment.notFound", "La cita seleccionada no existe.");
        }

        if (appointment.Status != AppointmentStatus.Completed)
        {
            return Result<BillingResponse>.Failure("billing.appointment.invalidStatus", "Solo se pueden facturar citas completadas.");
        }

        var hasExistingBilling = await _billingRepository.ExistsForAppointmentAsync(tenantId, appointment.Id, cancellationToken);
        if (hasExistingBilling)
        {
            return Result<BillingResponse>.Failure("billing.duplicate", "Ya existe una facturacion para esta cita.");
        }

        var targetCurrency = string.IsNullOrWhiteSpace(request.Currency)
            ? appointment.Currency
            : request.Currency!.Trim().ToUpperInvariant();

        var consultationAmount = request.ConsultationAmount ?? appointment.ConsultationFee;
        if (consultationAmount <= 0)
        {
            return Result<BillingResponse>.Failure("billing.amount.invalid", "El monto de la consulta debe ser mayor a cero.");
        }

        var validation = await ValidateInsuranceAsync(tenantId, request, cancellationToken);
        if (!validation.IsSuccess)
        {
            return Result<BillingResponse>.Failure(validation.ErrorCode!, validation.ErrorMessage!);
        }

        var insuranceProvider = validation.Value;

        if (UsesInsurance(request.PaymentMethod) && !request.UsesInsurance)
        {
            return Result<BillingResponse>.Failure("billing.insurance.requiredFlag", "Debes marcar el uso de seguro para este metodo de pago.");
        }

        if (!UsesInsurance(request.PaymentMethod))
        {
            request.AmountBilledToInsurance = null;
            request.InsuranceProviderId = null;
            request.CoveragePercentage = null;
            request.CopayAmount = null;
            request.InsurancePolicyNumber = null;
        }

        if (request.AmountPaidByPatient.HasValue && request.AmountPaidByPatient.Value < 0)
        {
            return Result<BillingResponse>.Failure("billing.amount.patient.invalid", "El monto pagado por el paciente no puede ser negativo.");
        }

        if (request.AmountBilledToInsurance.HasValue && request.AmountBilledToInsurance.Value < 0)
        {
            return Result<BillingResponse>.Failure("billing.amount.insurance.invalid", "El monto enviado a seguro no puede ser negativo.");
        }

        var totalBreakdown = (request.AmountPaidByPatient ?? 0) + (request.AmountBilledToInsurance ?? 0);
        if (totalBreakdown > consultationAmount)
        {
            return Result<BillingResponse>.Failure("billing.amount.breakdown", "La suma de los montos supera el total de la consulta.");
        }

        var billing = new Billing
        {
            TenantId = tenantId,
            AppointmentId = appointment.Id,
            AppointmentStartsAtUtc = appointment.StartsAtUtc,
            PatientId = appointment.PatientId,
            Patient = appointment.Patient,
            DoctorId = appointment.DoctorId,
            Doctor = appointment.Doctor,
            ServiceDescription = appointment.Title,
            ConsultationAmount = consultationAmount,
            Currency = targetCurrency,
            PaymentMethod = request.PaymentMethod,
            UsesInsurance = request.UsesInsurance,
            InsuranceProviderId = request.InsuranceProviderId,
            InsuranceProvider = insuranceProvider,
            InsurancePolicyNumber = string.IsNullOrWhiteSpace(request.InsurancePolicyNumber)
                ? null
                : request.InsurancePolicyNumber.Trim(),
            CoveragePercentage = request.CoveragePercentage,
            CopayAmount = request.CopayAmount,
            AmountPaidByPatient = request.AmountPaidByPatient ?? (UsesInsurance(request.PaymentMethod) ? null : consultationAmount),
            AmountBilledToInsurance = request.AmountBilledToInsurance,
            Status = request.Status ?? (UsesInsurance(request.PaymentMethod) ? BillingStatus.Pending : BillingStatus.Paid)
        };

        billing = await _billingRepository.AddAsync(billing, cancellationToken);

        return Result<BillingResponse>.Success(BillingMapper.ToResponse(billing));
    }

    private async Task<Result<InsuranceProvider?>> ValidateInsuranceAsync(
        string tenantId,
        CreateBillingRequest request,
        CancellationToken cancellationToken)
    {
        if (!request.UsesInsurance)
        {
            return Result<InsuranceProvider?>.Success(null);
        }

        if (!UsesInsurance(request.PaymentMethod))
        {
            return Result<InsuranceProvider?>.Failure("billing.insurance.method", "El metodo de pago seleccionado no utiliza seguro.");
        }

        if (!request.InsuranceProviderId.HasValue || request.InsuranceProviderId.Value == Guid.Empty)
        {
            return Result<InsuranceProvider?>.Failure("billing.insurance.provider", "Debes seleccionar una aseguradora.");
        }

        var provider = await _insuranceProviderRepository.GetByIdAsync(tenantId, request.InsuranceProviderId.Value, cancellationToken);
        if (provider is null)
        {
            return Result<InsuranceProvider?>.Failure("billing.insurance.providerNotFound", "La aseguradora seleccionada no existe.");
        }

        if (request.CoveragePercentage.HasValue && (request.CoveragePercentage < 0 || request.CoveragePercentage > 100))
        {
            return Result<InsuranceProvider?>.Failure("billing.insurance.coverage", "El porcentaje de cobertura debe estar entre 0 y 100.");
        }

        if (string.IsNullOrWhiteSpace(request.InsurancePolicyNumber))
        {
            return Result<InsuranceProvider?>.Failure("billing.insurance.policy", "El numero de poliza es requerido cuando se usa seguro.");
        }

        return Result<InsuranceProvider?>.Success(provider);
    }

    private static bool UsesInsurance(PaymentMethod method)
    {
        return method is PaymentMethod.InsuranceOnly or PaymentMethod.Mixed;
    }
}
