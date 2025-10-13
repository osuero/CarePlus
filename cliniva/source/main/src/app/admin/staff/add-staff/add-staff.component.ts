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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';


// Password match validator function
export function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('conformPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
}
@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss'],
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
    MatCheckboxModule,
    MatRadioModule,
    MatStepperModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatCardModule
],
})
export class AddStaffComponent {
  staffForm: UntypedFormGroup;
  hide3 = true;
  agree3 = false;
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  shiftTypes = ['Morning', 'Afternoon', 'Evening', 'Night', 'Rotating'];
  employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Intern',
  ];

  constructor(private fb: UntypedFormBuilder) {
    this.staffForm = this.fb.group(
      {
        // Personal Information
        first: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        last: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        gender: ['', [Validators.required]],
        dob: ['', [Validators.required]],
        bloodGroup: [''],
        maritalStatus: [''],
        nationality: [''],

        // Contact Information
        email: [
          '',
          [Validators.required, Validators.email, Validators.minLength(5)],
        ],
        mobile: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{10,15}$')],
        ],
        emergencyContactName: [''],
        emergencyContactNumber: ['', [Validators.pattern('^[0-9]{10,15}$')]],
        address: ['', [Validators.required]],
        city: [''],
        state: [''],
        postalCode: ['', [Validators.pattern('^[0-9]{5,10}$')]],
        country: [''],

        // Professional Information
        staffId: ['', [Validators.required]],
        joinDate: [''],
        designation: ['', [Validators.required]],
        department: ['', [Validators.required]],
        specialization: [''],
        experience: [''],
        employmentType: [''],
        shift: [''],

        // Qualifications & Certifications
        education: ['', [Validators.required]],
        certifications: [''],
        licenses: [''],
        licenseExpiryDate: [''],

        // Account Information
        username: ['', [Validators.required, Validators.minLength(5)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        conformPassword: ['', [Validators.required]],

        // Additional Information
        bio: [''],
        skills: [''],
        uploadFile: [''],
        agreeToc: [false, [Validators.requiredTrue]],
      },
      {
        validators: passwordMatchValidator,
      }
    );
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

  onSubmit() {
    if (this.staffForm.valid) {
      console.log('Form Value', this.staffForm.value);
      // Here you would typically send the data to your backend service
    } else {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.staffForm);
    }
  }
}
