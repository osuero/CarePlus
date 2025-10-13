import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { PatientInsuranceService } from '../../patient-insurance.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  insurance_id: string;
  patient_id: string;
  insurance_company_name: string;
}

@Component({
    selector: 'app-all-patientInsurance-delete',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss'],
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
    ]
})
export class PatientInsuranceDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<PatientInsuranceDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public patientInsuranceService: PatientInsuranceService
  ) {}
  confirmDelete(): void {
    this.patientInsuranceService
      .deletePatientInsurance(this.data.insurance_id)
      .subscribe({
        next: (response) => {
          // console.log('Delete Response:', response);
          this.dialogRef.close(response); // Close with the response data
          // Handle successful deletion, e.g., refresh the table or show a notification
        },
        error: (error) => {
          console.error('Delete Error:', error);
          // Handle the error appropriately
        },
      });
  }
}
