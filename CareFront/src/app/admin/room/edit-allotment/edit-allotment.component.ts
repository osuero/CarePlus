import { Component, OnInit } from '@angular/core';

import {
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-allotment',
  templateUrl: './edit-allotment.component.html',
  styleUrls: ['./edit-allotment.component.scss'],
  imports: [
    BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule
],
})
export class EditAllotmentComponent implements OnInit {
  roomForm!: UntypedFormGroup;
  isSubmitting = false;
  roomTypeOptions: { value: string; viewValue: string }[] = [
    { value: '1', viewValue: 'General' },
    { value: '2', viewValue: 'Delux' },
    { value: '3', viewValue: 'Super Delux' },
    { value: '4', viewValue: 'ICU' },
  ];
  genderOptions: { value: string; viewValue: string }[] = [
    { value: 'Male', viewValue: 'Male' },
    { value: 'Female', viewValue: 'Female' },
    { value: 'Other', viewValue: 'Other' },
  ];
  patientStatusOptions: { value: string; viewValue: string }[] = [
    { value: 'Admitted', viewValue: 'Admitted' },
    { value: 'Discharged', viewValue: 'Discharged' },
  ];

  formdata = {
    id: 'XYZ123', // Random ID for the room
    img: 'https://randomuser.me/api/portraits/men/32.jpg', // Random image URL
    patientName: 'John Doe', // Random patient name
    patientId: 'P-XYZ123', // Patient ID
    roomNo: '105', // Room number
    roomType: '2', // Room type (1: General, 2: Delux, etc.)
    gender: 'Male', // Patient gender
    admitDate: '2023-02-17T14:22:18Z', // Random admission date
    dischargeDate: '2023-02-19T14:22:18Z', // Random discharge date
    doctorAssigned: 'Dr. Smith', // Random doctor name
    status: 'Admitted', // Status of the patient (Admitted/Discharged)
    amountCharged: 2000.5, // Amount charged for the room
    age: 45, // Patient's age
    mobile: '9876543210', // Random mobile number (10 digits)
    email: 'john.doe@example.com', // Random email address
    emergencyContact: '', // Emergency contact
    medicalHistory: '', // Medical history
    allergies: '', // Allergies
    notes: '', // Additional notes
  };

  constructor(private fb: UntypedFormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit() {
    // Create form
    this.createForm();

    // Patch form with existing data
    this.roomForm.patchValue(this.formdata);
  }

  /**
   * Create the allotment form
   */
  createForm() {
    this.roomForm = this.fb.group({
      id: ['', [Validators.required]],
      img: ['', [Validators.required]],
      patientName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      roomNo: ['', [Validators.required]],
      roomType: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      admitDate: ['', [Validators.required]],
      dischargeDate: ['', [Validators.required]],
      doctorAssigned: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      status: ['', [Validators.required]],
      amountCharged: ['', [Validators.required, Validators.min(0)]],
      age: ['', [Validators.required, Validators.min(0), Validators.max(120)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      patientId: ['', [Validators.required]],
      medicalHistory: [''],
      allergies: [''],
      emergencyContact: ['', [Validators.pattern('^[0-9]{10}$')]],
      notes: [''],
    });
  }

  /**
   * Check if a form control has a specific error
   */
  hasError(controlName: string, errorName: string): boolean {
    const control = this.roomForm.get(controlName);
    return control
      ? control.hasError(errorName) && (control.dirty || control.touched)
      : false;
  }

  /**
   * Handle form submission
   */
  onSubmit() {
    if (this.roomForm.valid) {
      this.isSubmitting = true;
      this.markFormGroupTouched(this.roomForm);

      // Simulate API call
      setTimeout(() => {
        console.log('Form Value', this.roomForm.value);
        this.snackBar.open('Room allotment updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: 'success-snackbar',
        });
        this.isSubmitting = false;
      }, 1000);
    } else {
      this.markFormGroupTouched(this.roomForm);
      this.snackBar.open('Please fix the errors in the form', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: 'error-snackbar',
      });
    }
  }

  /**
   * Reset form to initial values
   */

  resetForm(): void {
    this.roomForm.reset();
    // Set default values again
  }

  /**
   * Mark all controls in a form group as touched
   */
  markFormGroupTouched(formGroup: UntypedFormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as UntypedFormGroup);
      }
    });
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.formdata.id, [Validators.required]], // Random ID for the room
      img: [this.formdata.img, [Validators.required]], // Image URL for the room
      patientName: [this.formdata.patientName, [Validators.required]], // Patient's name
      patientId: [this.formdata.patientId, [Validators.required]], // Patient ID
      roomNo: [this.formdata.roomNo, [Validators.required]], // Room number
      roomType: [this.formdata.roomType, [Validators.required]], // Room type (General, Delux, etc.)
      gender: [this.formdata.gender, [Validators.required]], // Gender of the patient
      admitDate: [this.formdata.admitDate, [Validators.required]], // Admission date
      dischargeDate: [this.formdata.dischargeDate, [Validators.required]], // Discharge date
      doctorAssigned: [this.formdata.doctorAssigned, [Validators.required]], // Doctor assigned to the patient
      status: [this.formdata.status, [Validators.required]], // Patient status (Admitted/Discharged)
      amountCharged: [
        this.formdata.amountCharged,
        [Validators.required, Validators.min(0)],
      ], // Amount charged
      age: [this.formdata.age, [Validators.required, Validators.min(0)]], // Patient's age
      mobile: [
        this.formdata.mobile,
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ], // Mobile number
      email: [this.formdata.email, [Validators.required, Validators.email]], // Email address
      emergencyContact: [this.formdata.emergencyContact], // Emergency contact
      medicalHistory: [this.formdata.medicalHistory], // Medical history
      allergies: [this.formdata.allergies], // Allergies
      notes: [this.formdata.notes], // Additional notes
    });
  }
}
