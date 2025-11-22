export enum PaymentMethod {
  Cash = 0,
  CreditCard = 1,
  DebitCard = 2,
  BankTransfer = 3,
  InsuranceOnly = 4,
  Mixed = 5,
}

export enum BillingStatus {
  Pending = 0,
  Paid = 1,
  PartiallyPaid = 2,
  Cancelled = 3,
}

export interface BillingRecord {
  id: string;
  tenantId: string;
  appointmentId: string;
  appointmentStartsAtUtc: string;
  patientName?: string | null;
  patientId?: string | null;
  doctorName?: string | null;
  doctorId?: string | null;
  serviceDescription: string;
  consultationAmount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  usesInsurance: boolean;
  insuranceProviderId?: string | null;
  insuranceProviderName?: string | null;
  insurancePolicyNumber?: string | null;
  coveragePercentage?: number | null;
  copayAmount?: number | null;
  amountPaidByPatient?: number | null;
  amountBilledToInsurance?: number | null;
  status: BillingStatus;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface BillingCollection {
  nodes: BillingRecord[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BillingSearchOptions {
  dateFrom?: string | null;
  dateTo?: string | null;
  patientId?: string | null;
  doctorId?: string | null;
  paymentMethod?: PaymentMethod | null;
  insuranceProviderId?: string | null;
  tenantId?: string | null;
}

export interface CreateBillingRequest {
  tenantId?: string | null;
  appointmentId: string;
  consultationAmount?: number | null;
  currency?: string | null;
  paymentMethod: PaymentMethod;
  usesInsurance: boolean;
  insuranceProviderId?: string | null;
  insurancePolicyNumber?: string | null;
  coveragePercentage?: number | null;
  copayAmount?: number | null;
  amountPaidByPatient?: number | null;
  amountBilledToInsurance?: number | null;
  status?: BillingStatus | null;
}

export interface InsuranceProviderSummary {
  id: string;
  name: string;
}
