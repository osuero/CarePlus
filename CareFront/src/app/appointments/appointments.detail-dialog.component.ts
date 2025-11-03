import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Appointment } from './appointments.model';

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
}
