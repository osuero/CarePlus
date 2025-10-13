import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { BirthService } from '../../birth.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  child_name: string;
  gender: string;
  mother_name: string;
}

@Component({
    selector: 'app-birth-delete',
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
export class BirthDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<BirthDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public birthService: BirthService
  ) {}
  confirmDelete(): void {
    this.birthService.deleteBirth(this.data.id).subscribe({
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
