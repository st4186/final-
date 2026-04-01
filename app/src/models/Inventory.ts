// src/models/Inventory.ts

export type ResourceStatus = 'AVAILABLE' | 'IN USE' | 'IN QUEUE' | 'MAINTENANCE';

export interface Resource {
  id: string;
  nombre: string;
  ubicacion: string;
  estado: ResourceStatus;
  descripcion?: string;
  imagen?: string;
}

export interface InventoryFilters {
  search?: string;
  status?: ResourceStatus;
  location?: string;
}