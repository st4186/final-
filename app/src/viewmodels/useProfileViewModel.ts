import { useState } from 'react';
import { getSavedUser } from '../services/authService';
import { getUserByIdService } from '../services/usersService';

interface User {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  role: string;
}

export const useProfileViewModel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      // Carga desde AsyncStorage
      const saved = await getSavedUser();
      console.log('📦 Usuario guardado localmente:', saved);
      
      if (saved) {
        setUser({
          _id: saved.id || saved._id,
          nombre: saved.nombre,
          apellido: saved.apellido,
          email: saved.email,
          role: saved.role ?? 'alumno',
        });
      }

      // Si tiene ID, actualiza desde el backend
      const userId = saved?.id || saved?._id;
      if (userId) {
        try {
          const fresh = await getUserByIdService(userId);
          console.log('🔄 Usuario del backend:', fresh);
          
          if (fresh && fresh._id) {
            setUser({
              _id: fresh._id,
              nombre: fresh.nombre,
              apellido: fresh.apellido,
              email: fresh.email,
              role: fresh.role ?? 'alumno',
            });
          }
        } catch (err) {
          console.log('Error fetching from backend, usando datos locales');
        }
      }
    } catch (err) {
      console.log('Error general:', err);
      setError('No se pudo cargar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, loadUserProfile };
};