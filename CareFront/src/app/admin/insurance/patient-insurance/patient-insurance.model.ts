import { formatDate } from '@angular/common';

export class PatientInsurance {
  insurance_id: string;
  patient_id: string;
  insurance_company_name: string;
  insurance_policy_number: string;
  policy_type: string;
  coverage_start_date: string;
  coverage_end_date: string;
  coverage_amount: number;
  co_payment: number;
  policy_holder_name: string;
  plan_type: string;
  benefits: string;
  insurance_status: string;
  claim_limit: number;
  remarks: string;

  constructor(insuranceData: Partial<PatientInsurance> = {}) {
    this.insurance_id = insuranceData.insurance_id || this.getRandomID();
    this.patient_id = insuranceData.patient_id || '';
    this.insurance_company_name = insuranceData.insurance_company_name || '';
    this.insurance_policy_number = insuranceData.insurance_policy_number || '';
    this.policy_type = insuranceData.policy_type || '';
    this.coverage_start_date =
      insuranceData.coverage_start_date ||
      formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.coverage_end_date =
      insuranceData.coverage_end_date ||
      formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.coverage_amount = insuranceData.coverage_amount || 0;
    this.co_payment = insuranceData.co_payment || 0;
    this.policy_holder_name = insuranceData.policy_holder_name || '';
    this.plan_type = insuranceData.plan_type || '';
    this.benefits = insuranceData.benefits || '';
    this.insurance_status = insuranceData.insurance_status || '';
    this.claim_limit = insuranceData.claim_limit || 0;
    this.remarks = insuranceData.remarks || '';
  }

  private getRandomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000).toString(16);
    };
    return S4() + S4();
  }
}
