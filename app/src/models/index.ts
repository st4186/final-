// Usuario guardado en sesión
export interface User {
  _id?: string;
  nombre: string;   // ← el backend devuelve "nombre", no "name"
  apellido?: string;
  email?: string;
  role: 'alumno' | 'profesor' | 'staff';
}

// Material del inventario (viene de /api/materials)
// Campos reales del modelo: titulo, descripcion, ubicacion, estado
export interface Resource {
  id: string;
  nombre: string;      // ← mapeado desde "titulo"
  descripcion: string;
  ubicacion: string;
  estado: 'AVAILABLE' | 'UNAVAILABLE' | 'IN USE';
}

// Solicitud del usuario (viene de /api/solicitude)
export interface UserResource {
  id: string;
  nombre: string;      // ← mapeado desde "titulo"
  descripcion: string;
  ubicacion: string;
  usuario: string;
  horario?: string;    // ← mapeado desde "fecha_programada"
  estado: 'IN USE' | 'IN QUEUE' | 'CANCELLED';
  prioridad?: 'baja' | 'media' | 'alta';
}
