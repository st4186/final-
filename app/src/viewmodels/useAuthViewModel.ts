// viewmodels/useAuthViewModel.ts
import { useState } from 'react';
import {
  clearSession,
  loginService,
  registerService,
  saveSession,
} from '../services/authService';

interface AuthResult {
  success: boolean;
  message?: string;
}

export const useAuthViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── LOGIN ────────────────────────────────────────────────
  const login = async (payload: {
    email: string;
    password: string;
  }): Promise<AuthResult> => {
    console.log("\n========== LOGIN ==========");
    console.log("📝 [login] Email:", payload.email);
    console.log("📝 [login] Password length:", payload.password.length);
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("📡 [login] Llamando a loginService...");
      const data = await loginService(payload);
      
      console.log("📦 [login] Data recibida:", {
        hasToken: !!data.token,
        hasUsuario: !!data.usuario
      });
      
      console.log("💾 [login] Guardando sesión...");
      await saveSession(data.token, data.usuario ?? { email: payload.email });
      
      console.log("✅ [login] Login exitoso!");
      return { success: true };
    } catch (err: any) {
      console.error("❌ [login] Error capturado:");
      console.error("- Message:", err.message);
      console.error("- Response:", err.response?.data);
      
      const msg =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        'No se pudo iniciar sesión. Verifica tus credenciales.';
      
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
      console.log("========== FIN LOGIN ==========\n");
    }
  };

  // ─── REGISTER ─────────────────────────────────────────────
  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }): Promise<AuthResult> => {
    console.log("\n========== REGISTER ==========");
    console.log("📝 [register] Email:", payload.email);
    console.log("📝 [register] Name:", payload.name);
    console.log("📝 [register] Password length:", payload.password.length);
    
    setLoading(true);
    setError(null);
    
    try {
      // Verificar que las contraseñas coincidan
      if (payload.confirmPassword && payload.password !== payload.confirmPassword) {
        console.log("❌ [register] Las contraseñas no coinciden");
        setError('Las contraseñas no coinciden');
        return { success: false, message: 'Las contraseñas no coinciden' };
      }
      
      // Adaptamos "name" → "nombre" y "apellido"
      const nameParts = payload.name.trim().split(' ');
      const nombre = nameParts[0] || payload.name;
      const apellido = nameParts.slice(1).join(' ') || 'Usuario';
      
      const registerData = {
        nombre: nombre,
        apellido: apellido,
        email: payload.email,
        password: payload.password,
        role: 'alumno',
      };
      
      console.log("📦 [register] Datos formateados:", { 
        nombre: registerData.nombre,
        apellido: registerData.apellido,
        email: registerData.email,
        password: '***',
        role: registerData.role
      });
      
      console.log("📡 [register] Llamando a registerService...");
      const data = await registerService(registerData);
      
      console.log("✅ [register] Registro exitoso!");
      console.log("📦 [register] Respuesta:", data);
      
      return { success: true };
    } catch (err: any) {
      console.error("❌ [register] Error capturado:");
      console.error("- Message:", err.message);
      console.error("- Response:", err.response?.data);
      console.error("- Status:", err.response?.status);
      
      const msg =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        'No se pudo crear la cuenta.';
      
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
      console.log("========== FIN REGISTER ==========\n");
    }
  };

  // ─── LOGOUT ───────────────────────────────────────────────
  const logout = async (): Promise<boolean> => {
    console.log("\n========== LOGOUT ==========");
    try {
      await clearSession();
      console.log("✅ [logout] Sesión cerrada exitosamente");
      return true;
    } catch (error) {
      console.error("❌ [logout] Error al cerrar sesión:", error);
      return false;
    } finally {
      console.log("========== FIN LOGOUT ==========\n");
    }
  };

  // ─── LIMPIAR ERROR ────────────────────────────────────────
  const clearError = () => {
    setError(null);
  };

  return { 
    login, 
    register, 
    logout, 
    loading, 
    error,
    clearError 
  };
};