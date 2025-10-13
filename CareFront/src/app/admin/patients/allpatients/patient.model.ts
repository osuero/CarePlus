import { formatDate } from '@angular/common';

export class Patient {
  id: string;
  img: string;
  name: string;
  gender: string;
  bGroup: string;
  address: string;
  mobile: string;
  treatment: string;
  age: number;
  email: string;
  admissionDate: string;
  dischargeDate: string;
  doctorAssigned: string;
  status: string;

  constructor(patient: Partial<Patient> = {}) {
    this.id = patient.id || this.getRandomID();
    this.img = patient.img || 'assets/images/user/new.jpg';
    this.name = patient.name || '';
    this.gender = patient.gender || 'male';
    this.bGroup = patient.bGroup || '';
    this.address = patient.address || '';
    this.mobile = patient.mobile || '';
    this.treatment = patient.treatment || '';
    this.age = patient.age || 0; // Default value
    this.email = patient.email || '';
    this.admissionDate =
      patient.admissionDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.dischargeDate =
      patient.dischargeDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.doctorAssigned = patient.doctorAssigned || '';
    this.status = patient.status || '';
  }

  public getRandomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000).toString(16);
    };
    return S4() + S4();
  }
}
