import api from './api';

// GET /api/materials  → Lista todos los materiales (inventario)
export const getMaterialsService = async () => {
  const res = await api.get('/materials');
  return res.data;
};

// GET /api/materials/:id
export const getMaterialByIdService = async (id: string) => {
  const res = await api.get(`/materials/${id}`);
  return res.data;
};

// POST /api/materials/NewMaterial
export const createMaterialService = async (data: {
  title: string;
  description: string;
  location: string;
  status: string;
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
