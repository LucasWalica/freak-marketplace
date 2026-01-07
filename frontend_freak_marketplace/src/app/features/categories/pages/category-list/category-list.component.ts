import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class CategoryListComponent {
  categories = [
    { id: 1, name: 'Electrónica', icon: '📱', product_count: 156 },
    { id: 2, name: 'Videojuegos', icon: '🎮', product_count: 89 },
    { id: 3, name: 'Coleccionables', icon: '🎯', product_count: 234 },
    { id: 4, name: 'Libros', icon: '📚', product_count: 67 },
    { id: 5, name: 'Ropa', icon: '👕', product_count: 145 },
    { id: 6, name: 'Accesorios', icon: '⚡', product_count: 198 }
  ];

  constructor() {}
}
