import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ShiftManagementService } from '../../shift-management.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  doctorId: string;
  doctorName: string;
  department: string;
  specialty: string;
}

@Component({
    selector: 'app-shift-management-delete',
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
export class ShiftManagementDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<ShiftManagementDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public shiftManagementService: ShiftManagementService
  ) {}
  confirmDelete(): void {
    this.shiftManagementService
      .deleteShiftManagement(this.data.doctorId)
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
