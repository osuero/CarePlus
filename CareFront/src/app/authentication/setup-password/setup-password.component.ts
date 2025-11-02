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
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.subscription.add(
      combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
        ([paramMap, queryParamMap]) => {
          const token =
            paramMap.get('token') ??
            queryParamMap.get('token') ??
            queryParamMap.get('id');
          const userId =
            queryParamMap.get('userId') ??
            paramMap.get('userId') ??
            queryParamMap.get('user');

          if (!token && !userId) {
            this.router.navigate(['/authentication/signin']);
            return;
          }

          this.token = token ?? undefined;
          this.userId = userId ?? undefined;
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
      this.router.navigate(['/authentication/signin']);
      return;
    }

    this.loading = true;
    this.error = undefined;
    this.subscription.add(
      this.passwordSetupService
        .getInfo(this.token ?? null, this.userId ?? null)
        .subscribe({
          next: (info) => {
            this.info = info;
            this.loading = false;
        },
        error: (err) => {
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
    if (this.form.invalid || !this.info) {
      this.form.markAllAsTouched();
      return;
    }

    const password = this.form.get('password')?.value as string;
    const confirmPassword = this.form.get('confirmPassword')?.value as string;

    if (password !== confirmPassword) {
      this.error = 'Las contrasenas no coinciden.';
      return;
    }

    this.submitting = true;
    this.error = undefined;

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
            this.submitting = false;
            this.router.navigate(['/authentication/signin'], {
              queryParams: { setup: 'success' },
            });
          },
          error: (err) => {
            this.error =
              typeof err === 'string'
                ? err
                : 'No se pudo guardar la contrasena. Intenta nuevamente.';
            this.submitting = false;
          },
        })
    );
  }
}

