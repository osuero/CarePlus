import { formatDate } from '@angular/common';

export class ShiftManagement {
  doctorId: string;
  img: string;
  doctorName: string;
  department: string;
  specialty: string;
  shiftStartDate: string;
  shiftEndDate: string;
  workDays: string;
  shiftHours: string;
  shiftType: string;
  availabilityStatus: string;
  overtimeHours: string;
  totalHoursPerWeek: string;
  shiftNotes: string;

  constructor(shiftManagement: Partial<ShiftManagement> = {}) {
    this.doctorId = shiftManagement.doctorId || this.getRandomID();
    this.img = shiftManagement.img || 'assets/images/user/new.jpg';
    this.doctorName = shiftManagement.doctorName || '';
    this.department = shiftManagement.department || '';
    this.specialty = shiftManagement.specialty || '';
    this.shiftStartDate =
      shiftManagement.shiftStartDate ||
      formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.shiftEndDate =
      shiftManagement.shiftEndDate ||
      formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.workDays = shiftManagement.workDays || '';
    this.shiftHours = shiftManagement.shiftHours || '';
    this.shiftType = shiftManagement.shiftType || '';
    this.availabilityStatus = shiftManagement.availabilityStatus || '';
    this.overtimeHours = shiftManagement.overtimeHours || '0 hours';
    this.totalHoursPerWeek = shiftManagement.totalHoursPerWeek || '40 hours';
    this.shiftNotes = shiftManagement.shiftNotes || '';
  }

  public getRandomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000).toString(16);
    };
    return S4() + S4();
  }
}
