import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/pages/home/home.component').then(m => m.HomeComponent),
    title: 'Inicio'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    title: 'Dashboard'
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/pages/product-list/product-list.component').then(m => m.ProductListComponent),
    title: 'Productos'
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./features/products/pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'Detalle del Producto'
  },
  {
    path: 'products/create',
    loadComponent: () => import('./features/products/pages/product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [AuthGuard],
    title: 'Crear Producto'
  },
  {
    path: 'products/:id/edit',
    loadComponent: () => import('./features/products/pages/product-form/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [AuthGuard],
    title: 'Editar Producto'
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/pages/category-list/category-list.component').then(m => m.CategoryListComponent),
    title: 'Categorías'
  },
  {
    path: 'chat',
    loadComponent: () => import('./features/chat/pages/chat-list/chat-list.component').then(m => m.ChatListComponent),
    canActivate: [AuthGuard],
    title: 'Chat'
  },
  {
    path: 'chat/:roomId',
    loadComponent: () => import('./features/chat/pages/chat-room/chat-room.component').then(m => m.ChatRoomComponent),
    canActivate: [AuthGuard],
    title: 'Sala de Chat'
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./features/profile/pages/public-profile/public-profile.component').then(m => m.PublicProfileComponent),
    title: 'Perfil Público'
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/pages/my-profile/my-profile.component').then(m => m.MyProfileComponent),
    canActivate: [AuthGuard],
    title: 'Mi Perfil'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
