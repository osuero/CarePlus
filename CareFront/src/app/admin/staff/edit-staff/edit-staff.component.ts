import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { passwordMatchValidator } from '../../staff/add-staff/add-staff.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-edit-staff',
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.scss'],
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
    MatStepperModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule
],
})
export class EditStaffComponent {
  staffForm: UntypedFormGroup;
  hide3 = true; // For password visibility toggle

  // Arrays for dropdown options
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  shiftTypes = ['Morning', 'Afternoon', 'Evening', 'Night', 'Rotating'];
  employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Internship',
  ];

  // Sample data for edit form
  formdata = {
    // Personal Information
    first: 'Pooja',
    last: 'Sarma',
    gender: 'Female',
    dob: '1987-02-17T14:22:18Z',
    bloodGroup: 'B+',
    maritalStatus: 'Single',
    nationality: 'Indian',

    // Contact Information
    email: 'test@example.com',
    mobile: '1234567890',
    emergencyContactName: 'Raj Sarma',
    emergencyContactNumber: '8765432109',
    address: '101, Elanxa, New Yourk',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'USA',

    // Professional Information
    staffId: 'DOC-2023-001',
    joinDate: new Date(2020, 5, 10),
    designation: 'Sr. Doctor',
    department: '2',
    specialization: 'Orthopedics',
    experience: '8',
    employmentType: 'Full-time',
    shift: 'Morning',

    // Qualifications & Certifications
    education: 'M.B.B.S.',
    certifications: 'Board Certified in Orthopedic Surgery',
    licenses: 'Medical License #12345',
    licenseExpiryDate: new Date(2025, 11, 31),
    skills: 'Joint replacement, Sports medicine, Trauma care',

    // Account Information
    username: 'pooja.sarma',
    password: '123456',
    conformPassword: '123456',
    uploadFile: '',
    bio: 'Experienced orthopedic surgeon with special interest in sports injuries and joint replacements.',
    agreeToc: true,
  };

  constructor(private fb: UntypedFormBuilder) {
    this.staffForm = this.createContactForm();
  }

  onSubmit() {
    if (this.staffForm.valid) {
      console.log('Form Value', this.staffForm.value);
    } else {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.staffForm);
    }
  }

  // Helper method to mark all controls as touched
  markFormGroupTouched(formGroup: UntypedFormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if ((control as UntypedFormGroup).controls) {
        this.markFormGroupTouched(control as UntypedFormGroup);
      }
    });
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group(
      {
        // Personal Information
        first: [
          this.formdata.first,
          [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
        ],
        last: [
          this.formdata.last,
          [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
        ],
        gender: [this.formdata.gender, [Validators.required]],
        dob: [this.formdata.dob, [Validators.required]],
        bloodGroup: [this.formdata.bloodGroup],
        maritalStatus: [this.formdata.maritalStatus],
        nationality: [this.formdata.nationality],

        // Contact Information
        email: [this.formdata.email, [Validators.required, Validators.email]],
        mobile: [
          this.formdata.mobile,
          [Validators.required, Validators.pattern('^[0-9]{10,15}$')],
        ],
        emergencyContactName: [this.formdata.emergencyContactName],
        emergencyContactNumber: [
          this.formdata.emergencyContactNumber,
          [Validators.pattern('^[0-9]{10,15}$')],
        ],
        address: [this.formdata.address, [Validators.required]],
        city: [this.formdata.city],
        state: [this.formdata.state],
        postalCode: [
          this.formdata.postalCode,
          [Validators.pattern('^[0-9]{5,10}$')],
        ],
        country: [this.formdata.country],

        // Professional Information
        staffId: [this.formdata.staffId, [Validators.required]],
        joinDate: [this.formdata.joinDate],
        designation: [this.formdata.designation, [Validators.required]],
        department: [this.formdata.department, [Validators.required]],
        specialization: [this.formdata.specialization],
        experience: [this.formdata.experience],
        employmentType: [this.formdata.employmentType],
        shift: [this.formdata.shift],

        // Qualifications & Certifications
        education: [this.formdata.education, [Validators.required]],
        certifications: [this.formdata.certifications],
        licenses: [this.formdata.licenses],
        licenseExpiryDate: [this.formdata.licenseExpiryDate],
        skills: [this.formdata.skills],

        // Account Information
        username: [
          this.formdata.username,
          [Validators.required, Validators.minLength(5)],
        ],
        password: [
          this.formdata.password,
          [Validators.required, Validators.minLength(6)],
        ],
        conformPassword: [this.formdata.conformPassword, [Validators.required]],
        uploadFile: [this.formdata.uploadFile],
        bio: [this.formdata.bio],
        agreeToc: [this.formdata.agreeToc, [Validators.requiredTrue]],
      },
      { validators: passwordMatchValidator }
    );
  }
}
