import { formatDate } from '@angular/common';

export class Appointments {
  id: string;
  img: string;
  patientName: string;
  email: string;
  mobile: string;
  appointmentDate: string;
  appointmentTime: string;
  gender: string;
  status: string;
  address: string;
  disease: string;
  lastVisitDate: string;

  constructor(appointments: Partial<Appointments>) {
    this.id = appointments.id || this.getRandomID();
    this.img = appointments.img || 'assets/images/user/new.jpg';
    this.patientName = appointments.patientName || '';
    this.email = appointments.email || '';
    this.mobile = appointments.mobile || '';
    this.appointmentDate =
      appointments.appointmentDate ||
      formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ssZ', 'en');
    this.appointmentTime = appointments.appointmentTime || '';
    this.gender = appointments.gender || '';
    this.status = appointments.status || 'Upcoming'; // Default status
    this.address = appointments.address || '';
    this.disease = appointments.disease || '';
    this.lastVisitDate =
      appointments.lastVisitDate ||
      formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ssZ', 'en'); // Default to current date
  }

  public getRandomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4().toString() + S4().toString();
  }
}
