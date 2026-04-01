// src/models/Home.ts

import { Resource } from './Inventory';

export interface UserResource extends Resource {
  usuario: string;
  horario?: string;
  fechaSolicitud?: string;
}

export interface HomeState {
  activeResources: UserResource[];
  queuedResources: UserResource[];
  loading: boolean;
  error: string | null;
}