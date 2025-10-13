import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { RoomService } from '../../room.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  roomNo: string;
  patientName: string;
  roomType: string;
}

@Component({
    selector: 'app-all-room-delete',
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
export class AllRoomDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<AllRoomDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public roomService: RoomService
  ) {}
  confirmDelete(): void {
    this.roomService.deleteRoom(this.data.id).subscribe({
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
