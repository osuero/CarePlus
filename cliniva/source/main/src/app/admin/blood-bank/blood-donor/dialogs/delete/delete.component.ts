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
import { BloodDonorService } from '../../blood-donor.service';

export interface DialogData {
  donorId: number;
  donorName: string;
  bloodType: number;
}

@Component({
    selector: 'app-all-bloodDonor-delete',
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
export class BloodDonorDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<BloodDonorDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public bloodDonorService: BloodDonorService
  ) {}
  confirmDelete(): void {
    this.bloodDonorService.deleteBloodDonor(this.data.donorId).subscribe({
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
