import api from './api';

// GET /api/materials
export const getMaterialesService = async () => {
  const res = await api.get('/materials');
  return res.data;
};

// GET /api/materials/:id
export const getMaterialByIdService = async (id: string) => {
  const res = await api.get(`/materials/${id}`);
  return res.data;
};

// POST /api/materials/NewMaterial
// Campos exactos del modelo: titulo, descripcion, ubicacion, estado, creadoPor
export const createMaterialService = async (data: {
  titulo: string;
  descripcion: string;
  ubicacion: string;
  estado?: 'disponible' | 'no disponible';
  creadoPor: string; // _id del usuario logueado
}) => {
  const res = await api.post('/materials/NewMaterial', data);
  return res.data;
};

// PUT /api/materials/:id
export const updateMaterialService = async (id: string, data: object) => {
  const res = await api.put(`/materials/${id}`, data);
  return res.data;
};

// DELETE /api/materials/:id
export const deleteMaterialService = async (id: string) => {
  const res = await api.delete(`/materials/${id}`);
  return res.data;
};
