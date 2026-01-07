import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../../core/services/products.service';
import { CategoriesService } from '../../../../core/services/categories.service';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [CommonModule, ProductCardComponent, FormsModule]
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  isLoading = true;
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  selectedCategory: string = '';
  searchQuery: string = '';
  sortBy: string = '-created_at';
  priceRange: { min: number; max: number } = { min: 0, max: 10000 };

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (categories: any) => {
        this.categories = categories;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    const filters = {
      page: this.currentPage,
      category: this.selectedCategory,
      search: this.searchQuery,
      ordering: this.sortBy,
      price_min: this.priceRange.min,
      price_max: this.priceRange.max
    };

    this.productsService.getProducts(filters).subscribe({
      next: (response: any) => {
        this.products = response.results;
        this.totalPages = Math.ceil(response.count / 12);
        this.totalCount = response.count;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.loadProducts();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  onSortChange(sortBy: string): void {
    this.sortBy = sortBy;
    this.currentPage = 1;
    this.loadProducts();
  }

  onPriceRangeChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  get paginationArray(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }
}
