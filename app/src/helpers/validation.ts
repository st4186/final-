type FieldType = 'email' | 'username' | 'password';

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateField = (value: string, type: FieldType): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, message: 'Este campo es requerido' };
  }
  if (type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { isValid: false, message: 'Ingresa un email válido' };
    }
  }
  if (type === 'username' && value.trim().length < 2) {
    return { isValid: false, message: 'El nombre debe tener al menos 2 caracteres' };
  }
  if (type === 'password' && value.length < 6) {
    return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
  }
  return { isValid: true };
};

export const validatePasswordStrength = (password: string): ValidationResult => {
  if (!password) return { isValid: false, message: 'La contraseña es requerida' };
  if (password.length < 6) return { isValid: false, message: 'Mínimo 6 caracteres' };
  return { isValid: true };
};
