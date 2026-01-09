import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { passwordStrengthValidator, usernameValidator, urlValidator, matchingFieldsValidator } from '../../../../core/validators/common.validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [usernameValidator()]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrengthValidator()]],
      password2: ['', [Validators.required, matchingFieldsValidator('password')]],
      first_name: ['', [Validators.maxLength(30)]],
      last_name: ['', [Validators.maxLength(30)]]
    });
  }


  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.registerForm.value;
    
    this.authService.register(formData).subscribe({
      next: (response) => {
        this.successMessage = 'Registro exitoso. Redirigiendo al login...';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error) {
      // Handle field-specific errors
      if (typeof error.error === 'object') {
        const errors = [];
        if (error.error.username) errors.push(`Usuario: ${error.error.username.join(', ')}`);
        if (error.error.email) errors.push(`Email: ${error.error.email.join(', ')}`);
        if (error.error.password) errors.push(`Contraseña: ${error.error.password.join(', ')}`);
        if (error.error.non_field_errors) errors.push(error.error.non_field_errors.join(', '));
        if (errors.length > 0) return errors.join(' | ');
      }
      // Handle single error message
      if (error.error.detail) return error.error.detail;
      if (error.error.error) return error.error.error;
    }
    return 'Error en el registro. Inténtalo nuevamente.';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  // Helper methods for template
  get usernameControl() { return this.registerForm.get('username'); }
  get emailControl() { return this.registerForm.get('email'); }
  get passwordControl() { return this.registerForm.get('password'); }
  get password2Control() { return this.registerForm.get('password2'); }
  get firstNameControl() { return this.registerForm.get('first_name'); }
  get lastNameControl() { return this.registerForm.get('last_name'); }
}
