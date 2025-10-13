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
import { ExpensesService } from '../../expenses.service';

export interface DialogData {
  expense_id: number;
  category: string;
  amount: string;
}
@Component({
  selector: 'app-expenses-delete',
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
export class ExpensesDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<ExpensesDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public expensesService: ExpensesService
  ) {}
  confirmDelete(): void {
    this.expensesService.deleteExpensesRecord(this.data.expense_id).subscribe({
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
