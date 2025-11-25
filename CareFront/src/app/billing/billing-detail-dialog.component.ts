import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { BillingRecord, BillingStatus, PaymentMethod } from './billing.model';
import { BillingPrintService } from './billing-print.service';

export interface BillingDetailDialogData {
  billing: BillingRecord;
}

@Component({
  selector: 'app-billing-detail-dialog',
  standalone: true,
  templateUrl: './billing-detail-dialog.component.html',
  styleUrls: ['./billing-detail-dialog.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    TranslateModule,
  ],
})
export class BillingDetailDialogComponent {
  readonly PaymentMethod = PaymentMethod;
  readonly BillingStatus = BillingStatus;
  private readonly statusKeys: Record<BillingStatus, string> = {
    [BillingStatus.Pending]: 'APPOINTMENTS.BILLING.STATUS.PENDING',
    [BillingStatus.Paid]: 'APPOINTMENTS.BILLING.STATUS.PAID',
    [BillingStatus.PartiallyPaid]: 'APPOINTMENTS.BILLING.STATUS.PARTIAL',
    [BillingStatus.Cancelled]: 'APPOINTMENTS.BILLING.STATUS.CANCELLED',
  };

  private readonly paymentKeys: Record<PaymentMethod, string> = {
    [PaymentMethod.Cash]: 'APPOINTMENTS.BILLING.PAYMENT_METHODS.CASH',
    [PaymentMethod.CreditCard]:
      'APPOINTMENTS.BILLING.PAYMENT_METHODS.CREDIT_CARD',
    [PaymentMethod.DebitCard]:
      'APPOINTMENTS.BILLING.PAYMENT_METHODS.DEBIT_CARD',
    [PaymentMethod.BankTransfer]:
      'APPOINTMENTS.BILLING.PAYMENT_METHODS.BANK_TRANSFER',
    [PaymentMethod.InsuranceOnly]:
      'APPOINTMENTS.BILLING.PAYMENT_METHODS.INSURANCE_ONLY',
    [PaymentMethod.Mixed]: 'APPOINTMENTS.BILLING.PAYMENT_METHODS.MIXED',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: BillingDetailDialogData,
    private readonly billingPrint: BillingPrintService
  ) {}

  getStatusTranslationKey(status: BillingStatus): string {
    return this.statusKeys[status] ?? 'APPOINTMENTS.BILLING.STATUS.UNKNOWN';
  }

  getStatusCssClass(status: BillingStatus): string {
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

  getPaymentMethodTranslationKey(method: PaymentMethod): string {
    return (
      this.paymentKeys[method] ||
      'APPOINTMENTS.BILLING.PAYMENT_METHODS.UNKNOWN'
    );
  }

  print(): void {
    this.billingPrint.print(this.data.billing);
  }
}
