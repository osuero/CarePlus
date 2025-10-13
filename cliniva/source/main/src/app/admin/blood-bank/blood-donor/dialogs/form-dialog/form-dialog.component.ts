import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { BloodDonor } from '../../blood-donor.model';
import { BloodDonorService } from '../../blood-donor.service';

export interface DialogData {
  id: number;
  action: string;
  bloodDonor: BloodDonor;
}

@Component({
    selector: 'app-all-bloodDonor-form-dialog',
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
export class BloodDonorFormComponent {
  action: string;
  dialogTitle: string;
  bloodDonorForm: UntypedFormGroup;
  bloodDonor: BloodDonor;

  constructor(
    public dialogRef: MatDialogRef<BloodDonorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public bloodDonorService: BloodDonorService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit' ? data.bloodDonor.donorName : 'New Donner';
    this.bloodDonor =
      this.action === 'edit' ? data.bloodDonor : new BloodDonor({}); // Create a blank object
    this.bloodDonorForm = this.createContactForm();
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      donorId: [this.bloodDonor.donorId, [Validators.required]],
      donorName: [this.bloodDonor.donorName, [Validators.required]],
      dateOfBirth: [this.bloodDonor.dateOfBirth, [Validators.required]],
      gender: [this.bloodDonor.gender, [Validators.required]],
      bloodType: [this.bloodDonor.bloodType, [Validators.required]],
      address: [this.bloodDonor.address, [Validators.required]],
      phoneNumber: [this.bloodDonor.phoneNumber, [Validators.required]],
      email: [this.bloodDonor.email, [Validators.required, Validators.email]],
      donorStatus: [this.bloodDonor.donorStatus],
      lastDonationDate: [this.bloodDonor.lastDonationDate],
      nextEligibleDonationDate: [
        this.bloodDonor.nextEligibleDonationDate,
        [Validators.required],
      ],
      donationFrequency: [
        this.bloodDonor.donationFrequency,
        [Validators.required],
      ],
      healthStatus: [this.bloodDonor.healthStatus, [Validators.required]],
      donationHistory: [this.bloodDonor.donationHistory, [Validators.required]],
      donorCategory: [this.bloodDonor.donorCategory],
      donorIdentificationNumber: [this.bloodDonor.donorIdentificationNumber],
      medicalHistory: [this.bloodDonor.medicalHistory],
      emergencyContactPhone: [this.bloodDonor.emergencyContactPhone],
      registrationDate: [this.bloodDonor.registrationDate],
      donorLocation: [this.bloodDonor.donorLocation],
      donorNotes: [this.bloodDonor.donorNotes],
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
    if (this.bloodDonorForm.valid) {
      if (this.action === 'edit') {
        // Update existing doctor
        this.bloodDonorService
          .updateBloodDonor(this.bloodDonorForm.getRawValue())
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
        this.bloodDonorService
          .addBloodDonor(this.bloodDonorForm.getRawValue())
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
