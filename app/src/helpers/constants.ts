// constants.ts
export const STORAGE_KEYS = {
  TOKEN: 'userToken',
  USER_PROFILE: 'userProfile',
  OFFLINE_CACHE: 'offlineCache',
  APP_SETTINGS: 'appSettings',
} as const;

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
} as const;

export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  phone: /^\+?[\d\s\-\(\)]{10,}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'Sesión expirada. Inicia sesión nuevamente.',
  VALIDATION_ERROR: 'Los datos ingresados no son válidos.',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado. Intenta de nuevo.',
} as const;

export { };
