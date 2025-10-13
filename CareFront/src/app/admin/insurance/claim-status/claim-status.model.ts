import { formatDate } from '@angular/common';

export class ClaimStatus {
  claim_id: string;
  patient_name: string;
  claim_type: string;
  doctor_name: string;
  hospital_name: string;
  amount: number;
  approved_amount: number;
  status: string;
  claim_date: string;
  rejection_reason: string;

  constructor(claimData: Partial<ClaimStatus> = {}) {
    this.claim_id = claimData.claim_id || this.getRandomID();
    this.patient_name = claimData.patient_name || '';
    this.claim_type = claimData.claim_type || '';
    this.doctor_name = claimData.doctor_name || '';
    this.hospital_name = claimData.hospital_name || '';
    this.amount = claimData.amount || 0;
    this.approved_amount = claimData.approved_amount || 0;
    this.status = claimData.status || '';
    this.claim_date =
      claimData.claim_date || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.rejection_reason = claimData.rejection_reason || '';
  }

  private getRandomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000).toString(16);
    };
    return S4() + S4();
  }
}
