// app/src/services/auth.ts
import { AuthResponse, LoginCredentials, RegisterData, User } from '../models';

// Base de datos simulada de usuarios
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'test@edutech.com',
    name: 'Usuario Test',
    role: 'student',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'admin@edutech.com',
    name: 'Administrador',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'profesor@edutech.com',
    name: 'Profesor Demo',
    role: 'teacher',
    createdAt: new Date().toISOString(),
  },
];

// Credenciales simuladas
const MOCK_CREDENTIALS = {
  'test@edutech.com': { password: 'Password123', userId: '1' },
  'admin@edutech.com': { password: 'Admin123', userId: '2' },
  'profesor@edutech.com': { password: 'Teacher123', userId: '3' },
};

export class AuthService {
  async authenticate(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const userCred = MOCK_CREDENTIALS[credentials.email as keyof typeof MOCK_CREDENTIALS];
    
    if (userCred && userCred.password === credentials.password) {
      const user = MOCK_USERS.find(u => u.id === userCred.userId);
      
      if (user) {
        return {
          token: 'mock_jwt_token_' + Date.now(),
          user: user,
        };
      }
    }
    
    throw new Error('Credenciales inválidas');
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (data.password !== data.confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }
    
    // Verificar si el email ya existe
    const existingUser = MOCK_USERS.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }
    
    // Crear nuevo usuario
    const newUser: User = {
      id: (MOCK_USERS.length + 1).toString(),
      email: data.email,
      name: data.name,
      role: 'student',
      createdAt: new Date().toISOString(),
    };
    
    // Agregar a la base de datos simulada
    MOCK_USERS.push(newUser);
    
    // Agregar credenciales
    MOCK_CREDENTIALS[data.email as keyof typeof MOCK_CREDENTIALS] = {
      password: data.password,
      userId: newUser.id,
    };
    
    return {
      token: 'mock_jwt_token_' + Date.now(),
      user: newUser,
    };
  }

  async invalidateToken(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

export const authService = new AuthService();