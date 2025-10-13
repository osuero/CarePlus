import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DoctorsService } from '../../doctors.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Doctors } from '../../doctors.model';
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
  doctors: Doctors;
}

@Component({
    selector: 'app-all-doctors-form-dialog',
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
        MatDialogClose,
    ]
})
export class AllDoctorsFormComponent {
  action: string;
  dialogTitle: string;
  doctorsForm: UntypedFormGroup;
  doctors: Doctors;

  constructor(
    public dialogRef: MatDialogRef<AllDoctorsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public doctorsService: DoctorsService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit' ? data.doctors.name : 'New Doctor';
    this.doctors = this.action === 'edit' ? data.doctors : new Doctors({}); // Create a blank object
    this.doctorsForm = this.createContactForm();
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.doctors.id],
      img: [this.doctors.img],
      name: [this.doctors.name, [Validators.required]],
      email: [this.doctors.email, [Validators.required, Validators.email]],
      date: [
        formatDate(this.doctors.date, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      specialization: [this.doctors.specialization],
      mobile: [this.doctors.mobile, [Validators.required]],
      department: [this.doctors.department],
      degree: [this.doctors.degree],
      experienceYears: [this.doctors.experienceYears],
      consultationFee: [this.doctors.consultationFee, [Validators.required]],
      availability: [this.doctors.availability],
      rating: [this.doctors.rating],
      clinicLocation: [this.doctors.clinicLocation],
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
        this.doctorsService
          .updateDoctors(this.doctorsForm.getRawValue())
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
        this.doctorsService
          .addDoctors(this.doctorsForm.getRawValue())
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
