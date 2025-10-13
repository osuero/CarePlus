import { formatDate } from '@angular/common';

export class Income {
  incomeId: string;
  patientId: string;
  patientName: string;
  serviceType: string;
  serviceDate: string;
  amountBilled: string;
  amountPaid: string;
  paymentMethod: string;
  insuranceAmount: string;
  outstandingAmount: string;
  paymentDate: string;
  paymentStatus: string;
  doctorId: string;
  doctorFee: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  incomeType: string;
  notes: string;
  invoiceNumber: string;

  constructor(income: Partial<Income> = {}) {
    this.incomeId = income.incomeId || this.getRandomID();
    this.patientId = income.patientId || '';
    this.patientName = income.patientName || '';
    this.serviceType = income.serviceType || '';
    this.serviceDate =
      income.serviceDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.amountBilled = income.amountBilled || '';
    this.amountPaid = income.amountPaid || '';
    this.paymentMethod = income.paymentMethod || '';
    this.insuranceAmount = income.insuranceAmount || '';
    this.outstandingAmount = income.outstandingAmount || '';
    this.paymentDate =
      income.paymentDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.paymentStatus = income.paymentStatus || '';
    this.doctorId = income.doctorId || '';
    this.doctorFee = income.doctorFee || '';
    this.createdBy = income.createdBy || '';
    this.createdAt =
      income.createdAt || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.updatedBy = income.updatedBy || '';
    this.updatedAt =
      income.updatedAt || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.incomeType = income.incomeType || '';
    this.notes = income.notes || '';
    this.invoiceNumber = income.invoiceNumber || '';
  }

  public getRandomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000).toString(16);
    };
    return S4() + S4();
  }
}
