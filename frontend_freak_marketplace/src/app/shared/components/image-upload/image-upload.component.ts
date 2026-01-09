import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UploadProgress {
  loaded: number;
  total: number;
}

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ImageUploadComponent implements OnInit {
  @Input() maxImages: number = 10;
  @Input() existingImages: string[] = [];
  @Output() imagesChange = new EventEmitter<string[]>();
  @Output() uploadProgress = new EventEmitter<UploadProgress>();

  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  isDragging = false;
  uploadErrors: string[] = [];
  isUploading = false;

  ngOnInit(): void {
    if (this.existingImages && this.existingImages.length > 0) {
      this.previewUrls = [...this.existingImages];
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  private handleFiles(files: FileList): void {
    this.uploadErrors = [];
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!this.isValidImage(file)) {
        this.uploadErrors.push(`${file.name}: Formato no válido (JPG, PNG, WebP)`);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        this.uploadErrors.push(`${file.name}: Tamaño máximo 10MB`);
        continue;
      }

      validFiles.push(file);
    }

    // Verificar límite de imágenes
    const totalImages = this.previewUrls.length + validFiles.length;
    if (totalImages > this.maxImages) {
      this.uploadErrors.push(`Máximo ${this.maxImages} imágenes permitidas`);
      return;
    }

    // Agregar archivos válidos
    this.selectedFiles = [...this.selectedFiles, ...validFiles];
    
    // Crear previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.previewUrls.push(result);
        this.imagesChange.emit(this.previewUrls);
      };
      reader.readAsDataURL(file);
    });
  }

  private isValidImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
  }

  triggerFileSelect(): void {
    const input = document.querySelector('.hidden-input') as HTMLInputElement;
    if (input) {
      input.click();
    }
  }

  removeImage(index: number): void {
    this.previewUrls.splice(index, 1);
    
    // Ajustar índice para selectedFiles
    const existingPreviews = this.existingImages?.length || 0;
    if (index >= existingPreviews) {
      this.selectedFiles.splice(index - existingPreviews, 1);
    }
    
    this.imagesChange.emit(this.previewUrls);
  }

  removeAllImages(): void {
    this.previewUrls = [];
    this.selectedFiles = [];
    this.uploadErrors = [];
    this.imagesChange.emit([]);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  get hasImages(): boolean {
    return this.previewUrls.length > 0;
  }

  get canAddMore(): boolean {
    return this.previewUrls.length < this.maxImages;
  }

  get uploadButtonText(): string {
    if (this.isUploading) return 'Subiendo...';
    if (this.previewUrls.length === 0) return 'Seleccionar imágenes';
    return `Añadir más (${this.previewUrls.length}/${this.maxImages})`;
  }
}
