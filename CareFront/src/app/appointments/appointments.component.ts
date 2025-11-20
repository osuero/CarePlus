import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { environment } from '../../environments/environment';
import {
  Appointment,
  AppointmentCollection,
  AppointmentStatus,
} from './appointments.model';
import { AppointmentsService } from './appointments.service';
import {
  AppointmentsCreateDialogComponent,
  AppointmentsCreateDialogData,
  AppointmentsCreateDialogResult,
} from './appointments.create-dialog.component';
import {
  AppointmentsDetailDialogComponent,
  AppointmentsDetailDialogData,
} from './appointments.detail-dialog.component';
import {
  mapAppointmentStatusToCssClass,
  mapAppointmentStatusToTranslationKey,
} from './appointment-status.utils';

interface AppointmentQueryState {
  page: number;
  pageSize: number;
  search?: string;
  status?: AppointmentStatus | 'ALL';
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    BreadcrumbComponent,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    DatePipe,
    RouterModule,
  ],
  providers: [DatePipe],
})
export class AppointmentsComponent implements OnInit, OnDestroy {
  private readonly appointmentsService = inject(AppointmentsService);
  private readonly translate = inject(TranslateService);
  private readonly dialog = inject(MatDialog);
  private readonly destroy$ = new Subject<void>();

  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly statusControl = new FormControl<AppointmentStatus | 'ALL'>('ALL', {
    nonNullable: true,
  });

  readonly tenants =
    Array.isArray(environment.tenants) && environment.tenants.length > 0
      ? environment.tenants
      : [environment.tenantId];

  readonly defaultTenant = environment.tenantId ?? 'default';

  readonly tenantControl = new FormControl<string>(this.defaultTenant ?? 'default', {
    nonNullable: true,
  });

  readonly appointments = signal<Appointment[]>([]);
  readonly totalCount = signal(0);
  readonly page = signal(1);
  readonly pageSize = signal(10);

  readonly displayedColumns = [
    'patient',
    'doctor',
    'title',
    'start',
    'end',
    'status',
    'actions',
  ];

  readonly statusOptions: Array<{ value: AppointmentStatus | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'APPOINTMENTS.STATUS.ALL' },
    { value: 'Scheduled', label: 'APPOINTMENTS.STATUS.SCHEDULED' },
    { value: 'Confirmed', label: 'APPOINTMENTS.STATUS.CONFIRMED' },
    { value: 'Completed', label: 'APPOINTMENTS.STATUS.COMPLETED' },
    { value: 'Cancelled', label: 'APPOINTMENTS.STATUS.CANCELLED' },
    { value: 'NoShow', label: 'APPOINTMENTS.STATUS.NOSHOW' },
  ];

  readonly rangeStart = computed(() => {
    const p = this.page();
    const size = this.pageSize();
    const count = this.totalCount();
    if (count === 0) {
      return 0;
    }
    return (p - 1) * size + 1;
  });

  readonly rangeEnd = computed(() => {
    const start = this.rangeStart();
    if (start === 0) {
      return 0;
    }
    return Math.min(this.page() * this.pageSize(), this.totalCount());
  });

  private currentQuery: AppointmentQueryState = {
    page: 1,
    pageSize: 10,
    status: 'ALL',
    search: '',
  };

  ngOnInit(): void {
    this.watchSearchChanges();
    this.watchStatusChanges();
    this.watchTenantChanges();
    this.loadAppointments(1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: PageEvent): void {
    const page = event.pageIndex + 1;
    const pageSize = event.pageSize;
    this.currentQuery = {
      ...this.currentQuery,
      page,
      pageSize,
    };
    this.loadAppointments(page);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(AppointmentsCreateDialogComponent, {
      width: '620px',
      maxWidth: '95vw',
      data: {
        tenantId: this.tenantControl.value,
      } satisfies AppointmentsCreateDialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result?: AppointmentsCreateDialogResult) => {
        if (result?.appointment) {
          this.showSuccessMessage('APPOINTMENTS.MESSAGES.CREATED');
          this.loadAppointments(1);
        }
      });
  }

  openEditDialog(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentsCreateDialogComponent, {
      width: '620px',
      maxWidth: '95vw',
      data: {
        tenantId: appointment.tenantId ?? this.tenantControl.value,
        appointment,
      } satisfies AppointmentsCreateDialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result?: AppointmentsCreateDialogResult) => {
        if (result?.appointment) {
          this.showSuccessMessage('APPOINTMENTS.MESSAGES.UPDATED');
          this.loadAppointments(this.currentQuery.page);
        }
      });
  }

  openDetailsDialog(appointment: Appointment): void {
    this.dialog.open(AppointmentsDetailDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: {
        appointment,
      } satisfies AppointmentsDetailDialogData,
    });
  }

  confirmCancel(appointment: Appointment): void {
    const title = this.translate.instant('APPOINTMENTS.MESSAGES.CANCEL_TITLE');
    const text = this.translate.instant('APPOINTMENTS.MESSAGES.CANCEL_CONFIRM', {
      title: appointment.title,
    });
    const confirmButtonText = this.translate.instant(
      'APPOINTMENTS.MESSAGES.CANCEL_CONFIRM_BUTTON'
    );
    const cancelButtonText = this.translate.instant(
      'APPOINTMENTS.MESSAGES.CANCEL_CANCEL_BUTTON'
    );

    Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentsService
          .cancelAppointment(appointment.id, appointment.tenantId ?? this.defaultTenant)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.showSuccessMessage('APPOINTMENTS.MESSAGES.CANCELLED');
              this.loadAppointments(this.currentQuery.page);
            },
            error: (error: Error) => this.showErrorMessage(error),
          });
      }
    });
  }

  confirmDelete(appointment: Appointment): void {
    const title = this.translate.instant('APPOINTMENTS.MESSAGES.DELETE_TITLE');
    const text = this.translate.instant('APPOINTMENTS.MESSAGES.DELETE_CONFIRM', {
      title: appointment.title,
    });
    const confirmButtonText = this.translate.instant(
      'APPOINTMENTS.MESSAGES.DELETE_CONFIRM_BUTTON'
    );
    const cancelButtonText = this.translate.instant(
      'APPOINTMENTS.MESSAGES.DELETE_CANCEL_BUTTON'
    );

    Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointmentsService
          .deleteAppointment(appointment.id, appointment.tenantId ?? this.defaultTenant)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.showSuccessMessage('APPOINTMENTS.MESSAGES.DELETED');
              const nextPage = this.calculatePageAfterDeletion();
              this.loadAppointments(nextPage);
            },
            error: (error: Error) => this.showErrorMessage(error),
          });
      }
    });
  }

  private loadAppointments(page: number): void {
    const tenantId = this.tenantControl.value ?? this.defaultTenant;
    this.page.set(page);
    this.pageSize.set(this.currentQuery.pageSize);

    this.appointmentsService
      .searchAppointments(page, this.currentQuery.pageSize, {
        search: this.currentQuery.search,
        status: this.currentQuery.status,
        tenantId,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (collection: AppointmentCollection) => {
          this.appointments.set(collection.nodes);
          this.totalCount.set(collection.totalCount);
          this.page.set(collection.page);
          this.pageSize.set(collection.pageSize);
        },
        error: (error: Error) => this.showErrorMessage(error),
      });
  }

  private watchSearchChanges(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.currentQuery = {
          ...this.currentQuery,
          page: 1,
          search: value?.trim() ?? '',
        };
        this.loadAppointments(1);
      });
  }

  private watchStatusChanges(): void {
    this.statusControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.currentQuery = {
          ...this.currentQuery,
          page: 1,
          status: value ?? 'ALL',
        };
        this.loadAppointments(1);
      });
  }

  private watchTenantChanges(): void {
    this.tenantControl.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentQuery = {
          ...this.currentQuery,
          page: 1,
        };
        this.loadAppointments(1);
      });
  }

  private calculatePageAfterDeletion(): number {
    const total = this.totalCount();
    const page = this.page();
    const pageSize = this.pageSize();
    if (total - 1 <= (page - 1) * pageSize && page > 1) {
      return page - 1;
    }
    return page;
  }

  private showSuccessMessage(translationKey: string): void {
    const title = this.translate.instant('APPOINTMENTS.MESSAGES.SUCCESS_TITLE');
    const text = this.translate.instant(translationKey);
    Swal.fire(title, text, 'success');
  }

  private showErrorMessage(error: Error): void {
    const title = this.translate.instant('APPOINTMENTS.MESSAGES.ERROR_TITLE');
    const fallback = this.translate.instant('APPOINTMENTS.MESSAGES.ERROR_BODY');
    Swal.fire(title, error.message || fallback, 'error');
  }

  getPatientDisplayName(appointment: Appointment): string {
    const prospectName = `${appointment.prospectFirstName ?? ''} ${appointment.prospectLastName ?? ''}`.trim();
    const name = appointment.patientName ?? (prospectName.length > 0 ? prospectName : null);
    return name && name.length > 0 ? name : '-';
  }

  getPatientContact(appointment: Appointment): string | null {
    return appointment.prospectPhoneNumber ?? appointment.patientEmail ?? appointment.prospectEmail ?? null;
  }

  getStatusTranslationKey(status: Appointment['status']): string {
    return mapAppointmentStatusToTranslationKey(status);
  }

  getStatusCssClass(status: Appointment['status']): string {
    return mapAppointmentStatusToCssClass(status);
  }
}
