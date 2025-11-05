import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  PasswordSetupInfo,
  PasswordSetupService,
} from '../../core/service/password-setup.service';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-setup-password',
  templateUrl: './setup-password.component.html',
  styleUrls: ['./setup-password.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class SetupPasswordComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loading = false;
  submitting = false;
  error?: string;
  token?: string;
  userId?: string;
  info?: PasswordSetupInfo;
  private subscription = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly passwordSetupService: PasswordSetupService
  ) { }

  ngOnInit(): void {
    console.log('[SetupPasswordComponent] ngOnInit start');
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.subscription.add(
      combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
        ([paramMap, queryParamMap]) => {
          const tokenCandidate =
            paramMap.get('token') ??
            queryParamMap.get('token') ??
            queryParamMap.get('id');
          const userIdCandidate =
            queryParamMap.get('userId') ??
            paramMap.get('userId') ??
            queryParamMap.get('user');

          const fallbackToken =
            tokenCandidate ??
            this.getQueryParamFromLocation('token') ??
            this.getQueryParamFromLocation('id');
          const fallbackUserId =
            userIdCandidate ??
            this.getQueryParamFromLocation('userId') ??
            this.getQueryParamFromLocation('user');

          console.log('[SetupPasswordComponent] Resolved params', {
            tokenCandidate,
            userIdCandidate,
            fallbackToken,
            fallbackUserId,
            fullUrl: this.router.url,
            locationHref:
              typeof window !== 'undefined' ? window.location.href : 'N/A',
          });

          if (!fallbackToken && !fallbackUserId) {
            console.warn(
              '[SetupPasswordComponent] Missing token and userId after fallback. Staying on page and showing error.'
            );
            this.error = 'No se pudo validar el enlace. Verifica que sea correcto.';
            this.loading = false;
            return;
          }

          this.token = fallbackToken ?? undefined;
          this.userId = fallbackUserId ?? undefined;
          console.log(
            '[SetupPasswordComponent] Stored identifiers',
            'token:',
            this.token,
            'userId:',
            this.userId
          );
          this.fetchInfo();
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private fetchInfo(): void {
    if (!this.token && !this.userId) {
      console.warn(
        '[SetupPasswordComponent] fetchInfo called without identifiers even after fallback.'
      );
      this.error =
        'No se pudo validar el enlace. Verifica que el token o identificador sea correcto.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = undefined;
    console.log(
      '[SetupPasswordComponent] Fetching info with',
      'token:',
      this.token,
      'userId:',
      this.userId
    );
    this.subscription.add(
      this.passwordSetupService
        .getInfo(this.token ?? null, this.userId ?? null)
        .subscribe({
          next: (info) => {
            console.log(
              '[SetupPasswordComponent] Password info loaded successfully',
              info
            );
            this.info = info;
            this.loading = false;
          },
          error: (err) => {
            console.error(
              '[SetupPasswordComponent] Failed to load password info',
              err
            );
            this.error =
              typeof err === 'string'
                ? err
                : 'El enlace no es valido o ha expirado.';
            this.loading = false;
          },
        })
    );
  }

  submit(): void {
    console.log('[SetupPasswordComponent] submit called');
    if (this.form.invalid || !this.info) {
      console.warn(
        '[SetupPasswordComponent] submit aborted. Form invalid or info missing.',
        { formValid: this.form.valid, hasInfo: !!this.info }
      );
      this.form.markAllAsTouched();
      return;
    }

    const password = this.form.get('password')?.value as string;
    const confirmPassword = this.form.get('confirmPassword')?.value as string;

    if (password !== confirmPassword) {
      console.warn(
        '[SetupPasswordComponent] submit aborted. Password mismatch.',
        { passwordLength: password?.length, confirmPasswordLength: confirmPassword?.length }
      );
      this.error = 'Las contrasenas no coinciden.';
      return;
    }

    this.submitting = true;
    this.error = undefined;
    console.log('[SetupPasswordComponent] Submitting password setup request');

    this.subscription.add(
      this.passwordSetupService
        .complete({
          token: this.token ?? null,
          userId: this.userId ?? null,
          password,
          confirmPassword,
        })
        .subscribe({
          next: () => {
            console.log(
              '[SetupPasswordComponent] Password setup completed. Redirecting to signin.'
            );
            this.submitting = false;
            this.router.navigate(['/authentication/signin'], {
              queryParams: { setup: 'success' },
            });
          },
          error: (err) => {
            console.error(
              '[SetupPasswordComponent] Password setup failed',
              err
            );
            this.error =
              typeof err === 'string'
                ? err
                : 'No se pudo guardar la contrasena. Intenta nuevamente.';
            this.submitting = false;
          },
        })
    );
  }

  private getQueryParamFromLocation(key: string): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const candidates: string[] = [];
    const search = window.location.search;
    if (search && search.length > 1) {
      candidates.push(search.substring(1));
    }

    const hash = window.location.hash ?? '';
    const hashQueryIndex = hash.indexOf('?');
    if (hashQueryIndex >= 0 && hashQueryIndex < hash.length - 1) {
      candidates.push(hash.substring(hashQueryIndex + 1));
    }

    for (const segment of candidates) {
      const params = new URLSearchParams(segment);
      const value = params.get(key);
      if (value) {
        return value;
      }
    }

    return null;
  }
}
