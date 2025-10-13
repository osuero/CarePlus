import { formatDate } from '@angular/common';

export class InsuranceProvider {
  insuranceProviderId: number;
  providerName: string;
  providerCode: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  websiteUrl: string;
  customerSupportNumber: string;
  paymentTerms: string;
  contractStartDate: string;
  contractEndDate: string;
  reimbursementRate: number;
  coverageTypes: string;
  status: string;
  contractNotes: string;
  claimDate: string;

  constructor(providerData: Partial<InsuranceProvider> = {}) {
    this.insuranceProviderId =
      providerData.insuranceProviderId || this.getRandomID();
    this.providerName = providerData.providerName || '';
    this.providerCode = providerData.providerCode || '';
    this.contactPhone = providerData.contactPhone || '';
    this.contactEmail = providerData.contactEmail || '';
    this.address = providerData.address || '';
    this.websiteUrl = providerData.websiteUrl || '';
    this.customerSupportNumber = providerData.customerSupportNumber || '';
    this.paymentTerms = providerData.paymentTerms || '';
    this.contractStartDate =
      providerData.contractStartDate ||
      formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.contractEndDate =
      providerData.contractEndDate ||
      formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.reimbursementRate = providerData.reimbursementRate || 0;
    this.coverageTypes = providerData.coverageTypes || '';
    this.status = providerData.status || '';
    this.contractNotes = providerData.contractNotes || '';
    this.claimDate =
      providerData.claimDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }

  private getRandomID(): number {
    const S4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000);
    };
    return S4() + S4();
  }
}
