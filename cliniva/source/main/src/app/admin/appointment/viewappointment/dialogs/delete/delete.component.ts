import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AppointmentService } from '../../appointment.service';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  name: string;
  email: string;
  mobile: string;
}

@Component({
    selector: 'app-view-appointment-delete',
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
export class ViewAppointmentDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewAppointmentDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public appointmentService: AppointmentService
  ) {}
  confirmDelete(): void {
    this.appointmentService.deleteAppointment(this.data.id).subscribe({
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
