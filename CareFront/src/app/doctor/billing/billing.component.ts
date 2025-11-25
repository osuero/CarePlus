import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {
  BillingRecord,
  BillingStatus,
  BillingSearchOptions,
  InsuranceProviderSummary,
  PaymentMethod,
} from '../../billing/billing.model';
import { BillingService } from '../../billing/billing.service';
import {
  BillingDetailDialogComponent,
  BillingDetailDialogData,
} from '../../billing/billing-detail-dialog.component';
import { AppointmentParticipant } from '../../appointments/appointments.model';
import { AppointmentsService } from '../../appointments/appointments.service';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-doctor-billing',
  standalone: true,
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  imports: [
    CommonModule,
    BreadcrumbComponent,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTooltipModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class DoctorBillingComponent implements OnInit, OnDestroy {
  readonly isLoading = signal(true);
  readonly bills = signal<BillingRecord[]>([]);
  readonly totalCount = signal(0);
  readonly pageSize = signal(10);
  readonly page = signal(1);
  readonly errorMessage = signal<string | null>(null);
  readonly patients = signal<AppointmentParticipant[]>([]);
  readonly doctors = signal<AppointmentParticipant[]>([]);
  readonly insuranceProviders = signal<InsuranceProviderSummary[]>([]);
  readonly patientSearchControl = new FormControl<string>('', {
    nonNullable: true,
  });
  private readonly patientSearchTerm = signal('');
  readonly filteredPatients = computed(() => {
    const search = this.patientSearchTerm().toLowerCase();
    if (!search) {
      return this.patients();
    }
    return this.patients().filter((patient) =>
      patient.name?.toLowerCase().includes(search)
    );
  });

  readonly hasResults = computed(
    () => !this.isLoading() && this.bills().length > 0
  );

  private readonly destroy$ = new Subject<void>();
  readonly dateFromControl = new FormControl<Date | null>(null);
  readonly dateToControl = new FormControl<Date | null>(null);
  readonly patientFilter = new FormControl<string | null>(null);
  readonly doctorFilter = new FormControl<string | null>(null);
  readonly insuranceFilter = new FormControl<string | null>(null);
  private readonly statusLabels: Record<BillingStatus, string> = {
    [BillingStatus.Pending]: 'APPOINTMENTS.BILLING.STATUS.PENDING',
    [BillingStatus.Paid]: 'APPOINTMENTS.BILLING.STATUS.PAID',
    [BillingStatus.PartiallyPaid]: 'APPOINTMENTS.BILLING.STATUS.PARTIAL',
    [BillingStatus.Cancelled]: 'APPOINTMENTS.BILLING.STATUS.CANCELLED',
  };

  private readonly paymentLabels: Record<PaymentMethod, string> = {
    [PaymentMethod.Cash]: 'APPOINTMENTS.BILLING.PAYMENT_METHODS.CASH',
    [PaymentMethod.CreditCard]: 'APPOINTMENTS.BILLING.PAYMENT_METHODS.CREDIT_CARD',
    [PaymentMethod.DebitCard]: 'APPOINTMENTS.BILLING.PAYMENT_METHODS.DEBIT_CARD',
    [PaymentMethod.BankTransfer]: 'APPOINTMENTS.BILLING.PAYMENT_METHODS.BANK_TRANSFER',
    [PaymentMethod.InsuranceOnly]: 'APPOINTMENTS.BILLING.PAYMENT_METHODS.INSURANCE_ONLY',
    [PaymentMethod.Mixed]: 'APPOINTMENTS.BILLING.PAYMENT_METHODS.MIXED',
  };

  constructor(
    private readonly billingService: BillingService,
    private readonly appointmentsService: AppointmentsService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBilling();
    this.loadMetadata();
    this.setupFilterSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  reload(): void {
    this.loadBilling();
  }

  onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.loadBilling();
  }

  getStatusLabel(status: BillingStatus): string {
    return this.statusLabels[status] ?? 'APPOINTMENTS.BILLING.STATUS.UNKNOWN';
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    return this.paymentLabels[method] ?? 'APPOINTMENTS.BILLING.PAYMENT_METHODS.UNKNOWN';
  }

  getStatusClass(status: BillingStatus): string {
    switch (status) {
      case BillingStatus.Paid:
        return 'status-paid';
      case BillingStatus.PartiallyPaid:
        return 'status-partial';
      case BillingStatus.Cancelled:
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  }

  trackByBillingId(_: number, billing: BillingRecord): string {
    return billing.id;
  }

  openBillingDetails(billing: BillingRecord): void {
    this.dialog.open<BillingDetailDialogComponent, BillingDetailDialogData>(
      BillingDetailDialogComponent,
      {
        width: '520px',
        data: { billing },
      }
    );
  }

  onPatientSelected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value as string | null;
    if (!value) {
      this.patientFilter.setValue(null);
    } else {
      this.patientFilter.setValue(value);
    }
  }

  clearPatientSelection(): void {
    this.patientFilter.setValue(null);
    this.patientSearchControl.setValue('', { emitEvent: false });
    this.patientSearchTerm.set('');
  }

  clearFilters(): void {
    this.dateFromControl.setValue(null, { emitEvent: false });
    this.dateToControl.setValue(null, { emitEvent: false });
    this.patientFilter.setValue(null, { emitEvent: false });
    this.doctorFilter.setValue(null, { emitEvent: false });
    this.insuranceFilter.setValue(null, { emitEvent: false });
    this.patientSearchControl.setValue('', { emitEvent: false });
    this.patientSearchTerm.set('');
    this.page.set(1);
    this.loadBilling(1);
  }

  private loadBilling(pageNumber: number = this.page()): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.billingService
      .searchBilling(pageNumber, this.pageSize(), this.buildSearchOptions())
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (result) => {
          this.bills.set(result.nodes);
          this.totalCount.set(result.totalCount);
          this.page.set(result.page);
          this.pageSize.set(result.pageSize);
        },
        error: (error: Error) => {
          this.errorMessage.set(
            error.message ||
              'No fue posible obtener la información de facturación.'
          );
        },
      });
  }

  private loadMetadata(): void {
    this.appointmentsService
      .getMetadata()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (metadata) => {
          this.patients.set(metadata.patients);
          this.doctors.set(metadata.doctors);
        },
      });

    this.billingService
      .listInsuranceProviders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (providers) => this.insuranceProviders.set(providers),
      });
  }

  private setupFilterSubscriptions(): void {
    const controls: AbstractControl[] = [
      this.dateFromControl,
      this.dateToControl,
      this.doctorFilter,
      this.insuranceFilter,
    ];

    controls.forEach((control) =>
      control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.page.set(1);
        this.loadBilling(1);
      })
    );

    this.patientSearchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.patientSearchTerm.set(value ?? '');
      });

    this.patientFilter.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const selected = this.patients().find((patient) => patient.id === value);
        if (!value || !selected) {
          this.patientSearchControl.setValue('', { emitEvent: false });
        } else {
          this.patientSearchControl.setValue(selected.name, {
            emitEvent: false,
          });
          this.patientSearchTerm.set(selected.name ?? '');
        }
        this.page.set(1);
        this.loadBilling(1);
      });
  }

  private buildSearchOptions(): BillingSearchOptions {
    const dateFrom = this.dateFromControl.value;
    const dateTo = this.dateToControl.value;

    return {
      dateFrom: dateFrom ? dateFrom.toISOString() : undefined,
      dateTo: dateTo ? dateTo.toISOString() : undefined,
      patientId: this.patientFilter.value ?? undefined,
      doctorId: this.doctorFilter.value ?? undefined,
      insuranceProviderId: this.insuranceFilter.value ?? undefined,
    };
  }
}
