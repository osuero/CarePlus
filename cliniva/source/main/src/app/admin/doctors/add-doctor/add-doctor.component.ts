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
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss'],
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
    MatCardModule
],
})
export class AddDoctorComponent {
  docForm: UntypedFormGroup;
  hide3 = true;
  agree3 = false;
  constructor(private fb: UntypedFormBuilder) {
    this.docForm = this.fb.group({
      // Personal Information
      first: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      middle: [''],
      last: [''],
      gender: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      bloodGroup: [''],

      // Contact Information
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      mobile: ['', [Validators.required]],
      alternativeContact: [''],
      address: [''],
      city: [''],
      state: [''],
      postalCode: [''],

      // Account Information
      password: ['', [Validators.required]],
      conformPassword: ['', [Validators.required]],

      // Professional Information
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      specialization: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      licenseNumber: ['', [Validators.required]],
      licenseExpiryDate: ['', [Validators.required]],
      education: ['', [Validators.required]],
      certifications: [''],

      // Hospital Specific Information
      joiningDate: ['', [Validators.required]],
      employeeId: ['', [Validators.required]],
      roomNumber: [''],

      // Availability Information
      availableDays: [[], [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],

      // Emergency Contact Information
      emergencyContactName: [''],
      emergencyContactNumber: [''],
      emergencyContactRelation: [''],

      // Documents
      profilePhoto: [''],
      licenseDocument: [''],
      educationCertificates: [''],
      additionalDocuments: [''],
    });
  }
  onSubmit() {
    console.log('Form Value', this.docForm.value);
  }
}
