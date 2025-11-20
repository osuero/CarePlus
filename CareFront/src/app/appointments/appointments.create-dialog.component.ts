import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import {
  Appointment,
  AppointmentMetadata,
  AppointmentParticipant,
  SaveAppointmentRequest,
} from './appointments.model';
import { AppointmentsService } from './appointments.service';

export interface AppointmentsCreateDialogData {
  appointment?: Appointment;
  tenantId?: string | null;
}

export interface AppointmentsCreateDialogResult {
  appointment?: Appointment;
}

@Component({
  selector: 'app-appointments-create-dialog',
  standalone: true,
  templateUrl: './appointments.create-dialog.component.html',
  styleUrls: ['./appointments.create-dialog.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class AppointmentsCreateDialogComponent implements OnInit, OnDestroy {
  readonly form: FormGroup;
  readonly isEditMode: boolean;
  readonly loadingMetadata = signal(true);
  readonly saving = signal(false);
  metadata: AppointmentMetadata | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialogRef: MatDialogRef<
      AppointmentsCreateDialogComponent,
      AppointmentsCreateDialogResult
    >,
    @Inject(MAT_DIALOG_DATA) public readonly data: AppointmentsCreateDialogData,
    private readonly fb: FormBuilder,
    private readonly appointmentsService: AppointmentsService,
    private readonly translate: TranslateService
  ) {
    this.isEditMode = !!data.appointment;
    this.form = this.buildForm(data.appointment);
  }

  ngOnInit(): void {
    const tenantId = this.data.tenantId;
    this.loadingMetadata.set(true);

    this.form
      .get('patientId')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateProspectValidators());
    this.updateProspectValidators();

    this.appointmentsService
      .getMetadata(tenantId ?? undefined)
      .pipe(finalize(() => this.loadingMetadata.set(false)), takeUntil(this.destroy$))
      .subscribe({
        next: (metadata) => {
          this.metadata = metadata;
          if (!this.isEditMode) {
            this.prefillDefaults(metadata);
          }
        },
        error: (error: Error) => this.handleError(error),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    if (!value.patientId && !this.ensureProspectInfo()) {
      this.form.markAllAsTouched();
      return;
    }

    const startsAtUtc = this.combineDateAndTime(value.startsAtDate, value.startsAtTime);
    const endsAtUtc = this.combineDateAndTime(value.endsAtDate, value.endsAtTime);

    if (!startsAtUtc || !endsAtUtc) {
      this.form.markAllAsTouched();
      return;
    }

    const request: SaveAppointmentRequest = {
      tenantId: this.data.tenantId,
      patientId: value.patientId || null,
      doctorId: value.doctorId || null,
      prospectFirstName: value.prospectFirstName?.trim() || null,
      prospectLastName: value.prospectLastName?.trim() || null,
      prospectPhoneNumber: value.prospectPhoneNumber?.trim() || null,
      prospectEmail: value.prospectEmail?.trim() || null,
      title: value.title.trim(),
      description: value.description?.trim() || null,
      location: value.location?.trim() || null,
      startsAtUtc,
      endsAtUtc,
      status: value.status,
      notes: value.notes?.trim() || null,
    };

    this.saving.set(true);

    const request$ = this.isEditMode
      ? this.appointmentsService.updateAppointment(this.data.appointment!.id, request, this.data.tenantId ?? undefined)
      : this.appointmentsService.createAppointment(request, this.data.tenantId ?? undefined);

    request$
      .pipe(finalize(() => this.saving.set(false)), takeUntil(this.destroy$))
      .subscribe({
        next: (appointment) => {
          this.dialogRef.close({ appointment });
        },
        error: (error: Error) => this.handleError(error),
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  clearPatientSelection(): void {
    this.form.patchValue({ patientId: null });
  }

  trackParticipantById(_: number, participant: AppointmentParticipant): string {
    return participant.id;
  }

  private buildForm(appointment?: Appointment): FormGroup {
    const startsAtDate = appointment ? this.toLocalDate(appointment.startsAtUtc) : null;
    const startsAtTime = appointment ? this.toTimeString(appointment.startsAtUtc) : '';
    const endsAtDate = appointment ? this.toLocalDate(appointment.endsAtUtc) : null;
    const endsAtTime = appointment ? this.toTimeString(appointment.endsAtUtc) : '';

    return this.fb.group({
      patientId: [appointment?.patientId ?? null],
      doctorId: [appointment?.doctorId ?? null],
      title: [appointment?.title ?? '', [Validators.required, Validators.maxLength(200)]],
      description: [appointment?.description ?? '', [Validators.maxLength(1000)]],
      location: [appointment?.location ?? '', [Validators.maxLength(200)]],
      prospectFirstName: [appointment?.prospectFirstName ?? '', [Validators.maxLength(100)]],
      prospectLastName: [appointment?.prospectLastName ?? '', [Validators.maxLength(100)]],
      prospectPhoneNumber: [appointment?.prospectPhoneNumber ?? '', [Validators.maxLength(50)]],
      prospectEmail: [appointment?.prospectEmail ?? '', [Validators.email, Validators.maxLength(150)]],
      startsAtDate: [startsAtDate, [Validators.required]],
      startsAtTime: [startsAtTime, [Validators.required]],
      endsAtDate: [endsAtDate, [Validators.required]],
      endsAtTime: [endsAtTime, [Validators.required]],
      status: [appointment?.status ?? 'Scheduled', [Validators.required]],
      notes: [appointment?.notes ?? '', [Validators.maxLength(2000)]],
    });
  }

  private prefillDefaults(metadata: AppointmentMetadata): void {
    if (!this.form.value.doctorId && metadata.doctors.length > 0) {
      this.form.patchValue({ doctorId: metadata.doctors[0].id });
    }
  }

  private combineDateAndTime(date: Date | null, time: string | null): string | null {
    if (!date || !time) {
      return null;
    }

    const [hoursStr, minutesStr] = time.split(':');
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }

    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined.toISOString();
  }

  private toLocalDate(value: string): Date {
    const date = new Date(value);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private toTimeString(value: string): string {
    const date = new Date(value);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private updateProspectValidators(): void {
    const patientId = this.form.get('patientId')?.value;
    const firstName = this.form.get('prospectFirstName');
    const lastName = this.form.get('prospectLastName');
    const phone = this.form.get('prospectPhoneNumber');

    if (!firstName || !lastName || !phone) {
      return;
    }

    const firstValidators = patientId
      ? [Validators.maxLength(100)]
      : [Validators.required, Validators.maxLength(100)];
    const lastValidators = patientId
      ? [Validators.maxLength(100)]
      : [Validators.required, Validators.maxLength(100)];
    const phoneValidators = patientId
      ? [Validators.maxLength(50)]
      : [Validators.required, Validators.maxLength(50)];

    firstName.setValidators(firstValidators);
    lastName.setValidators(lastValidators);
    phone.setValidators(phoneValidators);

    firstName.updateValueAndValidity({ emitEvent: false });
    lastName.updateValueAndValidity({ emitEvent: false });
    phone.updateValueAndValidity({ emitEvent: false });
  }

  private ensureProspectInfo(): boolean {
    if (this.form.get('patientId')?.value) {
      return true;
    }

    const firstNameControl = this.form.get('prospectFirstName');
    const lastNameControl = this.form.get('prospectLastName');
    const phoneControl = this.form.get('prospectPhoneNumber');

    const firstNameValid = !!firstNameControl?.value?.trim();
    const lastNameValid = !!lastNameControl?.value?.trim();
    const phoneValid = !!phoneControl?.value?.trim();

    if (!firstNameValid) {
      firstNameControl?.setErrors({ required: true });
    }
    if (!lastNameValid) {
      lastNameControl?.setErrors({ required: true });
    }
    if (!phoneValid) {
      phoneControl?.setErrors({ required: true });
    }

    return firstNameValid && lastNameValid && phoneValid;
  }

  private handleError(error: Error): void {
    const title = this.translate.instant('APPOINTMENTS.MESSAGES.ERROR_TITLE');
    const fallback = this.translate.instant('APPOINTMENTS.MESSAGES.ERROR_BODY');
    Swal.fire(title, error.message || fallback, 'error');
  }
}
