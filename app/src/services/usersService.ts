import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.68.113:3000/api';

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

// Obtener usuario por ID
export const getUserByIdService = async (id: string) => {
  try {
    const token = await getToken();
    
    console.log('📡 GET usuario por ID:', id);
    
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
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
    console.log('✅ Usuario recibido:', data);
    return data;
  } catch (error) {
    console.log('Error en getUserByIdService:', error);
    throw error;
  }
};