import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AssignDepartmentService } from '../../assign-department.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AssignDepartment } from '../../assign-department.model';
import { formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

export interface DialogData {
  id: number;
  action: string;
  assignDepartment: AssignDepartment;
}

@Component({
    selector: 'app-assign-department-form-dialog',
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
        MatDatepickerModule,
        MatDialogClose
    ]
})
export class AssignDepartmentsFormComponent {
  action: string;
  dialogTitle: string;
  doctorsForm: UntypedFormGroup;
  assignDepartment: AssignDepartment;

  constructor(
    public dialogRef: MatDialogRef<AssignDepartmentsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public assignDepartmentService: AssignDepartmentService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit'
        ? data.assignDepartment.doctorName
        : 'New Department';
    this.assignDepartment =
      this.action === 'edit' ? data.assignDepartment : new AssignDepartment({}); // Create a blank object
    this.doctorsForm = this.createContactForm();
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      doctorId: [this.assignDepartment.doctorId], // Doctor ID
      doctorName: [this.assignDepartment.doctorName, [Validators.required]], // Doctor Name is required
      department: [this.assignDepartment.department, [Validators.required]], // Department is required
      specialty: [this.assignDepartment.specialty], // Specialty
      assignedDate: [
        formatDate(this.assignDepartment.assignedDate, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ], // Assigned date formatted
      currentAssignmentStatus: [this.assignDepartment.currentAssignmentStatus], // Current status of assignment
      shiftSchedule: [this.assignDepartment.shiftSchedule], // Shift schedule
      experienceLevel: [this.assignDepartment.experienceLevel], // Experience level
      img: [this.assignDepartment.img], // Doctor's image path
    });
  }

  getErrorMessage(control: UntypedFormControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('email')) {
      return 'Please enter a valid email';
    }
    return '';
  }

  submit() {
    if (this.doctorsForm.valid) {
      if (this.action === 'edit') {
        // Update existing doctor
        this.assignDepartmentService
          .updateAssignedDoctor(this.doctorsForm.getRawValue())
          .subscribe({
            next: (response) => {
              this.dialogRef.close(response); // Close dialog and return updated doctor data
            },
            error: (error) => {
              console.error('Update Error:', error);
              // Optionally display an error message to the user
            },
          });
      } else {
        // Add new doctor
        this.assignDepartmentService
          .addAssignDepartment(this.doctorsForm.getRawValue())
          .subscribe({
            next: (response) => {
              this.dialogRef.close(response); // Close dialog and return newly added doctor data
            },
            error: (error) => {
              console.error('Add Error:', error);
              // Optionally display an error message to the user
            },
          });
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close(); // Close dialog without any action
  }
}
