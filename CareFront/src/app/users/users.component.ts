import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import Swal from 'sweetalert2';
import { UsersService } from './users.service';
import { environment } from '../../environments/environment';\nimport { Role, User } from './users.model';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  takeUntil,
} from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  UsersCreateDialogComponent,
  UsersCreateDialogResult,
} from './users-create-dialog.component';
import {
  UsersEditDialogComponent,
  UsersEditDialogResult,
} from './users-edit-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
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
export class UsersComponent implements OnInit, OnDestroy {
  readonly searchControl = new FormControl<string>('', { nonNullable: true });

  users: User[] = [];
  roles: Role[] = [];
  rolesLoading = false;
  rolesError?: string;

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

  loadingUsers = false;

  readonly rangeStart = signal(0);
  readonly rangeEnd = signal(0);

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly usersService: UsersService,
    private readonly translate: TranslateService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.watchSearchChanges();
    this.loadUsers(1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(UsersCreateDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result?: UsersCreateDialogResult) => {
        if (result?.user) {
          const successTitle = this.translate.instant(
            'USERS.MESSAGES.SUCCESS_TITLE'
          );
          const successBody = this.translate.instant(
            'USERS.MESSAGES.SUCCESS_BODY'
          );
          Swal.fire(successTitle, successBody, 'success');
          this.loadUsers(1);
        }
      });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(UsersEditDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { user },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result?: UsersEditDialogResult) => {
        if (result?.user) {
          const successTitle = this.translate.instant(
            'USERS.MESSAGES.UPDATE_TITLE'
          );
          const successBody = this.translate.instant(
            'USERS.MESSAGES.UPDATE_BODY'
          );
          Swal.fire(successTitle, successBody, 'success');
          this.loadUsers(this.page);
        }
      });
  }

  confirmDelete(user: User): void {
    const title = this.translate.instant('USERS.MESSAGES.DELETE_TITLE');
    const text = this.translate.instant('USERS.MESSAGES.DELETE_CONFIRM', {
      name: this.getFullName(user),
    });
    const confirmButtonText = this.translate.instant(
      'USERS.MESSAGES.DELETE_CONFIRM_BUTTON'
    );
    const cancelButtonText = this.translate.instant(
      'USERS.MESSAGES.DELETE_CANCEL_BUTTON'
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
        this.usersService
          .deleteUser(user.id, user.tenantId ?? this.defaultTenant)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              const successBody = this.translate.instant(
                'USERS.MESSAGES.DELETE_SUCCESS'
              );
              Swal.fire(title, successBody, 'success');
              const nextPage = this.calculatePageAfterDeletion();
              this.loadUsers(nextPage);
            },
            error: (error: Error) => {
              const fallbackBody = this.translate.instant(
                'USERS.MESSAGES.ERROR_BODY'
              );
              const body = error.message || fallbackBody;
              Swal.fire(
                this.translate.instant('USERS.MESSAGES.ERROR_TITLE'),
                body,
                'error'
              );
            },
          });
      } else if (result.dismiss === 'cancel') {
        const cancelBody = this.translate.instant(
          'USERS.MESSAGES.DELETE_CANCELLED'
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

  changePageSize(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const value = target?.value ?? '';
    const parsed = parseInt(value, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      this.pageSize = parsed;
      this.loadUsers(1);
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage && !this.loadingUsers) {
      this.loadUsers(this.page - 1);
    }
  }

  nextPage(): void {
    if (this.hasNextPage && !this.loadingUsers) {
      this.loadUsers(this.page + 1);
    }
  }

  trackByUserId(_: number, user: User): string {
    return user.id;
  }

  getGenderLabel(gender?: string | null): string {
    if (!gender) {
      return this.translate.instant('USERS.FORM.GENDER_OPTIONS.OTHER');
    }

    const normalized = gender.trim().toUpperCase();
    const validKeys = ['MALE', 'FEMALE', 'OTHER'];
    const key = validKeys.includes(normalized) ? normalized : 'OTHER';
    return this.translate.instant(`USERS.FORM.GENDER_OPTIONS.${key}`);
  }

  private loadRoles(): void {
    this.rolesLoading = true;
    this.usersService
      .getRoles()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.rolesLoading = false;
        })
      )
      .subscribe({
        next: (roles) => {
          this.roles = roles;
          this.rolesError = undefined;
        },
        error: (error: Error) => {
          this.rolesError =
            error.message ||
            this.translate.instant('USERS.MESSAGES.ROLES_LOAD_ERROR');
        },
      });
  }

  private watchSearchChanges(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadUsers(1);
      });
  }

  private loadUsers(page: number): void {
    const search = this.searchControl.value?.trim() || null;
    this.loadingUsers = true;

    this.usersService
      .getUsers(page, this.pageSize, search)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingUsers = false;
        })
      )
      .subscribe({
        next: (collection) => {
          this.users = collection.nodes;
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
            'USERS.MESSAGES.LOAD_ERROR_TITLE'
          );
          const fallbackBody = this.translate.instant(
            'USERS.MESSAGES.LOAD_ERROR_BODY'
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

  private getFullName(user: User): string {
    return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  }
}
