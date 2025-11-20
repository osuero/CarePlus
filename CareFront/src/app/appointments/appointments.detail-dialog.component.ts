import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Appointment } from './appointments.model';
import { mapAppointmentStatusToTranslationKey } from './appointment-status.utils';

export interface AppointmentsDetailDialogData {
  appointment: Appointment;
}

@Component({
  selector: 'app-appointments-detail-dialog',
  standalone: true,
  templateUrl: './appointments.detail-dialog.component.html',
  styleUrls: ['./appointments.detail-dialog.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule, DatePipe],
  providers: [DatePipe],
})
export class AppointmentsDetailDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: AppointmentsDetailDialogData
  ) {}

  getStatusTranslationKey(status: Appointment['status']): string {
    return mapAppointmentStatusToTranslationKey(status);
  }

  getPatientDisplayName(appointment: Appointment): string {
    const prospectName = `${appointment.prospectFirstName ?? ''} ${appointment.prospectLastName ?? ''}`.trim();
    const name = appointment.patientName ?? (prospectName.length > 0 ? prospectName : null);
    return name && name.length > 0 ? name : '-';
  }

  getPatientContact(appointment: Appointment): string | null {
    return appointment.prospectPhoneNumber ?? appointment.patientEmail ?? appointment.prospectEmail ?? null;
  }
}
