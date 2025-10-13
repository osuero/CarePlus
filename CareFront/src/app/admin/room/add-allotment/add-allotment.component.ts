import { Component, OnInit } from '@angular/core';

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-allotment',
  templateUrl: './add-allotment.component.html',
  styleUrls: ['./add-allotment.component.scss'],
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
    MatIconModule,
    MatSnackBarModule
],
})
export class AddAllotmentComponent implements OnInit {
  roomForm!: UntypedFormGroup;
  roomTypeOptions: any[] = [
    { value: '1', viewValue: 'General' },
    { value: '2', viewValue: 'Delux' },
    { value: '3', viewValue: 'Super Delux' },
    { value: '4', viewValue: 'ICU' },
  ];
  genderOptions: any[] = [
    { value: 'Male', viewValue: 'Male' },
    { value: 'Female', viewValue: 'Female' },
    { value: 'Other', viewValue: 'Other' },
  ];
  patientStatusOptions: any[] = [
    { value: 'Admitted', viewValue: 'Admitted' },
    { value: 'Discharged', viewValue: 'Discharged' },
  ];
  isSubmitting = false;

  constructor(
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Create form
    this.createForm();

    // Set default values
    this.roomForm.patchValue({
      status: 'Admitted',
      id: this.generateUniqueId(),
      img: 'assets/images/user/user.jpg',
    });
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
   * Generate a unique ID for the room allotment
   */
  generateUniqueId(): string {
    return 'RA-' + Math.floor(100000 + Math.random() * 900000);
  }

  /**
   * Check if a form control has a specific error
   */
  hasError(controlName: string, errorName: string): boolean {
    return this.roomForm.get(controlName)?.hasError(errorName) || false;
  }

  /**
   * Handle form submission
   */
  onSubmit() {
    if (this.roomForm.invalid) {
      this.markFormGroupTouched(this.roomForm);
      return;
    }

    this.isSubmitting = true;

    // Simulate API call
    setTimeout(() => {
      console.log('Form Value', this.roomForm.value);
      this.snackBar.open('Room allotment added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      this.isSubmitting = false;
      this.router.navigate(['/admin/room/allroom']);
    }, 1000);
  }

  /**
   * Reset the form to its initial state
   */
  resetForm(): void {
    this.roomForm.reset();
    // Set default values again
    this.roomForm.patchValue({
      status: 'Admitted',
      id: this.generateUniqueId(),
      img: 'assets/images/user/user.jpg',
    });
  }

  /**
   * Mark all controls in the form group as touched to trigger validation
   */
  private markFormGroupTouched(formGroup: UntypedFormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as UntypedFormGroup);
      }
    });
  }
}
