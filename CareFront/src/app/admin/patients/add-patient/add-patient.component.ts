import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { PatientsService } from '../../../patients/patients.service';
import { RegisterPatientRequest } from '../../../patients/patients.model';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss'],
  imports: [
    BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    FileUploadComponent,
    MatButtonModule,
    MatCardModule,
    CommonModule,
  ],
})
export class AddPatientComponent {
  patientForm: UntypedFormGroup;
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  submitting = false;

  constructor(
    private fb: UntypedFormBuilder,
    private readonly patientsService: PatientsService
  ) {
    this.patientForm = this.fb.group({
      // Personal details
      first: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      last: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      gender: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      age: ['', [Validators.min(0), Validators.max(120)]],
      maritalStatus: ['', [Validators.required]],
      nationalId: ['', [Validators.required]],
      patientId: [''],

      // Contact information
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5,10}$')]],

      // Emergency contact
      emergencyContactName: ['', [Validators.required]],
      emergencyContactRelation: ['', [Validators.required]],
      emergencyContactPhone: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10,15}$')],
      ],

      // Medical details
      bGroup: ['', [Validators.required]],
      bPresure: [''],
      sugger: [''],
      allergies: [''],
      chronicDiseases: [''],
      currentMedications: [''],
      injury: [''],

      // Insurance details
      insuranceProvider: [''],
      insurancePolicyNumber: [''],
      insuranceCoverage: [''],

      // Admission details
      admissionDate: [''],
      assignedDoctor: [''],
      wardNumber: [''],
      roomNumber: [''],
      admissionReason: [''],

      uploadFile: [''],
    });
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    const payload = this.buildRegisterRequest();
    if (!payload.dateOfBirth) {
      Swal.fire(
        'Registro fallido',
        'Selecciona una fecha de nacimiento valida.',
        'error'
      );
      return;
    }

    this.submitting = true;
    this.patientsService
      .registerPatient(payload)
      .pipe(
        finalize(() => {
          this.submitting = false;
        })
      )
      .subscribe({
        next: () => {
          Swal.fire(
            'Paciente registrado',
            'El paciente fue registrado correctamente.',
            'success'
          );
          this.patientForm.reset();
        },
        error: (error: Error) => {
          const fallback =
            'No fue posible registrar el paciente. Intente nuevamente en unos segundos.';
          const message =
            typeof error.message === 'string' && error.message.trim().length > 0
              ? error.message
              : fallback;
          Swal.fire('Registro fallido', message, 'error');
        },
      });
  }

  private buildRegisterRequest(): RegisterPatientRequest {
    return {
      firstName: this.getRequiredControlValue('first'),
      lastName: this.getRequiredControlValue('last'),
      email: this.getRequiredControlValue('email').toLowerCase(),
      phoneNumber: this.getOptionalControlValue('mobile'),
      identification: this.getOptionalControlValue('nationalId'),
      country: this.getOptionalControlValue('state'),
      gender: this.getRequiredControlValue('gender'),
      dateOfBirth: this.getDateOfBirth(),
    };
  }

  private getRequiredControlValue(controlName: string): string {
    const value = this.patientForm.get(controlName)?.value;
    return value ? value.toString().trim() : '';
  }

  private getOptionalControlValue(controlName: string): string | undefined {
    const value = this.patientForm.get(controlName)?.value;
    if (value === null || value === undefined) {
      return undefined;
    }
    const normalized = value.toString().trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  private getDateOfBirth(): string {
    const rawValue = this.patientForm.get('dob')?.value;
    if (!rawValue) {
      return '';
    }

    const date = rawValue instanceof Date ? rawValue : new Date(rawValue);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return formatDate(date, 'yyyy-MM-dd', 'en');
  }
}
