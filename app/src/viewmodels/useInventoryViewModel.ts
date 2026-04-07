import { useState } from 'react';
import { Resource } from '../models';
import { getSavedUser } from '../services/authService';
import { getMaterialesService } from '../services/materialesService';
import { createSolicitudeService } from '../services/solicitudesService';

interface Filters {
  search?: string;
}

// Mapea campos reales del backend: titulo, descripcion, ubicacion, estado
const mapToResource = (item: any): Resource => ({
  id: item._id ?? item.id,
  nombre: item.titulo ?? 'Sin nombre',       // backend usa "titulo"
  descripcion: item.descripcion ?? '',
  ubicacion: item.ubicacion ?? '',
  estado: mapEstado(item.estado),
});

const mapEstado = (estado: string): Resource['estado'] => {
  const s = (estado ?? '').toLowerCase();
  if (s === 'disponible') return 'AVAILABLE';
  if (s === 'no disponible') return 'UNAVAILABLE';
  return 'UNAVAILABLE';
};

export const useInventoryViewModel = () => {
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMaterialesService();
      const list = Array.isArray(data) ? data : data.materiales ?? data.data ?? [];
      const mapped = list.map(mapToResource);
      setAllResources(mapped);
      setFilteredResources(mapped);
    } catch {
      setError('No se pudo cargar el inventario. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<Filters>) => {
    if (!newFilters.search?.trim()) {
      setFilteredResources(allResources);
      return;
    }
    const q = newFilters.search.toLowerCase();
    setFilteredResources(
      allResources.filter(
        (r) =>
          r.nombre.toLowerCase().includes(q) ||
          r.ubicacion.toLowerCase().includes(q)
      )
    );
  };

  // Crear solicitud para un material disponible
  const requestResource = async (materialId: string): Promise<boolean> => {
    try {
      const user = await getSavedUser();
      if (!user?._id) return false;

      const material = allResources.find((r) => r.id === materialId);
      await createSolicitudeService({
        titulo: material?.nombre ?? 'Solicitud de recurso',
        descripcion: material?.descripcion ?? 'Sin descripción',
        fecha_programada: new Date().toISOString(), // fecha actual como default
        prioridad: 'media',
        creadoPor: user._id,
      });
      await loadResources();
      return true;
    } catch {
      return false;
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'AVAILABLE': return '#4CAF50';
      case 'IN USE': return '#5b3fd4';
      case 'UNAVAILABLE': return '#F44336';
      default: return '#888';
    }
  };

  return {
    filteredResources,
    loading,
    error,
    loadResources,
    updateFilters,
    requestResource,
    getStatusColor,
  };
};
