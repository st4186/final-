// src/viewmodels/useInventoryViewModel.ts

import { useMemo, useState } from 'react';
import { Storage } from '../helpers/storage';
import { InventoryFilters, Resource, ResourceStatus } from '../models';

// Mock Data para Sprint 1
const MOCK_RESOURCES: Resource[] = [
  { id: '1', nombre: 'LIBRARY CUBICLE', ubicacion: 'LEARNING COMMONS', estado: 'AVAILABLE' },
  { id: '2', nombre: 'MAC LAB', ubicacion: 'BUILDING D', estado: 'AVAILABLE' },
  { id: '3', nombre: 'INDUSTRIAL WORKSHOP', ubicacion: 'BUILDING B', estado: 'AVAILABLE' },
  { id: '4', nombre: 'LASER PRINTER', ubicacion: 'BUILDING D', estado: 'AVAILABLE' },
  { id: '5', nombre: 'LAB CHAIRS', ubicacion: 'BUILDING B- BL01', estado: 'IN USE' },
  { id: '6', nombre: 'IT LAB', ubicacion: 'BUILDING D- DL02', estado: 'IN QUEUE' },
];

export interface InventoryState {
  resources: Resource[];
  loading: boolean;
  error: string | null;
  filters: InventoryFilters;
}

export const useInventoryViewModel = () => {
  const [state, setState] = useState<InventoryState>({
    resources: [],
    loading: true,
    error: null,
    filters: {},
  });

  // Cargar recursos desde Mock o AsyncStorage
  const loadResources = async (): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Sprint 1: Usar Mock Data
      await new Promise(resolve => setTimeout(resolve, 500));

      // Intentar cargar desde AsyncStorage primero
      const cached = await Storage.getOfflineData<Resource[]>('inventory_cache');
      
      const resources = cached?.data || MOCK_RESOURCES;

      // Guardar en cache para modo offline
      await Storage.saveOfflineData('inventory_cache', resources);

      setState({
        resources,
        loading: false,
        error: null,
        filters: {},
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al cargar el inventario';

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return false;
    }
  };

  // Filtrar recursos con memoization para rendimiento
  const filteredResources = useMemo(() => {
    const { search, status, location } = state.filters;

    return state.resources.filter(item => {
      const matchesSearch = !search || 
        item.nombre.toLowerCase().includes(search.toLowerCase()) ||
        item.ubicacion.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = !status || item.estado === status;
      const matchesLocation = !location || 
        item.ubicacion.toLowerCase().includes(location.toLowerCase());

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [state.resources, state.filters]);

  // Actualizar filtros de búsqueda
  const updateFilters = (newFilters: Partial<InventoryFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }));
  };

  // Solicitar recurso (Mock para Sprint 1)
  const requestResource = async (resourceId: string): Promise<boolean> => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 800));

      // Actualizar estado local del recurso
      setState(prev => ({
        ...prev,
        resources: prev.resources.map(r => 
          r.id === resourceId ? { ...r, estado: 'IN QUEUE' as ResourceStatus } : r
        ),
      }));

      // Guardar cambios en AsyncStorage
      await Storage.saveOfflineData('inventory_cache', state.resources);

      return true;
    } catch (error) {
      console.error('Error requesting resource:', error);
      return false;
    }
  };

  // Obtener color según estado (utilidad para la vista)
  const getStatusColor = (status: ResourceStatus): string => {
    const colors: Record<ResourceStatus, string> = {
      'AVAILABLE': '#4CAF50',
      'IN USE': '#FF9800',
      'IN QUEUE': '#2196F3',
      'MAINTENANCE': '#F44336',
    };
    return colors[status] || '#999';
  };

  // Limpiar estado
  const clearInventory = () => {
    setState({
      resources: [],
      loading: false,
      error: null,
      filters: {},
    });
  };

  return {
    ...state,
    filteredResources,
    loadResources,
    updateFilters,
    requestResource,
    getStatusColor,
    clearInventory,
  };
};