import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { User, Profile } from '../../../../core/models/user.model';
import { urlValidator } from '../../../../core/validators/common.validators';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class MyProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  currentUser: User | null = null;
  currentProfile: Profile | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      bio: ['', [Validators.maxLength(500)]],
      avatar_url: ['', [urlValidator()]]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.isLoading = true;
    
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Load profile data
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.currentProfile = profile;
        this.profileForm.patchValue({
          bio: profile.bio || '',
          avatar_url: profile.avatar_url || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.errorMessage = 'Error al cargar el perfil. Por favor intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.profileForm.value;
    
    this.authService.updateProfile(formData).subscribe({
      next: (updatedProfile) => {
        this.currentProfile = updatedProfile;
        this.successMessage = 'Perfil actualizado exitosamente.';
        this.isLoading = false;
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Profile update error:', error);
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error) {
      if (typeof error.error === 'object') {
        const errors = [];
        if (error.error.bio) errors.push(`Bio: ${error.error.bio.join(', ')}`);
        if (error.error.avatar_url) errors.push(`Avatar URL: ${error.error.avatar_url.join(', ')}`);
        if (error.error.non_field_errors) errors.push(error.error.non_field_errors.join(', '));
        if (errors.length > 0) return errors.join(' | ');
      }
      if (error.error.detail) return error.error.detail;
      if (error.error.error) return error.error.error;
    }
    return 'Error al actualizar el perfil. Inténtalo nuevamente.';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
  }

  // Helper methods for template
  get bioControl() { return this.profileForm.get('bio'); }
  get avatarUrlControl() { return this.profileForm.get('avatar_url'); }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
