import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../../core/services/products.service';
import { Product } from '../../../../core/models/product.model';
import { AuthService } from '../../../../core/services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  error = '';
  isOwner = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    } else {
      this.error = 'Producto no encontrado';
      this.isLoading = false;
    }
  }

  loadProduct(id: string): void {
    this.productsService.getProduct(id).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.checkOwnership();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = 'Error al cargar el producto';
        this.isLoading = false;
        console.error('Error loading product:', error);
      }
    });
  }

  checkOwnership(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(currentUser => {
      if (this.product && currentUser) {
        this.isOwner = this.product.seller?.id === currentUser.id;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  contactSeller(): void {
    // TODO: Implementar contacto con vendedor
    console.log('Contactar vendedor');
  }

  editProduct(): void {
    if (this.product) {
      this.router.navigate(['/products', this.product.id, 'edit']);
    }
  }
}
