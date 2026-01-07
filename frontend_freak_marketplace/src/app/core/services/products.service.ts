import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  Product, 
  ProductFilters, 
  ProductCreateRequest, 
  ProductUpdateRequest, 
  PaginatedProductsResponse 
} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private apiService: ApiService) {}

  getProducts(filters?: ProductFilters): Observable<PaginatedProductsResponse> {
    return this.apiService.get<PaginatedProductsResponse>('/products/products/', filters);
  }

  getProduct(id: string): Observable<Product> {
    return this.apiService.get<Product>(`/products/products/${id}/`);
  }

  getMyProducts(filters?: ProductFilters): Observable<PaginatedProductsResponse> {
    return this.apiService.get<PaginatedProductsResponse>('/products/my-products/', filters);
  }

  createProduct(product: ProductCreateRequest): Observable<Product> {
    return this.apiService.post<Product>('/products/create/', product);
  }

  updateProduct(id: string, product: ProductUpdateRequest): Observable<Product> {
    return this.apiService.patch<Product>(`/products/update/${id}/`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.apiService.delete<void>(`/products/delete/${id}/`);
  }

  uploadImages(files: File[]): Observable<{ urls: string[] }> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    return this.apiService.upload<{ urls: string[] }>('/products/upload-images/', formData);
  }

  searchProducts(query: string, filters?: ProductFilters): Observable<PaginatedProductsResponse> {
    const searchFilters = { ...filters, search: query };
    return this.getProducts(searchFilters);
  }

  getProductsByCategory(categoryId: string, filters?: ProductFilters): Observable<PaginatedProductsResponse> {
    const categoryFilters = { ...filters, category: categoryId };
    return this.getProducts(categoryFilters);
  }

  getBoostedProducts(): Observable<PaginatedProductsResponse> {
    return this.getProducts({ boost_type: 'NEON' });
  }
}
