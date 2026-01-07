import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private apiService: ApiService) {}

  getCategories(): Observable<Category[]> {
    return this.apiService.get<Category[]>('/categories/');
  }

  getCategory(id: string): Observable<Category> {
    return this.apiService.get<Category>(`/categories/${id}/`);
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    return this.apiService.get<Category[]>(`/categories/`).pipe(
      map((categories: Category[]) => 
        categories.find(category => category.slug === slug)
      )
    );
  }

  getFeaturedCategories(): Observable<Category[]> {
    return this.getCategories().pipe(
      // We'll implement featured logic later
      map((categories: Category[]) => categories.slice(0, 6)) // Just first 6 for now
    );
  }
}
