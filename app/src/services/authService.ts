// services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const loginService = async (payload: { email: string; password: string }) => {
  console.log("📡 [loginService] Conectando a backend...");
  console.log("📍 [loginService] URL:", api.defaults.baseURL);
  console.log("📧 [loginService] Email:", payload.email);
  
  try {
    const response = await api.post('/usuarios/login', payload);
    console.log("✅ [loginService] Respuesta recibida, status:", response.status);
    console.log("✅ [loginService] Token:", response.data.token ? "Recibido" : "No hay token");
    
    return {
      token: response.data.token,
      usuario: response.data.usuario
    };
  } catch (error: any) {
    console.error("❌ [loginService] Error:");
    console.error("- Status:", error.response?.status);
    console.error("- Data:", error.response?.data);
    console.error("- Message:", error.message);
    throw error;
  }
};

export const registerService = async (payload: {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  role: string;
}) => {
  console.log("📡 [registerService] Enviando registro a:", api.defaults.baseURL);
  console.log("📦 [registerService] Datos a enviar:", { 
    nombre: payload.nombre,
    apellido: payload.apellido,
    email: payload.email,
    password: '***',
    role: payload.role
  });
  
  try {
    const response = await api.post('/usuarios/register', payload);
    console.log("✅ [registerService] Respuesta recibida, status:", response.status);
    console.log("✅ [registerService] Usuario creado:", response.data.usuario?.email);
    return response.data;
  } catch (error: any) {
    console.error("❌ [registerService] Error:");
    console.error("- Status:", error.response?.status);
    console.error("- Data:", error.response?.data);
    console.error("- Message:", error.message);
    throw error;
  }
};

export const saveSession = async (token: string, user: any) => {
  console.log("💾 [saveSession] Guardando token y usuario...");
  await AsyncStorage.setItem('userToken', token);
  await AsyncStorage.setItem('userProfile', JSON.stringify(user));
  console.log("✅ [saveSession] Sesión guardada");
};

export const clearSession = async () => {
  console.log("🗑️ [clearSession] Limpiando sesión...");
  await AsyncStorage.multiRemove(['userToken', 'userProfile']);
  console.log("✅ [clearSession] Sesión limpiada");
};

export const getToken = async () => {
  const token = await AsyncStorage.getItem('userToken');
  console.log("🔑 [getToken] Token:", token ? "Existe" : "No existe");
  return token;
};

export const getUser = async () => {
  const userStr = await AsyncStorage.getItem('userProfile');
  console.log("👤 [getUser] Usuario:", userStr ? "Existe" : "No existe");
  return userStr ? JSON.parse(userStr) : null;
};

// AGREGADO: getSavedUser (alias de getUser para compatibilidad)
export const getSavedUser = async () => {
  return await getUser();
};

// AGREGADO: logout (alias de clearSession para compatibilidad)
export const logout = async () => {
  await clearSession();
  return true;
};