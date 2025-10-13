import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
import Swal from 'sweetalert2';
import { UsersService } from './users.service';
import { Country, RegisterUserRequest, Role, User } from './users.model';
import { finalize } from 'rxjs/operators';

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
export class UsersCreateDialogComponent implements OnInit {
  readonly form: FormGroup;

  countries: Country[] = [];
  submitting = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly usersService: UsersService,
    private readonly translate: TranslateService,
    private readonly dialogRef: MatDialogRef<
      UsersCreateDialogComponent,
      UsersCreateDialogResult
    >
  ) {
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
    });
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildRequestPayload();
    this.submitting = true;

    this.usersService
      .registerUser(payload)
      .pipe(
        finalize(() => {
          this.submitting = false;
        })
      )
      .subscribe({
        next: (user) => {
          this.dialogRef.close({ user });
        },
        error: (error: Error) => {
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
    } = this.form.value;

    return {
      firstName: (firstName ?? '').trim(),
      lastName: (lastName ?? '').trim(),
      email: (email ?? '').trim().toLowerCase(),
      phoneNumber: phoneNumber?.toString().trim() || undefined,
      identification: identification?.toString().trim() || undefined,
      country: country?.toString().trim() || undefined,
      gender: (gender ?? '').trim(),
      dateOfBirth: (dateOfBirth ?? '').toString(),
    };
  }
}
