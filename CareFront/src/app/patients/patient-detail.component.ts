import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PatientsService } from './patients.service';
import { Patient, DoctorSummary } from './patients.model';
import { ConsultationsApiService } from './consultations-api.service';
import { ConsultationListItem } from './consultations.model';
import { ConsultationFormComponent, ConsultationFormData, ConsultationFormResult } from './consultation-form.component';
import { ConsultationDetailComponent, ConsultationDetailData } from './consultation-detail.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatCardModule,
    BreadcrumbComponent,
  ],
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss'],
})
export class PatientDetailComponent implements OnInit, OnDestroy {
  patient?: Patient;
  consultations: ConsultationListItem[] = [];
  loadingPatient = false;
  loadingConsultations = false;
  page = 1;
  pageSize = 5;
  totalCount = 0;
  doctorOptions: DoctorSummary[] = [];
  private subscriptions: Subscription[] = [];

  displayedColumns = ['consultationDateTime', 'doctorName', 'reason', 'symptomSummary', 'actions'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly patientsService: PatientsService,
    private readonly consultationsApi: ConsultationsApiService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (!patientId) {
      return;
    }

    this.loadPatient(patientId);
    this.loadDoctors();
    this.loadConsultations(patientId, this.page);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  loadPatient(id: string): void {
    this.loadingPatient = true;
    const sub = this.patientsService.getPatientById(id).subscribe({
      next: (patient) => {
        this.patient = patient;
        this.loadingPatient = false;
      },
      error: () => {
        this.loadingPatient = false;
      },
    });
    this.subscriptions.push(sub);
  }

  loadConsultations(patientId: string, page: number): void {
    this.loadingConsultations = true;
    const sub = this.consultationsApi
      .getByPatient(patientId, page, this.pageSize)
      .subscribe({
        next: (response) => {
          this.consultations = response.items;
          this.totalCount = response.totalCount;
          this.page = page;
          this.loadingConsultations = false;
        },
        error: () => {
          this.consultations = [];
          this.totalCount = 0;
          this.loadingConsultations = false;
        },
      });

    this.subscriptions.push(sub);
  }

  loadDoctors(): void {
    const sub = this.patientsService.searchDoctors().subscribe((doctors) => {
      this.doctorOptions = doctors;
    });
    this.subscriptions.push(sub);
  }

  newConsultation(): void {
    if (!this.patient) {
      return;
    }

    const dialogRef = this.dialog.open<ConsultationFormComponent, ConsultationFormData, ConsultationFormResult>(
      ConsultationFormComponent,
      {
        width: '700px',
        maxWidth: '95vw',
        data: {
          patientId: this.patient.id,
          doctors: this.doctorOptions,
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.consultation) {
        this.loadConsultations(this.patient!.id, 1);
      }
    });
  }

  viewConsultation(consultation: ConsultationListItem): void {
    if (!this.patient) {
      return;
    }

    const dialogRef = this.dialog.open<ConsultationDetailComponent, ConsultationDetailData>(
      ConsultationDetailComponent,
      {
        width: '700px',
        maxWidth: '95vw',
        data: {
          consultationId: consultation.id,
          patientName: `${this.patient.firstName} ${this.patient.lastName}`.trim(),
          doctorOptions: this.doctorOptions,
          patientId: this.patient.id,
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        this.loadConsultations(this.patient!.id, this.page);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/patients']);
  }

  nextPage(): void {
    if (this.patient && this.page * this.pageSize < this.totalCount) {
      this.loadConsultations(this.patient.id, this.page + 1);
    }
  }

  previousPage(): void {
    if (this.patient && this.page > 1) {
      this.loadConsultations(this.patient.id, this.page - 1);
    }
  }
}
