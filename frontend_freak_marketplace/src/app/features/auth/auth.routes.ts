import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Iniciar Sesión'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Registrarse'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
