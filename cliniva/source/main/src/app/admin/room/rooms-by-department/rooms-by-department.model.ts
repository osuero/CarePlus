import { formatDate } from '@angular/common';

export class RoomsByDepartment {
  room_id: string;
  room_number: string;
  department_name: string;
  room_type: string;
  floor: number;
  bed_capacity: number;
  occupied_beds: number;
  room_status: string;
  assigned_staff: string;
  patient_id: string;
  room_features: string;
  admission_date: string;
  discharge_date: string;
  room_rate: number;
  last_cleaned: string;
  room_category: string;

  constructor(roomsByDepartment: RoomsByDepartment) {
    this.room_id = roomsByDepartment.room_id || this.getRandomRoomID();
    this.room_number = roomsByDepartment.room_number || '';
    this.department_name = roomsByDepartment.department_name || '';
    this.room_type = roomsByDepartment.room_type || '';
    this.floor = roomsByDepartment.floor || 1;
    this.bed_capacity = roomsByDepartment.bed_capacity || 1;
    this.occupied_beds = roomsByDepartment.occupied_beds || 0;
    this.room_status = roomsByDepartment.room_status || 'Available';
    this.assigned_staff = roomsByDepartment.assigned_staff || '';
    this.patient_id = roomsByDepartment.patient_id;
    this.room_features = roomsByDepartment.room_features || '';
    this.admission_date =
      roomsByDepartment.admission_date ||
      formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.discharge_date =
      roomsByDepartment.discharge_date ||
      formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.room_rate = roomsByDepartment.room_rate || 1000;
    this.last_cleaned =
      roomsByDepartment.last_cleaned ||
      formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.room_category = roomsByDepartment.room_category || '';
  }

  public getRandomRoomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return 'R' + S4().toString(16).substr(1);
  }
}
