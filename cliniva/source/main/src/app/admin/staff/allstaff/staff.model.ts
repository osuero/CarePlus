import { formatDate } from '@angular/common';

export class Staff {
  id: string;
  img: string;
  name: string;
  email: string;
  gender: string;
  address: string;
  mobile: string;
  designation: string;
  department: string;
  joiningDate: string;
  salary: number;
  status: string;
  shift: string;
  experienceYears: number;

  constructor(staff: Partial<Staff> = {}) {
    this.id = staff.id || this.getRandomID();
    this.img = staff.img || 'assets/images/user/new.jpg';
    this.name = staff.name || '';
    this.designation = staff.designation || '';
    this.email = staff.email || '';
    this.gender = staff.gender || '';
    this.address = staff.address || '';
    this.mobile = staff.mobile || '';
    this.department = staff.department || '';
    this.joiningDate =
      staff.joiningDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.salary = staff.salary || 0;
    this.status = staff.status || '';
    this.shift = staff.shift || '';
    this.experienceYears = staff.experienceYears || 0;
  }

  public getRandomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000).toString(16);
    };
    return S4() + S4();
  }
}
