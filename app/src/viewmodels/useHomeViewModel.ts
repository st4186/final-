import { useState } from 'react';
import { UserResource } from '../models';
import { getMaterialesService } from '../services/materialesService';

// Mapea MATERIALES al modelo de la vista (para IN USE AND LOCATION)
const mapMaterialToUserResource = (item: any): UserResource => ({
  id: item._id ?? item.id,
  nombre: item.titulo ?? 'Sin nombre',
  descripcion: item.descripcion ?? '',
  ubicacion: item.ubicacion ?? 'Ubicación no especificada',
  usuario: 'En uso',  // Para materiales, no hay usuario específico
  horario: undefined,
  estado: 'IN USE',  // Los no disponibles siempre son IN USE
  prioridad: item.prioridad,
});

export const useHomeViewModel = () => {
  const [resources, setResources] = useState<UserResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadResources = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener materiales del backend
      const data = await getMaterialesService();
      
      // Asegurar que list siempre sea un arreglo
      let list: any[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data?.materiales && Array.isArray(data.materiales)) {
        list = data.materiales;
      } else if (data?.data && Array.isArray(data.data)) {
        list = data.data;
      } else {
        list = [];
      }
      
      // FILTRAR: Solo mostrar los materiales NO DISPONIBLES
      const noDisponibles = list.filter(item => item && item.estado === 'no disponible');
      
      // Mapear y guardar
      setResources(noDisponibles.map(mapMaterialToUserResource));
      
    } catch (err: any) {
      console.log('Error al cargar materiales:', err);
      setResources([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (id: string): Promise<boolean> => {
    // Para materiales, no aplica cancelar
    return false;
  };

  const filteredResources = (query: string): UserResource[] => {
    if (!query.trim()) return resources;
    const q = query.toLowerCase();
    return resources.filter(
      (r) =>
        r.nombre.toLowerCase().includes(q) ||
        r.ubicacion.toLowerCase().includes(q) ||
        r.usuario.toLowerCase().includes(q)
    );
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'IN USE': return '#5b3fd4';
      case 'IN QUEUE': return '#d4760a';
      default: return '#888';
    }
  };

  return {
    resources,
    loading,
    error,
    loadResources,
    cancelRequest,
    filteredResources,
    getStatusColor,
  };
};