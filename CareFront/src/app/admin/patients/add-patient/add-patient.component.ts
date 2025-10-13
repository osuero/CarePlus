import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';

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
  ],
})
export class AddPatientComponent {
  patientForm: UntypedFormGroup;
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(private fb: UntypedFormBuilder) {
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
  onSubmit() {
    console.log('Form Value', this.patientForm.value);
  }
}
