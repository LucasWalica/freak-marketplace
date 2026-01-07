import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  imports: [TruncatePipe , CommonModule]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showActions: boolean = true;
  @Output() productClick = new EventEmitter<Product>();
  @Output() editClick = new EventEmitter<Product>();
  @Output() deleteClick = new EventEmitter<Product>();

  constructor() { }

  onProductClick(): void {
    this.productClick.emit(this.product);
  }

  onEditClick(event: Event): void {
    event.stopPropagation();
    this.editClick.emit(this.product);
  }

  protected readonly Object = Object;

  // Getter para limpiar el HTML
  get hasSpecs(): boolean {
    return this.getSpecificationKeys().length > 0;
  }

  onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.deleteClick.emit(this.product);
  }

  getBoostClass(): string {
    if (this.product.is_boost_active) {
      switch (this.product.boost_type) {
        case 'NEON':
          return 'animate-glow border-neon';
        case 'GOLD':
          return 'border-gold bg-gradient-to-br from-yellow-50 to-yellow-100';
        default:
          return '';
      }
    }
    return '';
  }

  getStatusClass(): string {
    switch (this.product.status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800';
      case 'SOLD':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(): string {
    switch (this.product.status) {
      case 'AVAILABLE':
        return 'Disponible';
      case 'RESERVED':
        return 'Reservado';
      case 'SOLD':
        return 'Vendido';
      default:
        return 'Desconocido';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getSpecificationKeys(): string[] {
    return this.product.specifications ? Object.keys(this.product.specifications) : [];
  }
}
