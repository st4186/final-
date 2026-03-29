import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Guardar token de sesión
export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync('userToken', token);
};

// Obtener token guardado
export const getToken = async () => {
  return await SecureStore.getItemAsync('userToken');
};

// Eliminar token (cerrar sesión)
export const removeToken = async () => {
  await SecureStore.deleteItemAsync('userToken');
};

// Guardar datos para modo offline
export const saveOfflineData = async (key: string, data: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(data));
};

// Obtener datos guardados offline
export const getOfflineData = async (key: string) => {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};