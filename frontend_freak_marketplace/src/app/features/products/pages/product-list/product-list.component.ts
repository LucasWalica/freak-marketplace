import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductsService } from '../../../../core/services/products.service';
import { Product, ProductFilter } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  errorMessage = '';
  currentPage = 1;
  totalPages = 1;
  hasNext = false;
  hasPrevious = false;

  filterForm: FormGroup;
  searchQuery = '';

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      status: [''],
      boost_type: [''],
      min_price: [null],
      max_price: [null],
      ordering: ['-created_at']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page: number = 1): void {
    this.isLoading = true;
    this.errorMessage = '';

    const filters = this.getFilters();
    
    this.productsService.getProducts(filters).subscribe({
      next: (response) => {
        this.products = response.results;
        this.currentPage = page;
        this.totalPages = Math.ceil(response.count / 12); // Assuming 12 items per page
        this.hasNext = response.next !== null;
        this.hasPrevious = page > 1;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar productos. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  getFilters(): ProductFilter {
    const formValues = this.filterForm.value;
    const filters: ProductFilter = {};

    if (formValues.category) filters.category = formValues.category;
    if (formValues.status) filters.status = formValues.status;
    if (formValues.boost_type) filters.boost_type = formValues.boost_type;
    if (formValues.min_price) filters.min_price = formValues.min_price;
    if (formValues.max_price) filters.max_price = formValues.max_price;
    if (formValues.ordering) filters.ordering = formValues.ordering;
    if (this.searchQuery) filters.search = this.searchQuery;

    return filters;
  }

  onFilterChange(): void {
    this.loadProducts(1); // Reset to first page when filters change
  }

  onSearch(): void {
    this.loadProducts(1);
  }

  onPreviousPage(): void {
    if (this.hasPrevious) {
      this.loadProducts(this.currentPage - 1);
    }
  }

  onNextPage(): void {
    if (this.hasNext) {
      this.loadProducts(this.currentPage + 1);
    }
  }

  onProductClick(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }

  onCreateProduct(): void {
    this.router.navigate(['/products/create']);
  }

  onBoostedProducts(): void {
    this.router.navigate(['/products/boosted']);
  }
}
