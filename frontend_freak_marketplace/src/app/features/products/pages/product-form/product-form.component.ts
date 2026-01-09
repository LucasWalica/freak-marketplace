import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// Servicios
import { ProductsService } from '../../../../core/services/products.service';
import { CategoriesService } from '../../../../core/services/categories.service';

// Modelos
import { ProductCreateRequest, ProductUpdateRequest, Category, Product } from '../../../../core/models/product.model';

// Componentes
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['product-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImageUploadComponent]
})
export class ProductFormComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  categories: Category[] = [];
  existingImages: string[] = [];
  
  // Para limpiar suscripciones al destruir el componente
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Inicialización del formulario
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(2000)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      category: ['', [Validators.required]],
      specifications: this.fb.group({}), // Subgrupo para campos dinámicos
      images: [[]],
      boost_type: ['NONE'],
      status: ['AVAILABLE']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    
    // Detectar si es modo edición por la URL
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.productId = params['id'];
        this.isEditMode = true;
        this.loadProductForEdit(this.productId??"");
      }
    });

    // Escuchar cambios en la categoría para actualizar las especificaciones dinámicas
    this.productForm.get('category')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(categoryId => {
        this.onCategoryChange(categoryId);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => this.errorMessage = 'Error al cargar categorías.'
    });
  }

  loadProductForEdit(id: string): void {
    this.isLoading = true;
    this.productsService.getProduct(id).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue({
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category.id, // Asumiendo que viene el objeto categoría
          boost_type: product.boost_type,
          status: product.status
        });
        // Cargar imágenes existentes
        if (product.images && product.images.length > 0) {
          this.existingImages = product.images;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'No se pudo cargar el producto.';
        this.isLoading = false;
      }
    });
  }

  onCategoryChange(categoryId: string): void {
    const selectedCat = this.categories.find(c => c.id === categoryId);
    const specGroup = this.productForm.get('specifications') as FormGroup;

    // Limpiar controles anteriores
    Object.keys(specGroup.controls).forEach(key => specGroup.removeControl(key));

    // Añadir controles basados en el schema de la categoría (JSON de Django)
    if (selectedCat?.schema) {
      selectedCat.schema.forEach((field: string) => {
        specGroup.addControl(field, this.fb.control(''));
      });
    }
  }

  onImagesChange(images: string[]): void {
    this.productForm.patchValue({ images });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const productData = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.productsService.updateProduct(this.productId, productData).subscribe({
        next: () => this.handleSuccess('Producto actualizado correctamente'),
        error: (err) => this.handleError(err)
      });
    } else {
      this.productsService.createProduct(productData).subscribe({
        next: () => this.handleSuccess('Producto creado con éxito'),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleSuccess(msg: string): void {
    this.successMessage = msg;
    this.isLoading = false;
    setTimeout(() => {
      if (this.isEditMode && this.productId) {
        this.router.navigate(['/products', this.productId]);
      } else {
        this.router.navigate(['/products']);
      }
    }, 2000);
  }

  private handleError(err: any): void {
    this.errorMessage = 'Ocurrió un error al procesar la solicitud.';
    this.isLoading = false;
    console.error(err);
  }

  get currentCategorySchema(): string[] {
    const categoryId = this.productForm.get('category')?.value;
    if (!categoryId) return [];
    
    const selectedCat = this.categories.find(c => c.id === categoryId);
    return selectedCat?.schema || [];
  }

  // 2. Para el botón de volver atrás
  onCancel(): void {
    if (this.productForm.dirty) {
      if (confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?')) {
        this.router.navigate(['/products']);
      }
    } else {
      this.router.navigate(['/products']);
    }
  }
}
