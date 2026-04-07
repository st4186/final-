import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://172.23.82.137:3000/api';

// Obtener el token guardado
const getToken = async () => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.token;
    }
    return null;
  } catch (error) {
    console.log('Error getting token:', error);
    return null;
  }
};

// Obtener todas las solicitudes
export const getSolicitudesService = async () => {
  try {
    const token = await getToken();
    
    const response = await fetch(`${API_URL}/solicitudes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error en getSolicitudesService:', error);
    throw error;
  }
};

// Eliminar una solicitud
export const deleteSolicitudeService = async (id: string) => {
  try {
    const token = await getToken();
    
    const response = await fetch(`${API_URL}/solicitudes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.log('Error en deleteSolicitudeService:', error);
    throw error;
  }
};

// Crear una solicitud
export const createSolicitudeService = async (solicitud: {
  titulo: string;
  descripcion: string;
  fecha_programada: string;
}) => {
  try {
    const token = await getToken();
    
    const response = await fetch(`${API_URL}/solicitudes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(solicitud),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.log('Error en createSolicitudeService:', error);
    throw error;
  }
};
