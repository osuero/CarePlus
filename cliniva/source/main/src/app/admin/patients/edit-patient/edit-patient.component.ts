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
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.scss'],
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
export class EditPatientComponent {
  patientForm: UntypedFormGroup;
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  formdata = {
    // Personal details
    first: 'Pooja',
    last: 'Sarma',
    gender: 'Female',
    dob: '1987-02-17T14:22:18Z',
    age: '23',
    maritalStatus: '1',
    nationalId: 'ID12345678',
    patientId: 'PAT00123',

    // Contact information
    mobile: '1234567890',
    email: 'test@example.com',
    address: '101, Elanxa, New Yourk',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',

    // Emergency contact
    emergencyContactName: 'Raj Sarma',
    emergencyContactRelation: 'Husband',
    emergencyContactPhone: '9876543210',

    // Medical details
    bGroup: 'O+',
    bPresure: '123',
    sugger: '150',
    allergies: 'Penicillin',
    chronicDiseases: 'Hypertension',
    currentMedications: 'Lisinopril 10mg',
    injury: 'Fever',

    // Insurance details
    insuranceProvider: 'Health Plus',
    insurancePolicyNumber: 'HP123456',
    insuranceCoverage: 'Full Coverage',

    // Admission details
    admissionDate: '2023-05-10T10:00:00Z',
    assignedDoctor: 'Dr. John Smith',
    wardNumber: 'W-101',
    roomNumber: 'R-202',
    admissionReason: 'Fever and weakness',

    uploadFile: '',
  };
  constructor(private fb: UntypedFormBuilder) {
    this.patientForm = this.createContactForm();
  }
  onSubmit() {
    console.log('Form Value', this.patientForm.value);
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      // Personal details
      first: [
        this.formdata.first,
        [Validators.required, Validators.pattern('[a-zA-Z]+')],
      ],
      last: [
        this.formdata.last,
        [Validators.required, Validators.pattern('[a-zA-Z]+')],
      ],
      gender: [this.formdata.gender, [Validators.required]],
      dob: [this.formdata.dob, [Validators.required]],
      age: [this.formdata.age, [Validators.min(0), Validators.max(120)]],
      maritalStatus: [this.formdata.maritalStatus, [Validators.required]],
      nationalId: [this.formdata.nationalId, [Validators.required]],
      patientId: [this.formdata.patientId],

      // Contact information
      mobile: [
        this.formdata.mobile,
        [Validators.required, Validators.pattern('^[0-9]{10,15}$')],
      ],
      email: [
        this.formdata.email,
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      address: [this.formdata.address, [Validators.required]],
      city: [this.formdata.city, [Validators.required]],
      state: [this.formdata.state, [Validators.required]],
      zipCode: [
        this.formdata.zipCode,
        [Validators.required, Validators.pattern('^[0-9]{5,10}$')],
      ],

      // Emergency contact
      emergencyContactName: [
        this.formdata.emergencyContactName,
        [Validators.required],
      ],
      emergencyContactRelation: [
        this.formdata.emergencyContactRelation,
        [Validators.required],
      ],
      emergencyContactPhone: [
        this.formdata.emergencyContactPhone,
        [Validators.required, Validators.pattern('^[0-9]{10,15}$')],
      ],

      // Medical details
      bGroup: [this.formdata.bGroup, [Validators.required]],
      bPresure: [this.formdata.bPresure],
      sugger: [this.formdata.sugger],
      allergies: [this.formdata.allergies],
      chronicDiseases: [this.formdata.chronicDiseases],
      currentMedications: [this.formdata.currentMedications],
      injury: [this.formdata.injury],

      // Insurance details
      insuranceProvider: [this.formdata.insuranceProvider],
      insurancePolicyNumber: [this.formdata.insurancePolicyNumber],
      insuranceCoverage: [this.formdata.insuranceCoverage],

      // Admission details
      admissionDate: [this.formdata.admissionDate],
      assignedDoctor: [this.formdata.assignedDoctor],
      wardNumber: [this.formdata.wardNumber],
      roomNumber: [this.formdata.roomNumber],
      admissionReason: [this.formdata.admissionReason],

      uploadFile: [this.formdata.uploadFile],
    });
  }
}
