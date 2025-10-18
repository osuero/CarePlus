import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { finalize, startWith, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { PatientsService } from './patients.service';
import {
  Country,
  DoctorSummary,
  Patient,
  RegisterPatientRequest,
} from './patients.model';
import { environment } from '../../environments/environment';

export interface PatientsEditDialogData {
  patient: Patient;
}

export interface PatientsEditDialogResult {
  patient?: Patient;
}

@Component({
  selector: 'app-patients-edit-dialog',
  standalone: true,
  templateUrl: './patients-edit-dialog.component.html',
  styleUrls: ['./patients-edit-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
  ],
})
export class PatientsEditDialogComponent implements OnInit, OnDestroy {
  readonly form: FormGroup;
  countries: Country[] = [];
  doctors: DoctorSummary[] = [];
  submitting = false;
  loadingDoctors = false;

  readonly tenants = [
    'main',
    ...(
      Array.isArray(environment.tenants) && environment.tenants.length > 0
        ? environment.tenants
        : [environment.tenantId]
    ).filter(
      (tenant): tenant is string =>
        typeof tenant === 'string' && tenant.trim().length > 0
    ),
  ].filter((tenant, index, self) => self.indexOf(tenant) === index);
  readonly defaultTenant = 'main';

  private readonly data = inject<PatientsEditDialogData>(MAT_DIALOG_DATA);
  private readonly destroy$ = new Subject<void>();
  private doctorsSubscription?: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly patientsService: PatientsService,
    private readonly translate: TranslateService,
    private readonly dialogRef: MatDialogRef<
      PatientsEditDialogComponent,
      PatientsEditDialogResult
    >
  ) {
    const patient = this.data.patient;
    this.form = this.fb.group({
      firstName: [patient.firstName, [Validators.required, Validators.maxLength(100)]],
      lastName: [patient.lastName, [Validators.required, Validators.maxLength(100)]],
      email: [patient.email, [Validators.required, Validators.email, Validators.maxLength(256)]],
      phoneNumber: [patient.phoneNumber ?? '', [Validators.maxLength(32)]],
      identification: [patient.identification ?? '', [Validators.maxLength(50)]],
      country: [patient.country ?? ''],
      gender: [patient.gender, [Validators.required, Validators.maxLength(20)]],
      dateOfBirth: [patient.dateOfBirth, [Validators.required]],
      tenantId: [
        patient.tenantId ?? this.defaultTenant,
        [Validators.required, Validators.maxLength(100)],
      ],
      assignedDoctorId: [patient.assignedDoctorId ?? ''],
    });
  }

  ngOnInit(): void {
    this.loadCountries();
    this.setupTenantWatcher();
  }

  ngOnDestroy(): void {
    this.doctorsSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildRequestPayload();
    this.submitting = true;

    this.patientsService
      .updatePatient(
        this.data.patient.id,
        payload,
        payload.tenantId ?? this.defaultTenant
      )
      .pipe(
        finalize(() => {
          this.submitting = false;
        })
      )
      .subscribe({
        next: (patient) => {
          this.dialogRef.close({ patient });
        },
        error: (error: Error) => {
          const errorTitle = this.translate.instant(
            'PATIENTS.MESSAGES.ERROR_TITLE'
          );
          const fallbackBody = this.translate.instant(
            'PATIENTS.MESSAGES.ERROR_BODY'
          );
          const body = error.message || fallbackBody;
          Swal.fire(errorTitle, body, 'error');
        },
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  getGenderLabel(key: 'MALE' | 'FEMALE' | 'OTHER'): string {
    return this.translate.instant(`PATIENTS.FORM.GENDER_OPTIONS.${key}`);
  }

  trackByCountryCode(_: number, country: Country): string {
    return country.code;
  }

  trackByDoctorId(_: number, doctor: DoctorSummary): string {
    return doctor.id;
  }

  private loadCountries(): void {
    this.patientsService.searchCountries().subscribe({
      next: (countries) => {
        this.countries = [...countries].sort((a, b) => a.name.localeCompare(b.name));
      },
      error: () => {
        const warning = this.translate.instant(
          'PATIENTS.MESSAGES.COUNTRIES_WARNING'
        );
        console.warn(warning);
      },
    });
  }

  private setupTenantWatcher(): void {
    const tenantControl = this.form.get('tenantId');
    if (!tenantControl) {
      return;
    }

    tenantControl.valueChanges
      .pipe(
        startWith(tenantControl.value ?? this.defaultTenant),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        const tenant = this.normalizeTenant(value) ?? this.defaultTenant;
        this.loadDoctors(tenant);
      });
  }

  private loadDoctors(tenantId: string): void {
    this.doctorsSubscription?.unsubscribe();
    this.loadingDoctors = true;
    this.doctorsSubscription = this.patientsService
      .searchDoctors(tenantId)
      .pipe(
        finalize(() => {
          this.loadingDoctors = false;
        })
      )
      .subscribe({
        next: (doctors) => {
          this.doctors = doctors;
          const currentDoctorId = this.normalizeDoctorId(
            this.form.get('assignedDoctorId')?.value
          );

          if (currentDoctorId) {
            const exists = doctors.some((doctor) => doctor.id === currentDoctorId);
            if (!exists) {
              this.form.get('assignedDoctorId')?.setValue('');
            }
          }
        },
        error: () => {
          this.doctors = [];
        },
      });
  }

  private buildRequestPayload(): RegisterPatientRequest {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      identification,
      country,
      gender,
      dateOfBirth,
      tenantId,
      assignedDoctorId,
    } = this.form.value;

    const selectedTenant = (tenantId ?? '').toString().trim() || this.defaultTenant;
    const doctorId = this.normalizeDoctorId(assignedDoctorId);

    return {
      firstName: (firstName ?? '').trim(),
      lastName: (lastName ?? '').trim(),
      email: (email ?? '').trim().toLowerCase(),
      phoneNumber: phoneNumber?.toString().trim() || undefined,
      identification: identification?.toString().trim() || undefined,
      country: country?.toString().trim() || undefined,
      gender: (gender ?? '').trim(),
      dateOfBirth: (dateOfBirth ?? '').toString(),
      tenantId: selectedTenant,
      assignedDoctorId: doctorId,
    };
  }

  private normalizeTenant(value: unknown): string | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  private normalizeDoctorId(value: unknown): string | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }
}
