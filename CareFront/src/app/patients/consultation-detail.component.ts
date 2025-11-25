import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConsultationsApiService } from './consultations-api.service';
import { ConsultationDetail } from './consultations.model';
import { ConsultationFormComponent, ConsultationFormData } from './consultation-form.component';
import { DoctorSummary } from './patients.model';

export interface ConsultationDetailData {
  consultationId: string;
  patientName: string;
  doctorOptions: DoctorSummary[];
  patientId: string;
}

export interface ConsultationDetailResult {
  updated?: ConsultationDetail;
}

@Component({
  selector: 'app-consultation-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './consultation-detail.component.html',
  styleUrls: ['./consultation-detail.component.scss'],
})
export class ConsultationDetailComponent implements OnInit {
  consultation?: ConsultationDetail;
  loading = false;
  errorMessage = '';

  constructor(
    private readonly dialogRef: MatDialogRef<ConsultationDetailComponent, ConsultationDetailResult>,
    private readonly dialog: MatDialog,
    private readonly consultationsApi: ConsultationsApiService,
    @Inject(MAT_DIALOG_DATA) public data: ConsultationDetailData
  ) {}

  ngOnInit(): void {
    this.loadDetail();
  }

  loadDetail(): void {
    this.loading = true;
    this.errorMessage = '';
    this.consultationsApi.getDetail(this.data.consultationId).subscribe({
      next: (consultation) => {
        this.consultation = consultation;
        this.loading = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.loading = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  edit(): void {
    if (!this.consultation) {
      return;
    }

    const dialogRef = this.dialog.open<ConsultationFormComponent, ConsultationFormData>(
      ConsultationFormComponent,
      {
        width: '700px',
        maxWidth: '95vw',
        data: {
          patientId: this.data.patientId,
          doctors: this.data.doctorOptions,
          consultation: this.consultation,
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.consultation) {
        this.consultation = result.consultation;
        this.dialogRef.close({ updated: result.consultation });
      }
    });
  }
}
