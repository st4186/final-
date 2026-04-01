// viewmodels/useAuthViewModel.ts
import { useState } from 'react';
import { RegisterData } from '../models';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta según tu estructura

const authService = new AuthService();

export const useAuthViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(data);
      
      return { 
        success: true, 
        data: response 
      };
    } catch (error: any) {
      setError(error.message);
      return { 
        success: false, 
        message: error.message || 'Error al registrar' 
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.authenticate(credentials);
      
      return { 
        success: true, 
        data: response 
      };
    } catch (error: any) {
      setError(error.message);
      return { 
        success: false, 
        message: error.message || 'Error al iniciar sesión' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.invalidateToken();
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Error al cerrar sesión' 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    login,
    logout,
    loading,
    error,
  };
};