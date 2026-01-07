import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductDetailComponent {
  constructor(private route: ActivatedRoute) {
    // Por ahora, solo mostraremos un mensaje simple
  }

  ngOnInit(): void {
    console.log('Product detail component loaded');
  }
}
