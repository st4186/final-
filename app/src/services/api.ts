import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// ==================== CONFIGURACIÓN ANDROID FÍSICO ====================
// 🔥 CAMBIA ESTA IP POR LA IP DE TU COMPUTADORA
// Abre CMD → ipconfig → busca "Dirección IPv4"
const IP_COMPUTADORA = '192.168.68.113';  // ← CAMBIA AQUÍ

const api = axios.create({
  baseURL: `http://${IP_COMPUTADORA}:3000/api`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ==================== AGREGAR TOKEN AUTOMÁTICAMENTE ====================
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== MANEJAR SESIÓN EXPIRADA ====================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['userToken', 'userProfile']);
    }
    return Promise.reject(error);
  }
);

// ==================== CONSTANTES ====================
export const STORAGE_KEYS = {
  TOKEN: 'userToken',
  USER_PROFILE: 'userProfile',
  OFFLINE_CACHE: 'offlineCache',
  APP_SETTINGS: 'appSettings',
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

export default api;