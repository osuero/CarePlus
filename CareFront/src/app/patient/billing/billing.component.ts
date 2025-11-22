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
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {
  BillingRecord,
  BillingStatus,
  PaymentMethod,
} from '../../billing/billing.model';
import { BillingService } from '../../billing/billing.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  imports: [
    CommonModule,
    BreadcrumbComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTooltipModule,
  ],
})
export class BillingComponent implements OnInit, OnDestroy {
  readonly isLoading = signal(true);
  readonly bills = signal<BillingRecord[]>([]);
  readonly totalCount = signal(0);
  readonly pageSize = signal(10);
  readonly page = signal(1);
  readonly errorMessage = signal<string | null>(null);

  readonly hasResults = computed(
    () => !this.isLoading() && this.bills().length > 0
  );

  private readonly destroy$ = new Subject<void>();
  private readonly statusLabels: Record<BillingStatus, string> = {
    [BillingStatus.Pending]: 'Pending',
    [BillingStatus.Paid]: 'Paid',
    [BillingStatus.PartiallyPaid]: 'Partially paid',
    [BillingStatus.Cancelled]: 'Cancelled',
  };

  private readonly paymentLabels: Record<PaymentMethod, string> = {
    [PaymentMethod.Cash]: 'Cash',
    [PaymentMethod.CreditCard]: 'Credit card',
    [PaymentMethod.DebitCard]: 'Debit card',
    [PaymentMethod.BankTransfer]: 'Bank transfer',
    [PaymentMethod.InsuranceOnly]: 'Insurance only',
    [PaymentMethod.Mixed]: 'Mixed',
  };

  constructor(private readonly billingService: BillingService) {}

  ngOnInit(): void {
    this.loadBilling();
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
    return this.statusLabels[status] ?? 'Unknown';
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    return this.paymentLabels[method] ?? 'Unknown';
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

  async copyBillingId(id: string): Promise<void> {
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(id);
      } catch (error) {
        console.error('Failed to copy billing identifier', error);
      }
    }
  }

  private loadBilling(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.billingService
      .searchBilling(this.page(), this.pageSize())
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
              'No fue posible obtener la informacion de facturacion.'
          );
        },
      });
  }
}
