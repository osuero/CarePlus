import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AppointmentsService } from '../appointments.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { Appointments } from '../appointments.model';
import { formatDate, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  action: string;
  appointments: Appointments;
}

@Component({
    selector: 'app-doctor-appointment-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    imports: [
        MatButtonModule,
        MatIconModule,
        MatDialogContent,
        MatCardModule,
        MatTooltipModule,
        DatePipe,
    ]
})
export class DoctorAppointmentFormComponent {
  action: string;
  dialogTitle: string;
  isDetails = false;
  appointmentsForm?: UntypedFormGroup;
  appointments: Appointments;

  constructor(
    public dialogRef: MatDialogRef<DoctorAppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public appointmentsService: AppointmentsService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.dialogTitle =
      this.action === 'details' ? 'Appointment Details' : 'New Appointment';

    this.isDetails = this.action === 'details';
    this.appointments = this.isDetails
      ? data.appointments
      : new Appointments({} as Appointments);

    if (!this.isDetails) {
      this.appointmentsForm = this.createAppointmentForm();
    }
  }

  formControl = new UntypedFormControl('', [Validators.required]);

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  createAppointmentForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.appointments.id],
      img: [this.appointments.img],
      patientName: [this.appointments.patientName, [Validators.required]],
      email: [
        this.appointments.email,
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      appointmentDate: [
        formatDate(
          this.appointments.appointmentDate,
          'yyyy-MM-dd, HH:mm',
          'en'
        ),
        [Validators.required],
      ],
      status: [this.appointments.status],
      address: [this.appointments.address],
      mobile: [this.appointments.mobile, [Validators.required]],
      disease: [this.appointments.disease],
      lastVisitDate: [
        formatDate(this.appointments.lastVisitDate, 'yyyy-MM-dd, HH:mm', 'en'),
        [Validators.required],
      ],
    });
  }

  submit() {
    if (this.appointmentsForm?.valid) {
      if (this.action === 'edit') {
        this.appointmentsService.updateAppointments(
          this.appointmentsForm.getRawValue()
        );
      } else {
        this.appointmentsService.addAppointments(
          this.appointmentsForm.getRawValue()
        );
      }
      this.dialogRef.close(this.appointmentsForm.getRawValue());
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
