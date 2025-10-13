import { formatDate } from '@angular/common';

export class Patient {
  id: string;
  img: string;
  name: string;
  gender: string;
  age: number;
  dob: string;
  maritalStatus: string;
  nationalId: string;

  // Contact & Address
  email: string;
  mobile: string;
  address: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;

  // Medical Information
  bGroup: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  pastMedicalHistory: string;

  // Admission & Visit
  admissionDate: string;
  dischargeDate: string;
  status: string; // admitted/discharged
  doctorAssigned: string;
  wardNumber: string;
  roomNumber: string;
  reasonForAdmission: string;
  treatment: string;

  // Vitals History
  vitalHistory: {
    date: string;
    bloodPressure: { systolic: number; diastolic: number };
    heartRate: number;
    temperature: number;
    weight: number;
    bmi: number;
  }[];

  constructor(patient: Partial<Patient> = {}) {
    this.id = patient.id || this.getRandomID();
    this.img = patient.img || 'assets/images/user/user4.jpg';
    this.name = patient.name || '';
    this.gender = patient.gender || 'male';
    this.age = patient.age || 0;
    this.dob = patient.dob || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.maritalStatus = patient.maritalStatus || '';
    this.nationalId = patient.nationalId || '';

    this.email = patient.email || '';
    this.mobile = patient.mobile || '';
    this.address = patient.address || '';
    this.emergencyContactName = patient.emergencyContactName || '';
    this.emergencyContactRelation = patient.emergencyContactRelation || '';
    this.emergencyContactPhone = patient.emergencyContactPhone || '';

    this.bGroup = patient.bGroup || '';
    this.allergies = patient.allergies || [];
    this.chronicConditions = patient.chronicConditions || [];
    this.currentMedications = patient.currentMedications || [];
    this.pastMedicalHistory = patient.pastMedicalHistory || '';

    this.admissionDate =
      patient.admissionDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.dischargeDate =
      patient.dischargeDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.status = patient.status || 'discharged';
    this.doctorAssigned = patient.doctorAssigned || '';
    this.wardNumber = patient.wardNumber || '';
    this.roomNumber = patient.roomNumber || '';
    this.reasonForAdmission = patient.reasonForAdmission || '';
    this.treatment = patient.treatment || '';

    this.vitalHistory = patient.vitalHistory || [];
  }

  public getRandomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000).toString(16);
    };
    return S4() + S4();
  }
}

export interface PatientVisit {
  id: string;
  date: string;
  doctor: string;
  treatment: string;
  charges: number;
  outcome: string;
}
