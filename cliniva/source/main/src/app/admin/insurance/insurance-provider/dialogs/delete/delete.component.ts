import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { InsuranceProviderService } from '../../insurance-provider.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  insuranceProviderId: string;
  providerName: string;
  contactPhone: string;
}

@Component({
    selector: 'app-all-insuranceProvider-delete',
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
export class InsuranceProviderDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<InsuranceProviderDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public insuranceProviderService: InsuranceProviderService
  ) {}
  confirmDelete(): void {
    this.insuranceProviderService
      .deleteInsuranceProvider(this.data.insuranceProviderId)
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
