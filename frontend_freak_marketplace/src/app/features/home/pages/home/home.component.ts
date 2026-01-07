import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../../core/services/categories.service';
import { ProductsService } from '../../../../core/services/products.service';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [ProductCardComponent, CommonModule]
})
export class HomeComponent implements OnInit {
  featuredProducts: any[] = [];
  categories: any[] = [];
  isLoading = true;

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    // Cargar categorías destacadas
    this.categoriesService.getFeaturedCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });

    // Cargar productos destacados (boosted)
    this.productsService.getBoostedProducts().subscribe({
      next: (response) => {
        this.featuredProducts = response.results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }
}
