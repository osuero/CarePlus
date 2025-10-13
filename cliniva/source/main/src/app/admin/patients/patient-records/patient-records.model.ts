import { formatDate } from '@angular/common';

export class PatientRecords {
  patientId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  dateOfAdmission: string;
  diagnosis: string;
  labReports: string;
  treatmentPlan: string;
  medications: string;
  medicationHistory: string;
  nextFollowUp: string;
  doctorsNotes: string;
  status: string;
  emergencyContact: string;
  insuranceProvider: string;

  constructor(patientRecords: Partial<PatientRecords> = {}) {
    this.patientId = patientRecords.patientId || this.getRandomID();
    this.fullName = patientRecords.fullName || '';
    this.dateOfBirth =
      patientRecords.dateOfBirth || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.gender = patientRecords.gender || 'Male';
    this.dateOfAdmission =
      patientRecords.dateOfAdmission ||
      formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.diagnosis = patientRecords.diagnosis || '';
    this.labReports = patientRecords.labReports || '';
    this.treatmentPlan = patientRecords.treatmentPlan || '';
    this.medications = patientRecords.medications || '';
    this.medicationHistory = patientRecords.medicationHistory || '';
    this.nextFollowUp =
      patientRecords.nextFollowUp || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.doctorsNotes = patientRecords.doctorsNotes || '';
    this.status = patientRecords.status || 'In Treatment';
    this.emergencyContact = patientRecords.emergencyContact || '';
    this.insuranceProvider = patientRecords.insuranceProvider || '';
  }

  public getRandomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000).toString(16);
    };
    return S4() + S4();
  }
}
