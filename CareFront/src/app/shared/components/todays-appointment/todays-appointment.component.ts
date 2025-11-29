import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Appointment } from '../../../appointments/appointments.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { NgScrollbar } from 'ngx-scrollbar';

export interface Patient {
  image: string;
  name: string;
  gender: string;
  lastVisit: string;
  disease: string;
  diseaseClass: string;
}

@Component({
  selector: 'app-todays-appointment',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    NgScrollbar,
    CommonModule,
  ],
  templateUrl: './todays-appointment.component.html',
  styleUrl: './todays-appointment.component.scss',
})
export class TodaysAppointmentComponent {
  displayedColumns: string[] = [
    'patientName',
    'gender',
    'lastVisit',
    'diseases',
    'report',
    'details',
  ];

  @Input() appointments: Appointment[] = [];

  get patientDataSource(): Patient[] {
    return this.appointments.map((appt) => ({
      image: 'assets/images/user/default.jpg',
      name:
        appt.patientName ??
        ((`${appt.prospectFirstName ?? ''} ${appt.prospectLastName ?? ''}`.trim()) ||
          'Paciente'),
      gender: 'N/A',
      lastVisit: new Date(appt.startsAtUtc).toLocaleString(),
      disease: appt.title,
      diseaseClass: 'badge col-blue',
    }));
  }
}
