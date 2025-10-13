import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-add-room',
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
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss'],
})
export class AddRoomComponent implements OnInit {
  roomForm!: UntypedFormGroup;
  isSubmitting = false;
  roomTypeOptions: { value: string; viewValue: string }[] = [
    { value: 'general', viewValue: 'General' },
    { value: 'ac', viewValue: 'AC' },
    { value: 'non-ac', viewValue: 'Non-AC' },
    { value: 'icu', viewValue: 'ICU' },
    { value: 'emergency', viewValue: 'Emergency' },
  ];
  roomCategoryOptions: { value: string; viewValue: string }[] = [
    { value: 'standard', viewValue: 'Standard' },
    { value: 'deluxe', viewValue: 'Deluxe' },
    { value: 'super-deluxe', viewValue: 'Super Deluxe' },
    { value: 'suite', viewValue: 'Suite' },
  ];
  roomStatusOptions: { value: string; viewValue: string }[] = [
    { value: 'available', viewValue: 'Available' },
    { value: 'occupied', viewValue: 'Occupied' },
    { value: 'under-maintenance', viewValue: 'Under Maintenance' },
    { value: 'reserved', viewValue: 'Reserved' },
  ];

  constructor(private fb: UntypedFormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.roomForm = this.fb.group({
      roomNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{3,4}$')],
      ],
      departmentName: ['', [Validators.required]],
      roomType: ['', [Validators.required]],
      floor: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
      bedCapacity: [
        '',
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
      roomStatus: ['available', [Validators.required]],
      roomCategory: ['', [Validators.required]],
      assignedStaff: ['', [Validators.required]],
      roomFeatures: ['', [Validators.required]],
      roomRate: ['', [Validators.required, Validators.min(0)]],
      specialInstructions: [''],
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
        this.snackBar.open('Room added successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: 'success-snackbar',
        });
        this.isSubmitting = false;
        this.resetForm();
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
  resetForm() {
    this.roomForm.reset();
    this.snackBar.open('Form has been reset', 'Close', {
      duration: 2000,
    });
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
}
