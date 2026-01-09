import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { Observable } from 'rxjs';

// Si tienes una interfaz de User, impórtala, si no, usamos any
interface User {
  username: string;
  avatar_url?: string;
  // añade otros campos si los necesitas
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<User | null>; // Añadimos esta línea

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    // Obtenemos el usuario actual desde el servicio
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    // Aquí podrías cargar estadísticas reales desde un servicio si lo tuvieras
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  navigateToProducts(): void {
    this.router.navigate(['/products/my-products']); // O la ruta que tengas para "Mis Productos"
  }

  navigateToChat(): void {
    this.router.navigate(['/chat']);
  }
}