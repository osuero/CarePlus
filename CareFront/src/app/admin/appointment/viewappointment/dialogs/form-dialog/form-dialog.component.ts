import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AppointmentService } from '../../appointment.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Appointment } from '../../appointment.model';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { formatDate } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTimepickerModule } from '@angular/material/timepicker';

export interface DialogData {
  id: number;
  action: string;
  appointment: Appointment;
}

@Component({
  selector: 'app-view-appointment-form',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatDialogClose,
    MatTimepickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewAppointmentFormComponent {
  action: string;
  dialogTitle: string;
  appointmentForm: UntypedFormGroup;
  appointment: Appointment;

  constructor(
    public dialogRef: MatDialogRef<ViewAppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public appointmentService: AppointmentService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit' ? data.appointment.name : 'New Appointment';
    this.appointment =
      this.action === 'edit' ? data.appointment : new Appointment({});
    this.appointmentForm = this.createAppointmentForm();
  }

  createAppointmentForm(): UntypedFormGroup {
    const timeValue = this.appointment.startTime
      ? this.parseTimeString(this.appointment.startTime)
      : null;
    return this.fb.group({
      id: [this.appointment.id],
      img: [this.appointment.img],
      name: [this.appointment.name, [Validators.required]],
      email: [this.appointment.email, [Validators.required, Validators.email]],
      gender: [this.appointment.gender],
      date: [
        formatDate(this.appointment.date, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      startTime: [timeValue, [Validators.required]],
      mobile: [this.appointment.mobile, [Validators.required]],
      doctor: [this.appointment.doctor, [Validators.required]],
      injury: [this.appointment.injury],
      appointmentStatus: [this.appointment.appointmentStatus],
      visitType: [this.appointment.visitType],
      paymentStatus: [this.appointment.paymentStatus],
      insuranceProvider: [this.appointment.insuranceProvider],
      notes: [this.appointment.notes],
      createdAt: [this.appointment.createdAt],
      updatedAt: [this.appointment.updatedAt],
    });
  }

  getErrorMessage(control: UntypedFormControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('email')) {
      return 'Please enter a valid email';
    }
    return '';
  }

  private parseTimeString(timeString: string): Date | null {
    if (!timeString) return null;

    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  submit() {
    if (this.appointmentForm.valid) {
      const formData = this.appointmentForm.getRawValue();
      if (formData.startTime instanceof Date) {
        const hours = formData.startTime.getHours().toString().padStart(2, '0');
        const minutes = formData.startTime
          .getMinutes()
          .toString()
          .padStart(2, '0');
        formData.startTime = `${hours}:${minutes}`;
      }
      if (this.action === 'edit') {
        this.appointmentService.updateAppointment(formData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
            // Optionally display an error message to the user
          },
        });
      } else {
        this.appointmentService.addAppointment(formData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Add Error:', error);
            // Optionally display an error message to the user
          },
        });
      }
    }
  }

  onNoClick(): void {
    this.appointmentForm.reset(); // Reset the form
    this.dialogRef.close();
  }
}
