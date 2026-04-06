// src/helpers/storage.ts

import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../helpers/constants';

export type OfflineData<T = any> = {
  data: T;
  timestamp: number;
  expiresAt?: number;
};

// Almacenamiento en memoria para datos que no requieren persistencia
const memoryStorage = new Map<string, any>();

export const saveToken = async (token: string): Promise<boolean> => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
    return true;
  } catch (error) {
    console.error('Error saving token:', error);
    return false;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async (): Promise<boolean> => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

// Usar memoria en lugar de AsyncStorage (que no funciona)
export const saveOfflineData = async <T>(
  key: string,
  data: T
): Promise<boolean> => {
  try {
    const payload: OfflineData<T> = {
      data,
      timestamp: Date.now(),
    };
    // Guardar en memoria
    memoryStorage.set(key, payload);
    console.log(`Datos guardados en memoria: ${key}`);
    return true;
  } catch (error) {
    console.error(`Error saving offline data (${key}):`, error);
    return false;
  }
};

export const getOfflineData = async <T>(
  key: string
): Promise<OfflineData<T> | null> => {
  try {
    // Obtener de memoria
    const data = memoryStorage.get(key);
    console.log(`Datos recuperados de memoria: ${key}`, data ? 'OK' : 'vacío');
    return data || null;
  } catch (error) {
    console.error(`Error reading offline data (${key}):`, error);
    return null;
  }
};

export const clearOfflineData = async (key: string): Promise<boolean> => {
  try {
    memoryStorage.delete(key);
    console.log(`Datos eliminados de memoria: ${key}`);
    return true;
  } catch (error) {
    console.error(`Error clearing offline data (${key}):`, error);
    return false;
  }
};

export const Storage = {
  saveToken,
  getToken,
  removeToken,
  saveOfflineData,
  getOfflineData,
  clearOfflineData,
};

export default Storage;