import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { PatientInsuranceService } from '../../patient-insurance.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PatientInsurance } from '../../patient-insurance.model';
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
  patientInsurance: PatientInsurance;
}

@Component({
    selector: 'app-all-patientInsurance-form-dialog',
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
export class AllPatientInsuranceFormComponent {
  action: string;
  dialogTitle: string;
  patientInsuranceForm: UntypedFormGroup;
  patientInsurance: PatientInsurance;

  constructor(
    public dialogRef: MatDialogRef<AllPatientInsuranceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public patientInsuranceService: PatientInsuranceService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit'
        ? data.patientInsurance.policy_holder_name
        : 'New Patient';
    this.patientInsurance =
      this.action === 'edit' ? data.patientInsurance : new PatientInsurance({}); // Create a blank object
    this.patientInsuranceForm = this.createContactForm();
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      insurance_id: [this.patientInsurance.insurance_id, [Validators.required]],
      patient_id: [this.patientInsurance.patient_id, [Validators.required]],
      insurance_company_name: [
        this.patientInsurance.insurance_company_name,
        [Validators.required],
      ],
      insurance_policy_number: [
        this.patientInsurance.insurance_policy_number,
        [Validators.required],
      ],
      policy_type: [this.patientInsurance.policy_type, [Validators.required]],
      coverage_start_date: [
        this.patientInsurance.coverage_start_date,
        [Validators.required],
      ],
      coverage_end_date: [
        this.patientInsurance.coverage_end_date,
        [Validators.required],
      ],
      coverage_amount: [
        this.patientInsurance.coverage_amount,
        [Validators.required, Validators.min(0)],
      ],
      co_payment: [
        this.patientInsurance.co_payment,
        [Validators.required, Validators.min(0)],
      ],
      policy_holder_name: [
        this.patientInsurance.policy_holder_name,
        [Validators.required],
      ],
      plan_type: [this.patientInsurance.plan_type, [Validators.required]],
      benefits: [this.patientInsurance.benefits, [Validators.required]],
      insurance_status: [
        this.patientInsurance.insurance_status,
        [Validators.required],
      ],
      claim_limit: [
        this.patientInsurance.claim_limit,
        [Validators.required, Validators.min(0)],
      ],
      remarks: [this.patientInsurance.remarks],
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
    if (this.patientInsuranceForm.valid) {
      if (this.action === 'edit') {
        // Update existing doctor
        this.patientInsuranceService
          .updatePatientInsurance(this.patientInsuranceForm.getRawValue())
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
        this.patientInsuranceService
          .addPatientInsurance(this.patientInsuranceForm.getRawValue())
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
