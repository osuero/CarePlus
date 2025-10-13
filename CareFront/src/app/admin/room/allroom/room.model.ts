import { formatDate } from '@angular/common';

export class Room {
  id: string;
  img: string;
  patientName: string;
  roomNo: string;
  roomType: string;
  bedNo: string;
  gender: string;
  admitDate: string;
  dischargeDate: string;
  doctorAssigned: string;
  status: string;
  amountCharged: number;
  age: number;
  mobile: string;
  email: string;

  constructor(room: Partial<Room> = {}) {
    this.id = room.id || this.getRandomID();
    this.img = room.img || 'assets/images/user/new.jpg';
    this.patientName = room.patientName || '';
    this.roomNo = room.roomNo || '';
    this.bedNo = room.bedNo || '';
    this.roomType = room.roomType || '';
    this.gender = room.gender || '';
    this.admitDate =
      room.admitDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.dischargeDate =
      room.dischargeDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.doctorAssigned = room.doctorAssigned || '';
    this.status = room.status || '';
    this.amountCharged = room.amountCharged || 0;
    this.age = room.age || 0;
    this.mobile = room.mobile || '';
    this.email = room.email || '';
  }

  public getRandomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000).toString(16);
    };
    return S4() + S4();
  }
}
