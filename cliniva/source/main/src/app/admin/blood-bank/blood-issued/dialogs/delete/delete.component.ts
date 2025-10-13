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
import { BloodIssuedService } from '../../blood-issued.service';

export interface DialogData {
  issueId: number;
  patientName: string;
  bloodType: number;
}

@Component({
    selector: 'app-all-bloodIssued-delete',
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
export class BloodIssuedDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<BloodIssuedDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public bloodIssuedService: BloodIssuedService
  ) {}
  confirmDelete(): void {
    this.bloodIssuedService.deleteBloodIssued(this.data.issueId).subscribe({
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
