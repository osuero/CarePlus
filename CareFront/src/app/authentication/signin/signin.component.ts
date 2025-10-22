import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { AuthService, Role } from '@core';
import { LoginResult } from '@core/service/login.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  imports: [
    RouterLink,
    NgIf,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  rememberMe = false;
  error = '';
  hide = true;

  readonly demoAccounts: {
    role: Role;
    label: string;
    email: string;
    password: string;
  }[] = [
    {
      role: Role.Admin,
      label: 'Administrador (predeterminado)',
      email: 'admin@careplus.local',
      password: 'ChangeMe!123',
    },
  ];

  selectedDemoRole: Role | null = this.demoAccounts[0]?.role ?? null;
  get selectedDemoAccount() {
    return this.demoAccounts.find((demo) => demo.role === this.selectedDemoRole);
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['admin@careplus.local', [Validators.required, Validators.email]],
      password: ['ChangeMe!123', Validators.required],
    });

    this.applySelectedDemoAccount();
  }
  get f() {
    return this.authForm.controls;
  }
  onDemoRoleChange(role: Role | null) {
    this.selectedDemoRole = role;
    this.applySelectedDemoAccount();
  }

  private applySelectedDemoAccount() {
    if (!this.selectedDemoRole) {
      return;
    }

    const account = this.selectedDemoAccount;

    if (account) {
      this.authForm.patchValue({
        username: account.email,
        password: account.password,
      });
    }
  }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = '';
    if (this.authForm.invalid) {
      this.error = 'Debes ingresar un correo y contrasena validos.';
      return;
    } else {
      this.authService
        .login(this.f['username'].value, this.f['password'].value, false)
        .subscribe({
          next: (response: LoginResult) => {
            const roles = Array.isArray(response.user.roles)
              ? response.user.roles
              : [];
            const primaryRole =
              roles[0]?.name ?? response.user?.['roleName'] ?? Role.Admin;

            this.loading = false;
            if (primaryRole === Role.Admin) {
              this.router.navigate(['/admin/dashboard/main']);
            } else if (primaryRole === Role.Doctor) {
              this.router.navigate(['/doctor/dashboard']);
            } else if (primaryRole === Role.Patient) {
              this.router.navigate(['/patient/dashboard']);
            } else {
              this.router.navigate(['/authentication/signin']);
            }
            this.loading = false;
          },
          error: (error: string) => {
            this.error = error;
            this.submitted = false;
            this.loading = false;
          },
        });
    }
  }

  signInWithGoogle(): void {
    console.log('Login with Google');
    // Add OAuth logic here
  }

  signInWithFacebook(): void {
    console.log('Login with Facebook');
    // Add OAuth logic here
  }

  signInWithApple(): void {
    console.log('Login with Apple');
    // Add OAuth logic here
  }
}
