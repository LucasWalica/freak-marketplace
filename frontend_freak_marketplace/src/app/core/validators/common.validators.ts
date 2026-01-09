import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null;
    }
    
    const errors: ValidationErrors = {};
    
    // Minimum 8 characters
    if (value.length < 8) {
      errors['minLength'] = 'Mínimo 8 caracteres';
    }
    
    // At least one uppercase letter
    if (!/[A-Z]/.test(value)) {
      errors['uppercase'] = 'Debe contener al menos una mayúscula';
    }
    
    // At least one digit
    if (!/\d/.test(value)) {
      errors['digit'] = 'Debe contener al menos un número';
    }
    
    // At least one lowercase letter
    if (!/[a-z]/.test(value)) {
      errors['lowercase'] = 'Debe contener al menos una minúscula';
    }
    
    return Object.keys(errors).length === 0 ? null : errors;
  };
}

export function usernameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return { required: 'El usuario es obligatorio' };
    }
    
    // Only letters, numbers and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return { pattern: 'Solo letras, números y guiones bajos' };
    }
    
    // Length between 3 and 20
    if (value.length < 3) {
      return { minLength: 'Mínimo 3 caracteres' };
    }
    
    if (value.length > 20) {
      return { maxLength: 'Máximo 20 caracteres' };
    }
    
    return null;
  };
}

export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null; // Optional field
    }
    
    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(value)) {
      return { invalidUrl: 'Debe ser una URL válida (http:// o https://)' };
    }
    
    return null;
  };
}

export function matchingFieldsValidator(matchControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null;
    }
    
    const parent = control.parent;
    if (!parent) {
      return null;
    }
    
    const matchingControl = parent.get(matchControlName);
    if (!matchingControl) {
      return null;
    }
    
    if (value !== matchingControl.value) {
      return { passwordMismatch: 'Los campos no coinciden' };
    }
    
    return null;
  };
}
