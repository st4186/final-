import { REGEX_PATTERNS } from './constants';

export type ValidationField = 'email' | 'password' | 'phone' | 'username';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateField = (
  value: string,
  field: ValidationField
): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, message: 'Este campo es requerido' };
  }

  const pattern = REGEX_PATTERNS[field];
  if (!pattern) {
    return { isValid: true };
  }

  const isValid = pattern.test(value);
  
  const fieldNames = {
    email: 'email',
    password: 'contraseña',
    phone: 'teléfono',
    username: 'usuario',
  };
  
  return {
    isValid,
    message: isValid ? undefined : `Formato de ${fieldNames[field]} no válido`,
  };
};

export const validatePasswordStrength = (password: string): ValidationResult => {
  if (!password || password.trim() === '') {
    return { isValid: false, message: 'La contraseña es requerida' };
  }
  
  const requirements = [
    { regex: /.{8,}/, message: 'Mínimo 8 caracteres' },
    { regex: /[A-Z]/, message: 'Al menos una mayúscula' },
    { regex: /[a-z]/, message: 'Al menos una minúscula' },
    { regex: /\d/, message: 'Al menos un número' },
  ];

  const failed = requirements.filter((req) => !req.regex.test(password));

  if (failed.length > 0) {
    return {
      isValid: false,
      message: failed.map((f) => f.message).join(', '),
    };
  }

  return { isValid: true };
};

export const validateForm = <T extends Record<string, string>>(
  formData: T,
  rules: Record<keyof T, ValidationField>
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const [field, rule] of Object.entries(rules)) {
    const result = validateField(formData[field as keyof T], rule as ValidationField);
    if (!result.isValid && result.message) {
      errors[field as keyof T] = result.message;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};