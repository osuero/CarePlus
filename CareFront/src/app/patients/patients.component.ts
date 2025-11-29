import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  takeUntil,
} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { environment } from '../../environments/environment';
import { PatientsService } from './patients.service';
import { Patient } from './patients.model';
import {
  PatientsCreateDialogComponent,
  PatientsCreateDialogResult,
} from './patients-create-dialog.component';
import {
  PatientsEditDialogComponent,
  PatientsEditDialogData,
  PatientsEditDialogResult,
} from './patients-edit-dialog.component';

@Component({
  selector: 'app-patients',
  standalone: true,
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class PatientsComponent implements OnInit, OnDestroy {
  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly genderControl = new FormControl<string>('ALL', { nonNullable: true });
  readonly countryControl = new FormControl<string>('', { nonNullable: true });
  readonly identificationControl = new FormControl<string>('', {
    nonNullable: true,
  });
  readonly firstNameControl = new FormControl<string>('', { nonNullable: true });
  readonly lastNameControl = new FormControl<string>('', { nonNullable: true });
  readonly emailControl = new FormControl<string>('', { nonNullable: true });

  patients: Patient[] = [];

  readonly tenants =
    Array.isArray(environment.tenants) && environment.tenants.length > 0
      ? environment.tenants
      : [environment.tenantId];
  readonly defaultTenant = environment.tenantId ?? 'default';

  page = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  hasNextPage = false;
  hasPreviousPage = false;

  loadingPatients = false;

  readonly rangeStart = signal(0);
  readonly rangeEnd = signal(0);

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly patientsService: PatientsService,
    private readonly translate: TranslateService,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.watchSearchChanges();
    this.watchFilterChanges();
    this.loadPatients(1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(PatientsCreateDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result?: PatientsCreateDialogResult) => {
        if (result?.patient) {
          const successTitle = this.translate.instant(
            'PATIENTS.MESSAGES.SUCCESS_TITLE'
          );
          const successBody = this.translate.instant(
            'PATIENTS.MESSAGES.SUCCESS_BODY'
          );
          Swal.fire(successTitle, successBody, 'success');
          this.loadPatients(1);
        }
      });
  }

  openEditDialog(patient: Patient): void {
    const dialogRef = this.dialog.open(PatientsEditDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { patient } as PatientsEditDialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result?: PatientsEditDialogResult) => {
        if (result?.patient) {
          const successTitle = this.translate.instant(
            'PATIENTS.MESSAGES.UPDATE_TITLE'
          );
          const successBody = this.translate.instant(
            'PATIENTS.MESSAGES.UPDATE_BODY'
          );
          Swal.fire(successTitle, successBody, 'success');
          this.loadPatients(this.page);
        }
      });
  }

  confirmDelete(patient: Patient): void {
    const title = this.translate.instant('PATIENTS.MESSAGES.DELETE_TITLE');
    const text = this.translate.instant('PATIENTS.MESSAGES.DELETE_CONFIRM', {
      name: this.getFullName(patient),
    });
    const confirmButtonText = this.translate.instant(
      'PATIENTS.MESSAGES.DELETE_CONFIRM_BUTTON'
    );
    const cancelButtonText = this.translate.instant(
      'PATIENTS.MESSAGES.DELETE_CANCEL_BUTTON'
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
        this.patientsService
          .deletePatient(patient.id, patient.tenantId ?? this.defaultTenant)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              const successBody = this.translate.instant(
                'PATIENTS.MESSAGES.DELETE_SUCCESS'
              );
              Swal.fire(title, successBody, 'success');
              const nextPage = this.calculatePageAfterDeletion();
              this.loadPatients(nextPage);
            },
            error: (error: Error) => {
              const fallbackBody = this.translate.instant(
                'PATIENTS.MESSAGES.ERROR_BODY'
              );
              const body = error.message || fallbackBody;
              Swal.fire(
                this.translate.instant('PATIENTS.MESSAGES.ERROR_TITLE'),
                body,
                'error'
              );
            },
          });
      } else if (result.dismiss === 'cancel') {
        const cancelBody = this.translate.instant(
          'PATIENTS.MESSAGES.DELETE_CANCELLED'
        );
        Swal.fire({
          title,
          text: cancelBody,
          icon: 'info',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

  viewDetails(patient: Patient): void {
    this.router.navigate(['/patients', patient.id]);
  }

  changePageSize(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const value = target?.value ?? '';
    const parsed = parseInt(value, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      this.pageSize = parsed;
      this.loadPatients(1);
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage && !this.loadingPatients) {
      this.loadPatients(this.page - 1);
    }
  }

  nextPage(): void {
    if (this.hasNextPage && !this.loadingPatients) {
      this.loadPatients(this.page + 1);
    }
  }

  trackByPatientId(_: number, patient: Patient): string {
    return patient.id;
  }

  getGenderLabel(gender?: string | null): string {
    if (!gender) {
      return this.translate.instant('PATIENTS.FORM.GENDER_OPTIONS.OTHER');
    }

    const normalized = gender.trim().toUpperCase();
    const validKeys = ['MALE', 'FEMALE', 'OTHER'];
    const key = validKeys.includes(normalized) ? normalized : 'OTHER';
    return this.translate.instant(`PATIENTS.FORM.GENDER_OPTIONS.${key}`);
  }

  private watchSearchChanges(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadPatients(1);
      });
  }

  private watchFilterChanges(): void {
    this.genderControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadPatients(1);
      });

    this.countryControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadPatients(1);
      });

    this.identificationControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadPatients(1);
      });

    this.firstNameControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadPatients(1);
      });

    this.lastNameControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadPatients(1);
      });

    this.emailControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadPatients(1);
      });

  }

  private loadPatients(page: number): void {
    const searchTerms = [
      this.searchControl.value?.trim(),
      this.identificationControl.value?.trim(),
      this.firstNameControl.value?.trim(),
      this.lastNameControl.value?.trim(),
      this.emailControl.value?.trim(),
    ]
      .filter((term) => term && term.length > 0)
      .join(' ')
      .trim();

    const search = searchTerms.length > 0 ? searchTerms : null;
    const genderSelection = this.genderControl.value;
    const gender = genderSelection === 'ALL' ? null : genderSelection;
    const country = this.countryControl.value?.trim() || null;

    this.loadingPatients = true;

    this.patientsService
      .getPatients(
        page,
        this.pageSize,
        search,
        gender,
        country
      )
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingPatients = false;
        })
      )
      .subscribe({
        next: (collection) => {
          this.patients = collection.nodes;
          this.page = collection.page;
          this.pageSize = collection.pageSize;
          this.totalCount = collection.totalCount;
          this.totalPages = collection.totalPages;
          this.hasNextPage = collection.hasNextPage;
          this.hasPreviousPage = collection.hasPreviousPage;
          this.updateRange();
        },
        error: (error: Error) => {
          const errorTitle = this.translate.instant(
            'PATIENTS.MESSAGES.LOAD_ERROR_TITLE'
          );
          const fallbackBody = this.translate.instant(
            'PATIENTS.MESSAGES.LOAD_ERROR_BODY'
          );
          const body = error.message || fallbackBody;
          Swal.fire(errorTitle, body, 'error');
        },
      });
  }

  private updateRange(): void {
    if (this.totalCount === 0) {
      this.rangeStart.set(0);
      this.rangeEnd.set(0);
      return;
    }

    const start = (this.page - 1) * this.pageSize + 1;
    const end = Math.min(this.page * this.pageSize, this.totalCount);
    this.rangeStart.set(start);
    this.rangeEnd.set(end);
  }

  private calculatePageAfterDeletion(): number {
    const remaining = this.totalCount - 1;
    if (remaining <= 0) {
      return 1;
    }

    const totalPagesAfter = Math.max(
      1,
      Math.ceil(remaining / Math.max(this.pageSize, 1))
    );

    return Math.min(this.page, totalPagesAfter);
  }

  private getFullName(patient: Patient): string {
    return `${patient.firstName ?? ''} ${patient.lastName ?? ''}`.trim();
  }
}
