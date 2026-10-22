import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  showPassword = false;
  showConfirmPassword = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  readonly registerForm = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  get displayName() { return this.registerForm.controls.displayName; }
  get username() { return this.registerForm.controls.username; }
  get password() { return this.registerForm.controls.password; }
  get confirmPassword() { return this.registerForm.controls.confirmPassword; }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const value = this.registerForm.getRawValue();
    if (value.password !== value.confirmPassword) {
      this.confirmPassword.setErrors({ mismatch: true });
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.submitting = true;
    this.auth.register(value.username.trim(), value.password, value.displayName.trim()).subscribe({
      next: response => {
        this.submitting = false;
        this.successMessage = response.message;
        setTimeout(() => this.router.navigateByUrl('/login'), 800);
      },
      error: err => {
        this.submitting = false;
        this.errorMessage = err?.error?.message ?? 'Unable to create the account.';
      }
    });
  }
}
