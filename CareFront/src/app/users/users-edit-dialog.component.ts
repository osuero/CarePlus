import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
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
import { Country, User } from './users.model';
import { finalize } from 'rxjs/operators';

export interface UsersEditDialogData {
  user: User;
}

export interface UsersEditDialogResult {
  user?: User;
}

@Component({
  selector: 'app-users-edit-dialog',
  standalone: true,
  templateUrl: './users-edit-dialog.component.html',
  styleUrls: ['./users-edit-dialog.component.scss'],
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
export class UsersEditDialogComponent implements OnInit {
  readonly form: FormGroup;
  countries: Country[] = [];
  submitting = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly usersService: UsersService,
    private readonly translate: TranslateService,
    private readonly dialogRef: MatDialogRef<
      UsersEditDialogComponent,
      UsersEditDialogResult
    >,
    @Inject(MAT_DIALOG_DATA) readonly data: UsersEditDialogData
  ) {
    const user = data.user;
    this.form = this.fb.group({
      firstName: [user.firstName, [Validators.required, Validators.maxLength(100)]],
      lastName: [user.lastName, [Validators.required, Validators.maxLength(100)]],
      email: [user.email, [Validators.required, Validators.email, Validators.maxLength(256)]],
      phoneNumber: [user.phoneNumber ?? '', [Validators.maxLength(32)]],
      identification: [user.identification ?? '', [Validators.maxLength(50)]],
      country: [user.country ?? ''],
      gender: [user.gender, [Validators.required, Validators.maxLength(20)]],
      dateOfBirth: [user.dateOfBirth, [Validators.required]],
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

    this.submitting = true;
    this.usersService
      .updateUser(this.data.user.id, this.form.value)
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
          const errorTitle = this.translate.instant('USERS.MESSAGES.ERROR_TITLE');
          const fallbackBody = this.translate.instant('USERS.MESSAGES.ERROR_BODY');
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
    this.usersService.searchCountries().subscribe({
      next: (countries) => {
        this.countries = [...countries].sort((a, b) => a.name.localeCompare(b.name));
      },
      error: () => {
        const warning = this.translate.instant('USERS.MESSAGES.COUNTRIES_WARNING');
        console.warn(warning);
      },
    });
  }
}
