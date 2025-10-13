import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { Country } from '../../shared/models/country.model';
import { RegisterUserRequest } from '../../shared/models/user.model';
import { CountryService } from '../../shared/services/country.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.scss'
})
export class UserRegistrationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly countryService = inject(CountryService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  private countryBlurTimeout: ReturnType<typeof setTimeout> | null = null;

  private readonly birthDateValidator: ValidatorFn = (control) => {
    const value = control.value as string | null;

    if (!value) {
      return null;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return { invalidDate: true };
    }

    const today = new Date();
    if (parsed > today) {
      return { futureDate: true };
    }

    if (parsed.getFullYear() < 1900) {
      return { minDate: true };
    }

    return null;
  };

  readonly form = this.fb.group({
    firstName: this.fb.control('', [Validators.required, Validators.maxLength(100)]),
    lastName: this.fb.control('', [Validators.required, Validators.maxLength(100)]),
    email: this.fb.control('', [Validators.required, Validators.email, Validators.maxLength(256)]),
    phoneNumber: this.fb.control('', [Validators.pattern(/^[0-9+\-\s]*$/)]),
    identification: this.fb.control('', [Validators.maxLength(50)]),
    country: this.fb.control('', [Validators.maxLength(100)]),
    gender: this.fb.control('female', [Validators.required]),
    dateOfBirth: this.fb.control('', [Validators.required, this.birthDateValidator])
  });

  readonly genderOptions = ['female', 'male', 'nonBinary', 'other'];

  readonly calculatedAge = signal<number | null>(null);
  readonly isSubmitting = signal(false);
  readonly isLoadingCountries = signal(false);
  readonly submitSuccess = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly countryResults = signal<Country[]>([]);
  readonly showCountryDropdown = signal(false);

  constructor() {
    const dateControl = this.form.get('dateOfBirth');
    dateControl
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.updateAge(value));

    const countryControl = this.form.get('country');
    countryControl
      ?.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          this.isLoadingCountries.set(true);
          this.showCountryDropdown.set(true);
          return this.countryService.search(value).pipe(
            catchError(() => of([] as Country[]))
          );
        })
      )
      .subscribe((results) => {
        this.countryResults.set(results);
        this.isLoadingCountries.set(false);

        if (!countryControl.value && results.length === 0) {
          this.showCountryDropdown.set(false);
        }
      });

    this.prefetchCountries();
  }

  submit(): void {
    this.submitError.set(null);
    this.submitSuccess.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: RegisterUserRequest = {
      firstName: this.form.value.firstName?.trim() ?? '',
      lastName: this.form.value.lastName?.trim() ?? '',
      email: this.form.value.email?.trim().toLowerCase() ?? '',
      phoneNumber: this.form.value.phoneNumber?.trim() || null,
      identification: this.form.value.identification?.trim() || null,
      country: this.form.value.country?.trim() || null,
      gender: this.form.value.gender ?? 'other',
      dateOfBirth: this.form.value.dateOfBirth ?? ''
    };

    this.isSubmitting.set(true);

    this.userService.registerUser(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitSuccess.set(true);
        this.form.reset({ gender: 'female' });
        this.calculatedAge.set(null);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        const message = error?.error?.message ?? this.translate.instant('userRegistration.error');
        this.submitError.set(message);
      }
    });
  }

  reset(): void {
    this.form.reset({ gender: 'female' });
    this.calculatedAge.set(null);
    this.submitSuccess.set(false);
    this.submitError.set(null);
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onCountryFocus(): void {
    if (this.countryBlurTimeout) {
      clearTimeout(this.countryBlurTimeout);
      this.countryBlurTimeout = null;
    }

    if (this.countryResults().length === 0) {
      this.fetchCountries(this.form.value.country ?? null);
    } else {
      this.showCountryDropdown.set(true);
    }
  }

  onCountryBlur(): void {
    if (this.countryBlurTimeout) {
      clearTimeout(this.countryBlurTimeout);
    }

    this.countryBlurTimeout = setTimeout(() => {
      this.showCountryDropdown.set(false);
    }, 150);
  }

  selectCountry(country: Country): void {
    if (this.countryBlurTimeout) {
      clearTimeout(this.countryBlurTimeout);
      this.countryBlurTimeout = null;
    }

    this.form.get('country')?.setValue(country.name);
    this.showCountryDropdown.set(false);
  }

  trackByCountry(_: number, item: Country): string {
    return item.code;
  }

  private updateAge(value: string | null): void {
    if (!value) {
      this.calculatedAge.set(null);
      return;
    }

    const birthDate = new Date(value);
    const today = new Date();

    if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
      this.calculatedAge.set(null);
      return;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    this.calculatedAge.set(age >= 0 ? age : null);
  }

  private prefetchCountries(): void {
    this.countryService
      .search(null)
      .pipe(
        take(1),
        catchError(() => of([] as Country[]))
      )
      .subscribe((results) => {
        this.countryResults.set(results);
      });
  }

  private fetchCountries(term: string | null): void {
    this.isLoadingCountries.set(true);
    this.countryService
      .search(term)
      .pipe(
        take(1),
        catchError(() => of([] as Country[]))
      )
      .subscribe((results) => {
        this.countryResults.set(results);
        this.isLoadingCountries.set(false);
        this.showCountryDropdown.set(results.length > 0);
      });
  }
}
