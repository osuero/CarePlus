import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { BillListService } from '../../bill-list.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  patientName: string;
  doctorName: string;
  total: string;
}
@Component({
    selector: 'app-bill-list-delete',
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
export class BillListDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<BillListDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public billListService: BillListService
  ) {}
  confirmDelete(): void {
    this.billListService.deleteBillList(this.data.id).subscribe({
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
