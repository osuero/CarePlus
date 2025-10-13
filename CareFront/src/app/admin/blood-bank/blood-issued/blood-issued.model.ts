export class BloodIssued {
  issueId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  bloodProductId: string;
  bloodType: string;
  componentType: string;
  quantityIssued: number;
  issueDate: string;
  batchNumber: string;
  issuedBy: string;
  issueReason: string;
  patientBloodGroup: string;
  doctorId: string;
  doctorName: string;
  unitOfMeasure: string;
  bloodStatus: string;
  bloodTransfusionDate: string;
  remarks: string;

  constructor(bloodIssued: Partial<BloodIssued> = {}) {
    this.issueId = bloodIssued.issueId || '';
    this.patientId = bloodIssued.patientId || '';
    this.patientName = bloodIssued.patientName || '';
    this.patientAge = bloodIssued.patientAge || 0;
    this.patientGender = bloodIssued.patientGender || '';
    this.bloodProductId = bloodIssued.bloodProductId || '';
    this.bloodType = bloodIssued.bloodType || '';
    this.componentType = bloodIssued.componentType || '';
    this.quantityIssued = bloodIssued.quantityIssued || 0;
    this.issueDate = bloodIssued.issueDate || '';
    this.batchNumber = bloodIssued.batchNumber || '';
    this.issuedBy = bloodIssued.issuedBy || '';
    this.issueReason = bloodIssued.issueReason || '';
    this.patientBloodGroup = bloodIssued.patientBloodGroup || '';
    this.doctorId = bloodIssued.doctorId || '';
    this.doctorName = bloodIssued.doctorName || '';
    this.unitOfMeasure = bloodIssued.unitOfMeasure || 'mL';
    this.bloodStatus = bloodIssued.bloodStatus || '';
    this.bloodTransfusionDate = bloodIssued.bloodTransfusionDate || '';
    this.remarks = bloodIssued.remarks || '';
  }
}
