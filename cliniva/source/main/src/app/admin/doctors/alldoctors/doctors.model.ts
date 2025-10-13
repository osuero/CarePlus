import { formatDate } from '@angular/common';

export class Doctors {
  id: string;
  img: string;
  name: string;
  email: string;
  date: string;
  specialization: string;
  mobile: string;
  department: string;
  degree: string;
  experienceYears: number;
  consultationFee: number;
  availability: string;
  rating: number;
  clinicLocation: string;

  constructor(doctors: Partial<Doctors> = {}) {
    this.id = doctors.id || this.getRandomID();
    this.img = doctors.img || 'assets/images/user/new.jpg';
    this.name = doctors.name || '';
    this.email = doctors.email || '';
    this.date = doctors.date || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.specialization = doctors.specialization || '';
    this.mobile = doctors.mobile || '';
    this.department = doctors.department || '';
    this.degree = doctors.degree || '';
    this.experienceYears = doctors.experienceYears || 0;
    this.consultationFee = doctors.consultationFee || 0;
    this.availability = doctors.availability || '';
    this.rating = doctors.rating || 0;
    this.clinicLocation = doctors.clinicLocation || '';
  }

  public getRandomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000).toString(16);
    };
    return S4() + S4();
  }
}
