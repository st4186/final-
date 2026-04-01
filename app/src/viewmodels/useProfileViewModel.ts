/**
 * useProfileViewModel - Hook para lógica del perfil de usuario
 * Patrón MVVM: Separa la obtención y gestión de datos del usuario de la UI
 */

import { useState } from 'react';
import { Storage } from '../helpers/storage';
import { User } from '../models';

export interface ProfileState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useProfileViewModel = () => {
  const [state, setState] = useState<ProfileState>({
    user: null,
    loading: false,
    error: null,
  });

  const loadUserProfile = async (): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Sprint 1: Obtener datos desde AsyncStorage (modo offline)
      const offlineData = await Storage.getOfflineData<User>('userProfile');
      
      if (offlineData?.data) {
        setState({
          user: offlineData.data,
          loading: false,
          error: null,
        });
        return true;
      }

      // Si no hay datos offline, intentar obtener token y simular llamada a API
      const token = await Storage.getToken();
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      // Mock de respuesta de API para Sprint 1
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUser: User = {
        id: '1',
        email: 'usuario@edutech.com',
        name: 'Usuario Demo',
        role: 'student',
        createdAt: new Date().toISOString(),
      };

      // Guardar en offline para futuras consultas
      await Storage.saveOfflineData('userProfile', mockUser);

      setState({
        user: mockUser,
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al cargar el perfil';

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return false;
    }
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    try {
      const current = state.user;
      if (!current) return false;

      const updated: User = { ...current, ...updates };
      
      // Actualizar en AsyncStorage
      await Storage.saveOfflineData('userProfile', updated);
      
      setState(prev => ({
        ...prev,
        user: updated,
      }));

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const clearProfile = () => {
    setState({
      user: null,
      loading: false,
      error: null,
    });
  };

  return {
    ...state,
    loadUserProfile,
    updateUserProfile,
    clearProfile,
  };
};