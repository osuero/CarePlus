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
import { IncomeService } from '../../income.service';

export interface DialogData {
  incomeId: number;
  patientName: string;
  serviceType: string;
}
@Component({
  selector: 'app-income-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
  ],
})
export class IncomeDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<IncomeDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public incomeService: IncomeService
  ) {}
  confirmDelete(): void {
    this.incomeService.deleteIncomeRecord(this.data.incomeId).subscribe({
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
