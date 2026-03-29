import { removeToken, saveToken } from '../utils/storage';
import { validateEmail, validatePassword } from '../utils/validators';

// Simulación de API - Después cambiar por llamada real
export const loginUser = async (email: string, password: string) => {
  // Validaciones antes de llamar a la API
  if (!validateEmail(email)) {
    throw new Error('Correo electrónico inválido');
  }
  if (!validatePassword(password)) {
    throw new Error('La contraseña debe tener mínimo 8 caracteres, una letra y un número');
  }

  // Simular llamada a API
  // CAMBIA ESTO: usa el correo y contraseña que quieras para probar
  if (email === 'test@edutech.com' && password === 'password123') {
    const fakeToken = 'jwt-token-' + Date.now();
    await saveToken(fakeToken);
    return { success: true, token: fakeToken };
  }
  
  throw new Error('Credenciales incorrectas');
};

export const logout = async () => {
  await removeToken();
};