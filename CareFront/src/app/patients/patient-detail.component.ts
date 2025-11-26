import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PatientsService } from './patients.service';
import { Patient, DoctorSummary } from './patients.model';
import { ConsultationsApiService } from './consultations-api.service';
import { ConsultationListItem } from './consultations.model';
import { ConsultationFormComponent, ConsultationFormData, ConsultationFormResult } from './consultation-form.component';
import { ConsultationDetailComponent, ConsultationDetailData } from './consultation-detail.component';
import { Subscription } from 'rxjs';
import { Appointment } from '../appointments/appointments.model';
import { AppointmentsService } from '../appointments/appointments.service';

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
    TranslateModule,
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
  doctorsLoaded = false;
  private pendingAppointmentId?: string | null;
  private appointmentForConsultation?: Appointment;
  private openedFromAppointment = false;
  private subscriptions: Subscription[] = [];

  displayedColumns = ['consultationDateTime', 'doctorName', 'reason', 'symptomSummary', 'actions'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly patientsService: PatientsService,
    private readonly consultationsApi: ConsultationsApiService,
    private readonly dialog: MatDialog,
    private readonly appointmentsService: AppointmentsService
  ) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (!patientId) {
      return;
    }

    this.pendingAppointmentId = this.route.snapshot.queryParamMap.get('appointmentId');
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
        this.tryLoadAppointmentContext();
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
    const sub = this.patientsService.searchDoctors().subscribe({
      next: (doctors) => {
        this.doctorOptions = doctors;
        this.doctorsLoaded = true;
        this.tryOpenConsultationFromAppointment();
      },
      error: () => {
        this.doctorsLoaded = true;
      },
    });
    this.subscriptions.push(sub);
  }

  private tryLoadAppointmentContext(): void {
    if (!this.pendingAppointmentId || !this.patient) {
      return;
    }

    const appointmentId = this.pendingAppointmentId;
    const sub = this.appointmentsService
      .getAppointment(appointmentId, this.patient.tenantId)
      .subscribe({
        next: (appointment) => {
          if (appointment.patientId && appointment.patientId !== this.patient?.id) {
            this.pendingAppointmentId = null;
            return;
          }

          this.appointmentForConsultation = appointment;
          this.pendingAppointmentId = null;
          this.ensureDoctorInOptions(appointment);
          this.tryOpenConsultationFromAppointment();
        },
        error: () => {
          this.pendingAppointmentId = null;
        },
      });

    this.subscriptions.push(sub);
  }

  private tryOpenConsultationFromAppointment(): void {
    if (
      !this.appointmentForConsultation ||
      !this.patient ||
      this.openedFromAppointment === true ||
      !this.doctorsLoaded
    ) {
      return;
    }

    this.openedFromAppointment = true;
    this.newConsultation(this.appointmentForConsultation);
  }

  private ensureDoctorInOptions(appointment?: Appointment): void {
    if (!appointment?.doctorId || !appointment.doctorName) {
      return;
    }

    const exists = this.doctorOptions.some((doctor) => doctor.id === appointment.doctorId);
    if (!exists) {
      this.doctorOptions = [
        ...this.doctorOptions,
        { id: appointment.doctorId, fullName: appointment.doctorName, email: '' },
      ];
    }
  }

  newConsultation(appointment?: Appointment): void {
    if (!this.patient) {
      return;
    }

    if (appointment) {
      this.ensureDoctorInOptions(appointment);
    }

    const dialogRef = this.dialog.open<ConsultationFormComponent, ConsultationFormData, ConsultationFormResult>(
      ConsultationFormComponent,
      {
        width: '700px',
        maxWidth: '95vw',
        data: {
          patientId: this.patient.id,
          patientName: `${this.patient.firstName} ${this.patient.lastName}`.trim(),
          doctors: this.doctorOptions,
          appointmentContext: appointment
            ? {
                appointmentId: appointment.id,
                title: appointment.title,
                startsAtUtc: appointment.startsAtUtc,
                doctorId: appointment.doctorId ?? undefined,
                doctorName: appointment.doctorName ?? undefined,
              }
            : undefined,
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
