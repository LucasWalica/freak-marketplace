import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { LoginRequest, RegisterRequest, AuthResponse, User, Profile, ProfileCreateRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private currentProfileSubject = new BehaviorSubject<Profile | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public currentProfile$ = this.currentProfileSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    // Con cookies, verificamos el estado de autenticación haciendo una llamada al backend
    this.getProfile().subscribe({
      next: (profile) => {
        // Si obtenemos el perfil, estamos autenticados
        this.isAuthenticatedSubject.next(true);
        this.currentProfileSubject.next(profile);
        // Obtenemos los datos del usuario
        this.currentUserSubject.next(profile.user);
      },
      error: () => {
        // Si hay error, no estamos autenticados
        this.clearAuthData();
      }
    });
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/users/login/', credentials).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/users/register/', userData).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      })
    );
  }

  logout(): void {
    this.apiService.post('/users/logout/', {}).subscribe({
      next: () => {
        this.clearAuthData();
      },
      error: () => {
        this.clearAuthData();
      }
    });
  }

  createProfile(profileData: ProfileCreateRequest): Observable<Profile> {
    return this.apiService.post<Profile>('/users/profile/create/', profileData).pipe(
      tap(profile => {
        this.currentProfileSubject.next(profile);
      })
    );
  }

  getProfile(): Observable<Profile> {
    return this.apiService.get<Profile>('/users/profile/me/').pipe(
      tap(profile => {
        this.currentProfileSubject.next(profile);
      })
    );
  }

  updateProfile(profileData: Partial<ProfileCreateRequest>): Observable<Profile> {
    return this.apiService.patch<Profile>('/users/profile/me/', profileData).pipe(
      tap(profile => {
        this.currentProfileSubject.next(profile);
      })
    );
  }

  getPublicProfile(profileId: string): Observable<Profile> {
    return this.apiService.get<Profile>(`/users/profile/${profileId}/`);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    // Las cookies son manejadas automáticamente por el navegador a través de las respuestas HTTP
    // Solo actualizamos el estado
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
    
    this.loadProfile();
  }

  private loadProfile(): void {
    this.getProfile().subscribe({
      error: () => {
        // Profile might not exist yet, that's okay
      }
    });
  }

  private clearAuthData(): void {
    // Con cookies, solo limpiamos el estado del cliente
    this.currentUserSubject.next(null);
    this.currentProfileSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  // Los tokens ahora están en cookies, manejadas por el navegador
  getAccessToken(): string | null {
    return null; // No necesitamos acceder al token directamente
  }

  getRefreshToken(): string | null {
    return null; // No necesitamos acceder al token directamente
  }

  refreshToken(): Observable<any> {
    // El refresh token también está en la cookie
    return this.apiService.post('/users/refresh/', {});
  }
}
