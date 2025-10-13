import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PatientRecordsService } from '../../patient-records.service';

export interface DialogData {
  patientId: number;
  fullName: string;
  dateOfAdmission: string;
}

@Component({
    selector: 'app-all-patientRecords-delete',
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
export class AllPatientDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<AllPatientDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public patientRecordsService: PatientRecordsService
  ) {}
  confirmDelete(): void {
    this.patientRecordsService
      .deletePatientRecord(this.data.patientId)
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
