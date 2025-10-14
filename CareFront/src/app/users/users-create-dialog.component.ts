import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { UsersService } from './users.service';
import { Country, RegisterUserRequest, Role, User } from './users.model';
import { finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface UsersCreateDialogResult {
  user?: User;
}

@Component({
  selector: 'app-users-create-dialog',
  standalone: true,
  templateUrl: './users-create-dialog.component.html',
  styleUrls: ['./users-create-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
  ],
})
export class UsersCreateDialogComponent implements OnInit, OnDestroy {
  readonly form: FormGroup;

  countries: Country[] = [];
  submitting = false;
  roles: Role[] = [];
  rolesLoading = false;
  rolesError?: string;
  private readonly defaultRoleDefinitions: Array<Pick<Role, 'id' | 'name' | 'description'>> = [
    {
      id: '7B65C5F7-8B06-4F97-92F1-9F81E1F66D26',
      name: 'Administrator',
      description: 'Global administrator role',
    },
    {
      id: 'A2A4F51F-2A7C-4B8E-94E6-4E6E1B4B19D3',
      name: 'Doctor',
      description: 'Global doctor role',
    },
  ];

  readonly tenants: string[];
  readonly defaultTenant: string;

  private readonly rolesCache = new Map<string, Role[]>();
  private tenantSubscription?: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly usersService: UsersService,
    private readonly translate: TranslateService,
    private readonly dialogRef: MatDialogRef<
      UsersCreateDialogComponent,
      UsersCreateDialogResult
    >
  ) {
    const normalizedDefaultTenant =
      this.normalizeTenant(environment.tenantId) ?? 'default';
    const tenantCandidates = Array.isArray(environment.tenants)
      ? environment.tenants
      : [environment.tenantId];

    const normalizedTenants = [
      normalizedDefaultTenant,
      ...tenantCandidates
        .map((tenant) => this.normalizeTenant(tenant))
        .filter((tenant): tenant is string => !!tenant),
    ].filter((tenant, index, self) => self.indexOf(tenant) === index);

    this.defaultTenant = normalizedDefaultTenant;
    this.tenants = normalizedTenants;

    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(256)],
      ],
      phoneNumber: ['', [Validators.maxLength(32)]],
      identification: ['', [Validators.maxLength(50)]],
      country: [''],
      gender: ['', [Validators.required, Validators.maxLength(20)]],
      dateOfBirth: ['', [Validators.required]],
      tenantId: [
        this.defaultTenant,
        [Validators.required, Validators.maxLength(100)],
      ],
      roleId: [''],
    });
  }

  ngOnInit(): void {
    this.loadCountries();
    const initialTenant = this.getSelectedTenant();
    this.loadRolesForTenant(initialTenant);
    this.watchTenantChanges();
  }

  ngOnDestroy(): void {
    this.tenantSubscription?.unsubscribe();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildRequestPayload();
    console.log('[UsersCreateDialog] Submitting user payload', payload);
    this.submitting = true;

    this.usersService
      .registerUser(payload, payload.tenantId ?? this.defaultTenant)
      .pipe(
        finalize(() => {
          this.submitting = false;
        })
      )
      .subscribe({
        next: (user) => {
          console.log('[UsersCreateDialog] User created successfully', user);
          this.dialogRef.close({ user });
        },
        error: (error: Error) => {
          console.error('[UsersCreateDialog] Failed to create user', error);
          const errorTitle = this.translate.instant(
            'USERS.MESSAGES.ERROR_TITLE'
          );
          const fallbackBody = this.translate.instant(
            'USERS.MESSAGES.ERROR_BODY'
          );
          const body = error.message || fallbackBody;
          Swal.fire(errorTitle, body, 'error');
        },
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  getGenderLabel(key: 'MALE' | 'FEMALE' | 'OTHER'): string {
    return this.translate.instant(`USERS.FORM.GENDER_OPTIONS.${key}`);
  }

  trackByCountryCode(_: number, country: Country): string {
    return country.code;
  }

  trackByRoleId(_: number, role: Role): string {
    return role.id;
  }

  private loadCountries(): void {
    this.usersService
      .searchCountries()
      .subscribe({
        next: (countries) => {
          this.countries = [...countries].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        },
        error: () => {
          const warning = this.translate.instant(
            'USERS.MESSAGES.COUNTRIES_WARNING'
          );
          console.warn(warning);
        },
      });
  }

  private buildRequestPayload(): RegisterUserRequest {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      identification,
      country,
      gender,
      dateOfBirth,
      tenantId,
      roleId,
    } = this.form.value;

    const selectedTenant = this.normalizeTenant(tenantId) ?? this.defaultTenant;
    const selectedRole = (roleId ?? '').toString().trim();

    return {
      firstName: (firstName ?? '').trim(),
      lastName: (lastName ?? '').trim(),
      email: (email ?? '').trim().toLowerCase(),
      phoneNumber: phoneNumber?.toString().trim() || undefined,
      identification: identification?.toString().trim() || undefined,
      country: country?.toString().trim() || undefined,
      gender: (gender ?? '').trim(),
      dateOfBirth: (dateOfBirth ?? '').toString(),
      tenantId: selectedTenant,
      roleId: selectedRole || undefined,
    };
  }

  private watchTenantChanges(): void {
    const tenantControl = this.form.get('tenantId');
    if (!tenantControl) {
      return;
    }

    this.tenantSubscription = tenantControl.valueChanges.subscribe((value) => {
      const tenant = this.normalizeTenant(value) ?? this.defaultTenant;
      this.loadRolesForTenant(tenant);
    });
  }

  private loadRolesForTenant(tenantId: string): void {
    const normalizedTenant = this.normalizeTenant(tenantId) ?? this.defaultTenant;

    if (this.rolesCache.has(normalizedTenant)) {
      this.roles = this.rolesCache.get(normalizedTenant)!;
      this.rolesError = undefined;
      this.ensureRoleSelection();
      return;
    }

    this.rolesLoading = true;
    this.usersService
      .getRoles(normalizedTenant)
      .pipe(
        finalize(() => {
          this.rolesLoading = false;
        })
      )
      .subscribe({
        next: (roles) => {
          const sorted = [...roles].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          const merged = this.mergeRolesWithDefaults(sorted, normalizedTenant);
          console.log(
            '[UsersCreateDialog] Roles loaded',
            normalizedTenant,
            merged
          );
          this.rolesCache.set(normalizedTenant, merged);
          this.roles = merged;
          this.rolesError = undefined;
          this.ensureRoleSelection();
        },
        error: (error: Error) => {
          console.error(
            '[UsersCreateDialog] Failed to load roles',
            normalizedTenant,
            error
          );
          this.rolesError =
            error.message ||
            this.translate.instant('USERS.MESSAGES.ROLES_LOAD_ERROR');
          this.roles = this.buildDefaultRoles(normalizedTenant);
          this.form.get('roleId')?.setValue('');
        },
      });
  }

  private ensureRoleSelection(): void {
    const roleControl = this.form.get('roleId');
    if (!roleControl) {
      return;
    }

    const selectedRole = (roleControl.value ?? '').toString().trim();
    if (!selectedRole) {
      return;
    }

    const roleExists = this.roles.some((role) => role.id === selectedRole);
    if (!roleExists) {
      roleControl.setValue('');
    }
  }

  private getSelectedTenant(): string {
    const tenantControl = this.form.get('tenantId');
    return this.normalizeTenant(tenantControl?.value) ?? this.defaultTenant;
  }

  private buildDefaultRoles(tenantId: string): Role[] {
    return this.defaultRoleDefinitions.map((role) => ({
      ...role,
      tenantId,
      isGlobal: true,
    }));
  }

  private mergeRolesWithDefaults(roles: Role[], tenantId: string): Role[] {
    const merged = new Map<string, Role>();

    roles.forEach((role) => {
      merged.set(role.id, { ...role });
    });

    this.buildDefaultRoles(tenantId).forEach((defaultRole) => {
      if (!merged.has(defaultRole.id)) {
        merged.set(defaultRole.id, defaultRole);
      }
    });

    return Array.from(merged.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  private normalizeTenant(value: unknown): string | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }
}
