import { formatDate } from '@angular/common';

export class Appointment {
  id: number;
  img: string;
  name: string;
  email: string;
  gender: string;
  date: string;
  startTime: string;
  endTime: string;
  mobile: string;
  doctor: string;
  injury: string;
  appointmentStatus: string;
  visitType: string;
  paymentStatus: string;
  insuranceProvider: string;
  notes: string;
  createdAt: string;
  updatedAt: string;

  constructor(appointment: Partial<Appointment>) {
    this.id = appointment.id || this.getRandomID();
    this.img = appointment.img || 'assets/images/user/new.jpg';
    this.name = appointment.name || '';
    this.email = appointment.email || '';
    this.gender = appointment.gender || 'male';
    this.date =
      appointment.date || formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ssZ', 'en');
    this.startTime =
      appointment.startTime || formatDate(new Date(), 'HH:mm', 'en');
    this.endTime = appointment.endTime || formatDate(new Date(), 'HH:mm', 'en');
    this.mobile = appointment.mobile || '';
    this.doctor = appointment.doctor || '';
    this.injury = appointment.injury || '';
    this.appointmentStatus = appointment.appointmentStatus || '';
    this.visitType = appointment.visitType || '';
    this.paymentStatus = appointment.paymentStatus || '';
    this.insuranceProvider = appointment.insuranceProvider || '';
    this.notes = appointment.notes || '';
    this.createdAt =
      appointment.createdAt ||
      formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ssZ', 'en');
    this.updatedAt =
      appointment.updatedAt ||
      formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ssZ', 'en');
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
