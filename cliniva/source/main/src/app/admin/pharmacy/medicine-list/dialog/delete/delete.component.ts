import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MedicineListService } from '../../medicine-list.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  m_name: string;
  category: string;
  stock: string;
}

@Component({
    selector: 'app-Medicine-list-delete',
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
export class MedicineListDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<MedicineListDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public medicineListService: MedicineListService
  ) {}
  confirmDelete(): void {
    this.medicineListService.deleteMedicineList(this.data.id).subscribe({
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
