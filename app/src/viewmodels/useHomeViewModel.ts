// src/viewmodels/useHomeViewModel.ts

import { useMemo, useState } from 'react';
import { Storage } from '../helpers/storage';
import { UserResource } from '../models';

// Mock Data para Sprint 1
const MOCK_ACTIVE_RESOURCES: UserResource[] = [
  { 
    id: '1', 
    nombre: 'LAB CHAIRS', 
    ubicacion: 'Building B- BL01', 
    estado: 'IN USE',
    usuario: 'user@gmail.com'
  },
  { 
    id: '2', 
    nombre: 'INDUSTRIAL WORKSHOP', 
    ubicacion: 'Building D- DL02', 
    estado: 'IN QUEUE',
    usuario: 'user@gmail.com',
    horario: '9AM-10AM'
  },
  { 
    id: '3', 
    nombre: 'INDUSTRIAL WORKSHOP', 
    ubicacion: 'Building B', 
    estado: 'IN QUEUE',
    usuario: 'user@gmail.com',
    horario: '9AM-10AM'
  },
];

export const useHomeViewModel = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resources, setResources] = useState<UserResource[]>([]);

  // Cargar recursos desde Mock o AsyncStorage
  const loadResources = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Sprint 1: Usar Mock Data con pequeño delay para simular API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Intentar cargar desde AsyncStorage primero
      const cached = await Storage.getOfflineData<UserResource[]>('user_resources');
      
      const data = cached?.data || MOCK_ACTIVE_RESOURCES;

      // Guardar en cache para modo offline
      await Storage.saveOfflineData('user_resources', data);

      setResources(data);
      setLoading(false);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar recursos';
      setError(message);
      setLoading(false);
      return false;
    }
  };

  // Filtrar recursos con búsqueda
  const filteredResources = useMemo(() => {
    return (searchQuery: string) => {
      if (!searchQuery) return resources;
      
      const query = searchQuery.toLowerCase();
      return resources.filter(item =>
        item.nombre.toLowerCase().includes(query) ||
        item.ubicacion.toLowerCase().includes(query)
      );
    };
  }, [resources]);

  // Obtener color según estado
  const getStatusColor = (estado: string): string => {
    const colors: Record<string, string> = {
      'IN USE': '#FF9800',
      'IN QUEUE': '#F44336',
      'AVAILABLE': '#4CAF50',
    };
    return colors[estado] || '#999';
  };

  // Cancelar solicitud (Mock para Sprint 1)
  const cancelRequest = async (resourceId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setResources(prev => 
        prev.filter(r => r.id !== resourceId)
      );

      // Actualizar cache
      await Storage.saveOfflineData('user_resources', resources.filter(r => r.id !== resourceId));
      
      return true;
    } catch (err) {
      console.error('Error canceling request:', err);
      return false;
    }
  };

  return {
    loading,
    error,
    resources,
    filteredResources,
    getStatusColor,
    cancelRequest,
    loadResources,
  };
};