import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { RoomsByDepartmentService } from '../../rooms-by-department.service';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RoomsByDepartment } from '../../rooms-by-department.model';
import { formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

export interface DialogData {
  id: number;
  action: string;
  roomsByDepartment: RoomsByDepartment;
}

@Component({
    selector: 'app-rooms-by-department-form',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    imports: [
        MatButtonModule,
        MatIconModule,
        MatDialogContent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatDialogClose,
    ]
})
export class RoomsByDepartmentFormComponent {
  action: string;
  dialogTitle: string;
  roomsByDepartmentForm: UntypedFormGroup;
  roomsByDepartment: RoomsByDepartment;
  loading: boolean = false; // Loading state

  constructor(
    public dialogRef: MatDialogRef<RoomsByDepartmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public roomsByDepartmentService: RoomsByDepartmentService,
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {
    // Set the defaults
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit'
        ? 'Department Name: ' + data.roomsByDepartment.department_name
        : 'Add New Room';

    this.roomsByDepartment =
      this.action === 'edit'
        ? data.roomsByDepartment
        : new RoomsByDepartment({} as RoomsByDepartment); // Create a blank object
    this.roomsByDepartmentForm = this.createRoomsByDepartmentForm();
  }

  // Create form group for department list details
  createRoomsByDepartmentForm(): UntypedFormGroup {
    return this.fb.group({
      room_id: [this.roomsByDepartment.room_id],
      room_number: [this.roomsByDepartment.room_number, [Validators.required]],
      department_name: [
        this.roomsByDepartment.department_name,
        [Validators.required],
      ],
      room_type: [this.roomsByDepartment.room_type, [Validators.required]],
      floor: [this.roomsByDepartment.floor, [Validators.required]],
      bed_capacity: [
        this.roomsByDepartment.bed_capacity,
        [Validators.required],
      ],
      occupied_beds: [
        this.roomsByDepartment.occupied_beds,
        [Validators.required],
      ],
      room_status: [this.roomsByDepartment.room_status, [Validators.required]],
      assigned_staff: [this.roomsByDepartment.assigned_staff],
      patient_id: [this.roomsByDepartment.patient_id],
      room_features: [this.roomsByDepartment.room_features],
      admission_date: [
        formatDate(this.roomsByDepartment.admission_date, 'yyyy-MM-dd', 'en'),
      ],
      discharge_date: [
        formatDate(this.roomsByDepartment.discharge_date, 'yyyy-MM-dd', 'en'),
      ],
      room_rate: [this.roomsByDepartment.room_rate, [Validators.required]],
      last_cleaned: [
        formatDate(this.roomsByDepartment.last_cleaned, 'yyyy-MM-dd', 'en'),
      ],
      room_category: [
        this.roomsByDepartment.room_category,
        [Validators.required],
      ],
    });
  }

  // Dynamic error message retrieval for specific fields
  getErrorMessage(controlName: string): string {
    const control = this.roomsByDepartmentForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('pattern')) {
      return 'Invalid mobile number';
    }
    return '';
  }

  // Submit form data
  submit() {
    if (this.roomsByDepartmentForm.valid) {
      this.loading = true; // Start loading
      const formData = this.roomsByDepartmentForm.getRawValue();
      if (this.action === 'edit') {
        this.roomsByDepartmentService
          .updateRoomInDepartment(formData)
          .subscribe({
            next: (response) => {
              this.loading = false; // Stop loading
              this.snackBar.open('Department updated successfully!', 'Close', {
                duration: 2000,
              });
              this.dialogRef.close(response);
            },
            error: (error) => {
              this.loading = false; // Stop loading
              console.error('Update Error:', error);
              this.snackBar.open('Failed to update department.', 'Close', {
                duration: 2000,
              });
            },
          });
      } else {
        this.roomsByDepartmentService.addRoomToDepartment(formData).subscribe({
          next: (response) => {
            this.loading = false; // Stop loading
            this.snackBar.open('Department added successfully!', 'Close', {
              duration: 2000,
            });
            this.dialogRef.close(response);
          },
          error: (error) => {
            this.loading = false; // Stop loading
            console.error('Add Error:', error);
            this.snackBar.open('Failed to add department.', 'Close', {
              duration: 2000,
            });
          },
        });
      }
    }
  }

  // Close dialog without action
  onNoClick(): void {
    this.dialogRef.close();
  }
}
