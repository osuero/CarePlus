import { formatDate } from '@angular/common';

export class AssignDepartment {
  doctorId: string;
  img: string;
  doctorName: string;
  department: string;
  specialty: string;
  assignedDate: string;
  currentAssignmentStatus: string;
  shiftSchedule: string;
  experienceLevel: string;

  constructor(assignDepartment: Partial<AssignDepartment> = {}) {
    this.doctorId = assignDepartment.doctorId || this.getRandomID();
    this.img = assignDepartment.img || 'assets/images/user/new.jpg';
    this.doctorName = assignDepartment.doctorName || '';
    this.department = assignDepartment.department || '';
    this.specialty = assignDepartment.specialty || '';
    this.assignedDate =
      assignDepartment.assignedDate ||
      formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.currentAssignmentStatus =
      assignDepartment.currentAssignmentStatus || '';
    this.shiftSchedule = assignDepartment.shiftSchedule || '';
    this.experienceLevel = assignDepartment.experienceLevel || '';
  }

  public getRandomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000).toString(16);
    };
    return S4() + S4();
  }
}
