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
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.scss'],
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
  standalone: true,
})
export class EditDoctorComponent {
  docForm: UntypedFormGroup;
  formdata = {
    first: 'Pooja',
    middle: '',
    last: 'Sarma',
    gender: 'Female',
    mobile: '123456789',
    alternativeContact: '',
    password: '123',
    conformPassword: '123',
    email: 'test@example.com',
    designation: 'Sr. Doctor',
    department: '2',
    specialization: 'Spine Surgeon',
    experience: '10',
    licenseNumber: 'ELX123456',
    licenseExpiryDate: '2030-02-17T14:22:18Z',
    address: '101, Elanxa, New Yourk',
    city: '',
    state: '',
    postalCode: '',
    dob: '1987-02-17T14:22:18Z',
    bloodGroup: '',
    education: 'M.B.B.S.',
    certifications: '',
    joiningDate: '2025-03-11T14:22:18Z',
    employeeId: 'EMP123456',
    roomNumber: '',
    availableDays: ['Tuesday', 'Friday'],
    startTime: '10:30',
    endTime: '18:30',
    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyContactRelation: '',
    profilePhoto: '',
    licenseDocument: '',
    educationCertificates: '',
    additionalDocuments: '',
  };
  constructor(private fb: UntypedFormBuilder) {
    this.docForm = this.createContactForm();
  }
  onSubmit() {
    console.log('Form Value', this.docForm.value);
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      first: [
        this.formdata.first,
        [Validators.required, Validators.pattern('[a-zA-Z]+')],
      ],
      middle: [this.formdata.middle],
      last: [this.formdata.last],
      gender: [this.formdata.gender, [Validators.required]],
      dob: [this.formdata.dob, [Validators.required]],
      bloodGroup: [this.formdata.bloodGroup],
      mobile: [this.formdata.mobile, [Validators.required]],
      alternativeContact: [this.formdata.alternativeContact],
      email: [
        this.formdata.email,
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      address: [this.formdata.address],
      city: [this.formdata.city],
      state: [this.formdata.state],
      postalCode: [this.formdata.postalCode],
      password: [this.formdata.password, [Validators.required]],
      conformPassword: [this.formdata.conformPassword, [Validators.required]],
      designation: [this.formdata.designation, [Validators.required]],
      department: [this.formdata.department, [Validators.required]],
      specialization: [this.formdata.specialization, [Validators.required]],
      experience: [this.formdata.experience, [Validators.required]],
      licenseNumber: [this.formdata.licenseNumber, [Validators.required]],
      licenseExpiryDate: [
        this.formdata.licenseExpiryDate,
        [Validators.required],
      ],
      education: [this.formdata.education, [Validators.required]],
      certifications: [this.formdata.certifications],
      joiningDate: [this.formdata.joiningDate, [Validators.required]],
      employeeId: [this.formdata.employeeId, [Validators.required]],
      roomNumber: [this.formdata.roomNumber],
      availableDays: [this.formdata.availableDays, [Validators.required]],
      startTime: [this.formdata.startTime, [Validators.required]],
      endTime: [this.formdata.endTime, [Validators.required]],
      emergencyContactName: [this.formdata.emergencyContactName],
      emergencyContactNumber: [this.formdata.emergencyContactNumber],
      emergencyContactRelation: [this.formdata.emergencyContactRelation],
      profilePhoto: [this.formdata.profilePhoto],
      licenseDocument: [this.formdata.licenseDocument],
      educationCertificates: [this.formdata.educationCertificates],
      additionalDocuments: [this.formdata.additionalDocuments],
    });
  }
}
