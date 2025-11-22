import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { Appointment } from './appointments.model';
import {
  BillingRecord,
  CreateBillingRequest,
  InsuranceProviderSummary,
  PaymentMethod,
} from '../billing/billing.model';
import { BillingService } from '../billing/billing.service';

export interface AppointmentsBillingDialogData {
  appointment: Appointment;
}

@Component({
  selector: 'app-appointments-billing-dialog',
  standalone: true,
  templateUrl: './appointments.billing-dialog.component.html',
  styleUrls: ['./appointments.billing-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
})
export class AppointmentsBillingDialogComponent
  implements OnInit, OnDestroy
{
  readonly PaymentMethod = PaymentMethod;
  readonly appointment = this.data.appointment;
  readonly form: FormGroup;
  readonly providers = signal<InsuranceProviderSummary[]>([]);
  readonly isLoadingProviders = signal(false);
  readonly formError = signal<string | null>(null);
  readonly isSubmitting = signal(false);

  private readonly destroy$ = new Subject<void>();

  readonly paymentMethodOptions: Array<{ value: PaymentMethod; label: string }> =
    [
      { value: PaymentMethod.Cash, label: 'APPOINTMENTS.BILLING.PAYMENT_METHODS.CASH' },
      {
        value: PaymentMethod.CreditCard,
        label: 'APPOINTMENTS.BILLING.PAYMENT_METHODS.CREDIT_CARD',
      },
      {
        value: PaymentMethod.DebitCard,
        label: 'APPOINTMENTS.BILLING.PAYMENT_METHODS.DEBIT_CARD',
      },
      {
        value: PaymentMethod.BankTransfer,
        label: 'APPOINTMENTS.BILLING.PAYMENT_METHODS.BANK_TRANSFER',
      },
      {
        value: PaymentMethod.InsuranceOnly,
        label: 'APPOINTMENTS.BILLING.PAYMENT_METHODS.INSURANCE_ONLY',
      },
      {
        value: PaymentMethod.Mixed,
        label: 'APPOINTMENTS.BILLING.PAYMENT_METHODS.MIXED',
      },
    ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly data: AppointmentsBillingDialogData,
    private readonly dialogRef: MatDialogRef<
      AppointmentsBillingDialogComponent,
      BillingRecord | undefined
    >,
    private readonly fb: FormBuilder,
    private readonly billingService: BillingService,
    private readonly translate: TranslateService
  ) {
    this.form = this.fb.group({
      consultationAmount: [
        this.appointment.consultationFee ?? null,
        [Validators.required, Validators.min(0.01)],
      ],
      currency: [
        this.appointment.currency ?? 'USD',
        [Validators.required, Validators.maxLength(16)],
      ],
      paymentMethod: [PaymentMethod.Cash, Validators.required],
      usesInsurance: [false],
      insuranceProviderId: [null],
      insurancePolicyNumber: [''],
      coveragePercentage: [null],
      copayAmount: [null],
      amountPaidByPatient: [null],
      amountBilledToInsurance: [null],
    });
  }

  ngOnInit(): void {
    this.setupValueSubscriptions();
    this.loadProviders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const request: CreateBillingRequest = {
      appointmentId: this.appointment.id,
      consultationAmount: Number(value.consultationAmount),
      currency: value.currency?.toString().trim() ?? this.appointment.currency,
      paymentMethod: value.paymentMethod as PaymentMethod,
      usesInsurance: !!value.usesInsurance,
      insuranceProviderId: value.usesInsurance
        ? value.insuranceProviderId ?? undefined
        : undefined,
      insurancePolicyNumber: value.usesInsurance
        ? value.insurancePolicyNumber?.toString().trim()
        : undefined,
      coveragePercentage: value.usesInsurance
        ? this.toNullableNumber(value.coveragePercentage)
        : undefined,
      copayAmount: this.toNullableNumber(value.copayAmount),
      amountPaidByPatient: this.toNullableNumber(value.amountPaidByPatient),
      amountBilledToInsurance: this.toNullableNumber(
        value.amountBilledToInsurance
      ),
    };

    this.isSubmitting.set(true);
    this.formError.set(null);

    this.billingService
      .createBilling(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (billing) => {
          this.isSubmitting.set(false);
          const title = this.translate.instant(
            'APPOINTMENTS.MESSAGES.SUCCESS_TITLE'
          );
          const message = this.translate.instant(
            'APPOINTMENTS.MESSAGES.BILLING_CREATED'
          );
          Swal.fire(title, message, 'success');
          this.dialogRef.close(billing);
        },
        error: (error: Error) => {
          this.isSubmitting.set(false);
          this.formError.set(
            error.message ||
              this.translate.instant('APPOINTMENTS.MESSAGES.ERROR_BODY')
          );
        },
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  filteredProviders(): InsuranceProviderSummary[] {
    return this.providers();
  }

  private setupValueSubscriptions(): void {
    this.form
      .get('paymentMethod')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: PaymentMethod) => {
        if (this.methodRequiresInsurance(value)) {
          this.form.patchValue({ usesInsurance: true }, { emitEvent: false });
        } else {
          this.form.patchValue(
            {
              usesInsurance: false,
              insuranceProviderId: null,
              insurancePolicyNumber: '',
              coveragePercentage: null,
              copayAmount: null,
              amountBilledToInsurance: null,
            },
            { emitEvent: false }
          );
        }
        this.updateInsuranceValidators();
      });

    this.form
      .get('usesInsurance')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateInsuranceValidators());
  }

  private updateInsuranceValidators(): void {
    const usesInsurance = !!this.form.get('usesInsurance')?.value;
    const providerControl = this.form.get('insuranceProviderId');
    const policyControl = this.form.get('insurancePolicyNumber');

    if (usesInsurance) {
      providerControl?.setValidators([Validators.required]);
      policyControl?.setValidators([Validators.required, Validators.maxLength(100)]);
    } else {
      providerControl?.clearValidators();
      policyControl?.clearValidators();
    }

    providerControl?.updateValueAndValidity();
    policyControl?.updateValueAndValidity();
  }

  private loadProviders(): void {
    this.isLoadingProviders.set(true);
    this.billingService
      .listInsuranceProviders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (providers) => {
          this.providers.set(providers);
          this.isLoadingProviders.set(false);
        },
        error: () => {
          this.providers.set([]);
          this.isLoadingProviders.set(false);
        },
      });
  }

  private methodRequiresInsurance(method: PaymentMethod): boolean {
    return method === PaymentMethod.InsuranceOnly || method === PaymentMethod.Mixed;
  }

  private toNullableNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
}
