import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  showPassword = false;
  submitting = false;
  errorMessage = '';

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  get username() { return this.loginForm.controls.username; }
  get password() { return this.loginForm.controls.password; }

  submit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const { username, password, rememberMe } = this.loginForm.getRawValue();

    this.auth.login(username.trim(), password, rememberMe).subscribe({
      next: () => this.router.navigateByUrl('/home'),
      error: err => {
        this.submitting = false;
        this.errorMessage = err?.error?.message ?? 'Unable to sign in. Please try again.';
      }
    });
  }
}
