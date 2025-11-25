import { Injectable } from '@angular/core';
import { BillingRecord } from './billing.model';

@Injectable({
  providedIn: 'root',
})
export class BillingPrintService {
  print(billing: BillingRecord): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      return;
    }

    const insurance = billing.usesInsurance
      ? `<p><strong>Insurance Provider:</strong> ${
          billing.insuranceProviderName ?? 'N/A'
        }</p>
         <p><strong>Policy:</strong> ${
           billing.insurancePolicyNumber ?? 'N/A'
         }</p>`
      : '<p><strong>Insurance:</strong> Not used</p>';

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${billing.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { font-size: 20px; margin-bottom: 0; }
            h2 { font-size: 16px; margin-top: 24px; }
            .section { margin-bottom: 16px; }
            .meta { color: #616161; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Consultation Invoice</h1>
          <p class="meta">Issued ${new Date(
            billing.createdAtUtc
          ).toLocaleString()}</p>

          <div class="section">
            <h2>Appointment</h2>
            <p><strong>Patient:</strong> ${billing.patientName ?? '-'}</p>
            <p><strong>Doctor:</strong> ${billing.doctorName ?? '-'}</p>
            <p><strong>Date:</strong> ${new Date(
              billing.appointmentStartsAtUtc
            ).toLocaleString()}</p>
          </div>

          <div class="section">
            <h2>Payment</h2>
            <p><strong>Amount:</strong> ${billing.consultationAmount.toLocaleString(
              undefined,
              { style: 'currency', currency: billing.currency }
            )}</p>
            <p><strong>Status:</strong> ${BillingPrintService.formatStatus(
              billing.status
            )}</p>
            ${insurance}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  private static formatStatus(status: BillingRecord['status']): string {
    switch (status) {
      case 1:
        return 'Paid';
      case 2:
        return 'Partially paid';
      case 3:
        return 'Cancelled';
      default:
        return 'Pending';
    }
  }
}
