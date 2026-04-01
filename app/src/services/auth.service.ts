import { AuthResponse, LoginCredentials, RegisterData, User } from '../models';

// Mock Data para Sprint 1
const MOCK_DELAY = 1500;

const mockUser: User = {
  id: '1',
  email: 'test@edutech.com',
  name: 'Usuario Test',
  role: 'student',
  createdAt: new Date().toISOString(),
};

const mockToken = 'mock_jwt_token_' + Date.now();

export class AuthService {
  async authenticate(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

    // Validación mock
    if (
      credentials.email === 'test@edutech.com' &&
      credentials.password === 'Password123'
    ) {
      return {
        token: mockToken,
        user: mockUser,
      };
    }

    throw new Error('Credenciales inválidas');
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

    if (data.password !== data.confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    if (data.password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    // Mock de registro exitoso
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'student',
      createdAt: new Date().toISOString(),
    };

    return {
      token: mockToken,
      user: newUser,
    };
  }

  async invalidateToken(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // En Sprint 2: llamar al endpoint de logout
  }

  async getCurrentUser(token: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return mockUser;
  }
}