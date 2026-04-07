// services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const loginService = async (payload: { email: string; password: string }) => {
  console.log(" Conectando a backend real...");
  console.log(" URL:", api.defaults.baseURL);
  
  const response = await api.post('/usuarios/login', payload);
  
  console.log(" Respuesta recibida");
  
  return {
    token: response.data.token,
    usuario: response.data.usuario
  };
};

export const registerService = async (payload: {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await api.post('/usuarios/register', payload);
  return response.data;
};

export const saveSession = async (token: string, user: any) => {
  await AsyncStorage.setItem('userToken', token);
  await AsyncStorage.setItem('userProfile', JSON.stringify(user));
};

export const clearSession = async () => {
  await AsyncStorage.multiRemove(['userToken', 'userProfile']);
};

export const getToken = async () => {
  return await AsyncStorage.getItem('userToken');
};

export const getUser = async () => {
  const userStr = await AsyncStorage.getItem('userProfile');
  return userStr ? JSON.parse(userStr) : null;
};
