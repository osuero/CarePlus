import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ClaimStatusService } from '../../claim-status.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  claim_id: string;
  patient_name: string;
  claim_type: string;
}

@Component({
    selector: 'app-all-claimStatus-delete',
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
export class ClaimStatusDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<ClaimStatusDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public claimStatusService: ClaimStatusService
  ) {}
  confirmDelete(): void {
    this.claimStatusService.deleteClaimStatus(this.data.claim_id).subscribe({
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
