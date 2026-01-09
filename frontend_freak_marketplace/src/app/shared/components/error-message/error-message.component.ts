import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ErrorMessageComponent {
  @Input() errors: any;
  @Input() field: string = '';

  get errorMessages(): string[] {
    if (!this.errors) return [];
    
    const messages: string[] = [];
    
    // Handle different error types
    if (this.errors.required) {
      messages.push('Este campo es obligatorio');
    }
    if (this.errors.email) {
      messages.push('Ingresa un email válido');
    }
    if (this.errors.minlength) {
      messages.push(`Mínimo ${this.errors.minlength.requiredLength} caracteres`);
    }
    if (this.errors.maxlength) {
      messages.push(`Máximo ${this.errors.maxlength.requiredLength} caracteres`);
    }
    if (this.errors.pattern) {
      messages.push('Formato inválido');
    }
    if (this.errors.passwordMismatch) {
      messages.push(this.errors.passwordMismatch);
    }
    if (this.errors.invalidUrl) {
      messages.push(this.errors.invalidUrl);
    }
    if (this.errors.uppercase) {
      messages.push(this.errors.uppercase);
    }
    if (this.errors.digit) {
      messages.push(this.errors.digit);
    }
    if (this.errors.lowercase) {
      messages.push(this.errors.lowercase);
    }
    
    return messages;
  }
}
