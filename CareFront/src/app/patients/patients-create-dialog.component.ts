import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { PatientsService } from './patients.service';
import { Country, Patient, RegisterPatientRequest } from './patients.model';
import { environment } from '../../environments/environment';

export interface PatientsCreateDialogResult {
  patient?: Patient;
}

@Component({
  selector: 'app-patients-create-dialog',
  standalone: true,
  templateUrl: './patients-create-dialog.component.html',
  styleUrls: ['./patients-create-dialog.component.scss'],
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
export class PatientsCreateDialogComponent implements OnInit, OnDestroy {
  readonly form: FormGroup;

  countries: Country[] = [];
  submitting = false;

  readonly tenants: string[];
  readonly defaultTenant: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly patientsService: PatientsService,
    private readonly translate: TranslateService,
    private readonly dialogRef: MatDialogRef<
      PatientsCreateDialogComponent,
      PatientsCreateDialogResult
    >
  ) {
    const normalizedDefaultTenant =
      this.normalizeTenant(environment.tenantId) ?? 'default';

    const tenantCandidates = Array.isArray(environment.tenants)
      ? environment.tenants
      : [environment.tenantId];

    const normalizedTenants = [
      normalizedDefaultTenant,
      ...tenantCandidates
        .map((tenant) => this.normalizeTenant(tenant))
        .filter((tenant): tenant is string => !!tenant),
    ].filter((tenant, index, self) => self.indexOf(tenant) === index);

    this.defaultTenant = normalizedDefaultTenant;
    this.tenants = normalizedTenants;

    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(32)]],
      identification: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', [Validators.required]],
      gender: ['', [Validators.required, Validators.maxLength(20)]],
      dateOfBirth: ['', [Validators.required]],
      tenantId: [
        this.defaultTenant,
        [Validators.required, Validators.maxLength(100)],
      ],
    });
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  ngOnDestroy(): void {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildRequestPayload();
    this.submitting = true;

    this.patientsService
      .registerPatient(payload, payload.tenantId ?? this.defaultTenant)
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

  private loadCountries(): void {
    this.patientsService.searchCountries().subscribe({
      next: (countries) => {
        this.countries = [...countries].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      },
      error: () => {
        const warning = this.translate.instant(
          'PATIENTS.MESSAGES.COUNTRIES_WARNING'
        );
        console.warn(warning);
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
    } = this.form.value;

    const selectedTenant = this.normalizeTenant(tenantId) ?? this.defaultTenant;

    return {
      firstName: (firstName ?? '').trim(),
      lastName: (lastName ?? '').trim(),
      email: (email ?? '').trim().toLowerCase(),
      phoneNumber: (phoneNumber ?? '').toString().trim(),
      identification: (identification ?? '').toString().trim(),
      country: (country ?? '').toString().trim(),
      gender: (gender ?? '').trim(),
      dateOfBirth: (dateOfBirth ?? '').toString(),
      tenantId: selectedTenant,
    };
  }

  private normalizeTenant(value: unknown): string | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }
}
