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
import { MatRadioModule } from '@angular/material/radio';
import { PatientRecords } from '../../patient-records.model';
import { PatientRecordsService } from '../../patient-records.service';

export interface DialogData {
  id: number;
  action: string;
  patientRecords: PatientRecords;
}

@Component({
    selector: 'app-all-patients-form-dialog',
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
        MatRadioModule,
        MatDatepickerModule,
        MatDialogClose
    ]
})
export class AllPatientFormDialogComponent {
  action: string;
  dialogTitle: string;
  patientForm: UntypedFormGroup;
  patientRecords: PatientRecords;

  constructor(
    public dialogRef: MatDialogRef<AllPatientFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public patientRecordsService: PatientRecordsService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit'
        ? `Edit ${data.patientRecords.fullName}`
        : 'New PatientRecords';
    this.patientRecords =
      this.action === 'edit' ? data.patientRecords : new PatientRecords({});
    this.patientForm = this.createPatientForm();
  }

  createPatientForm(): UntypedFormGroup {
    return this.fb.group({
      patientId: [this.patientRecords.patientId],
      fullName: [this.patientRecords.fullName, [Validators.required]],
      dateOfBirth: [
        formatDate(this.patientRecords.dateOfBirth, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      gender: [this.patientRecords.gender, [Validators.required]],
      dateOfAdmission: [
        formatDate(this.patientRecords.dateOfAdmission, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      diagnosis: [this.patientRecords.diagnosis, [Validators.required]],
      labReports: [this.patientRecords.labReports], // File input for lab reports
      treatmentPlan: [this.patientRecords.treatmentPlan, [Validators.required]],
      medications: [this.patientRecords.medications, [Validators.required]], // File input for medications
      medicationHistory: [this.patientRecords.medicationHistory], // File input for medication history
      nextFollowUp: [
        formatDate(this.patientRecords.nextFollowUp, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      doctorsNotes: [this.patientRecords.doctorsNotes],
      status: [this.patientRecords.status],
      emergencyContact: [
        this.patientRecords.emergencyContact,
        [Validators.required],
      ],
      insuranceProvider: [this.patientRecords.insuranceProvider],
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
    if (this.patientForm.valid) {
      if (this.action === 'edit') {
        this.patientRecordsService
          .updatePatientRecord(this.patientForm.getRawValue())
          .subscribe({
            next: (response) => {
              this.dialogRef.close(response);
            },
            error: (error) => {
              console.error('Update Error:', error);
              // Optionally display an error message to the user
            },
          });
      } else {
        this.patientRecordsService
          .addPatientRecord(this.patientForm.getRawValue())
          .subscribe({
            next: (response) => {
              this.dialogRef.close(response);
            },
            error: (error) => {
              console.error('Add Error:', error);
              // Optionally display an error message to the user
            },
          });
      }
    }
  }

  onFileSelected(event: any, fieldName: string): void {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      // You could handle the file upload here (e.g., by uploading it to a server)
      this.patientForm.patchValue({
        [fieldName]: file, // Store the file object in the form control
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close(); // Close dialog without any action
  }
}
