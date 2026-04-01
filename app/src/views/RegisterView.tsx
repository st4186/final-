/**
 * RegisterView - Vista de registro de usuario (UI layer)
 * Patrón MVVM: Esta vista solo maneja presentación y eventos
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { validateField, validatePasswordStrength } from '../helpers/validation';
import { useAuthViewModel } from '../viewmodels/useAuthViewModel';

export default function RegisterView() {
  const router = useRouter();
  const { register, loading } = useAuthViewModel();
  
  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmarPassword, setConfirmarPassword] = useState<string>('');
  const [touched, setTouched] = useState({
    nombre: false,
    email: false,
    password: false,
    confirmarPassword: false,
  });

  const handleRegister = async () => {
    setTouched({
      nombre: true,
      email: true,
      password: true,
      confirmarPassword: true,
    });

    // Validaciones con helpers
    const nombreValidation = validateField(nombre, 'username');
    if (!nombreValidation.isValid) {
      Alert.alert('Error', nombreValidation.message);
      return;
    }

    const emailValidation = validateField(email, 'email');
    if (!emailValidation.isValid) {
      Alert.alert('Error', emailValidation.message);
      return;
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      Alert.alert('Error', passwordValidation.message);
      return;
    }

    if (password !== confirmarPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // Llamada al ViewModel
    const result = await register({
      name: nombre,
      email,
      password,
      confirmPassword: confirmarPassword,
    });

    if (result.success) {
      Alert.alert(
        'Éxito',
        'Cuenta creada correctamente',
        [{ text: 'Aceptar', onPress: () => router.replace('/login') }]
      );
    } else {
      Alert.alert('Error', result.message || 'Error al registrar');
    }
  };

  // Helpers para mostrar errores - Tipo explícito de retorno
  const getError = (field: 'nombre' | 'email' | 'password', value: string): string | null => {
    if (!touched[field] || !value) return null;
    
    if (field === 'nombre') {
      const validation = validateField(value, 'username');
      return validation.isValid ? null : validation.message || null;
    }
    if (field === 'email') {
      const validation = validateField(value, 'email');
      return validation.isValid ? null : validation.message || null;
    }
    if (field === 'password') {
      const validation = validatePasswordStrength(value);
      return validation.isValid ? null : validation.message || null;
    }
    return null;
  };

  // Helper para clases condicionales de estilo
  const getInputStyle = (hasError: boolean) => [
    styles.input,
    hasError && styles.inputError,
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header con botón regresar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Cuenta</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Logo o título */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>EDUTECH</Text>
        <Text style={styles.subtitle}>Regístrate para comenzar</Text>
      </View>

      {/* Formulario */}
      <View style={styles.form}>
        {/* Campo Nombre */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#888" />
          <TextInput
            style={getInputStyle(!!getError('nombre', nombre))}
            placeholder="Nombre completo"
            placeholderTextColor="#999"
            value={nombre}
            onChangeText={setNombre}
            onBlur={() => setTouched(prev => ({ ...prev, nombre: true }))}
          />
        </View>
        {getError('nombre', nombre) !== null && (
          <Text style={styles.errorText}>{getError('nombre', nombre)}</Text>
        )}

        {/* Campo Email */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#888" />
          <TextInput
            style={getInputStyle(!!getError('email', email))}
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {getError('email', email) !== null && (
          <Text style={styles.errorText}>{getError('email', email)}</Text>
        )}

        {/* Campo Contraseña */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" />
          <TextInput
            style={getInputStyle(!!getError('password', password))}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
            secureTextEntry
          />
        </View>
        {getError('password', password) !== null && (
          <Text style={styles.errorText}>{getError('password', password)}</Text>
        )}

        {/* Campo Confirmar Contraseña */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" />
          <TextInput
            style={getInputStyle(!!(touched.confirmarPassword && !confirmarPassword))}
            placeholder="Confirmar contraseña"
            placeholderTextColor="#999"
            value={confirmarPassword}
            onChangeText={setConfirmarPassword}
            onBlur={() => setTouched(prev => ({ ...prev, confirmarPassword: true }))}
            secureTextEntry
          />
        </View>
        {touched.confirmarPassword && !confirmarPassword && (
          <Text style={styles.errorText}>Este campo es requerido</Text>
        )}
        {touched.confirmarPassword && confirmarPassword && password !== confirmarPassword && (
          <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
        )}

        {/* Botón Registrar */}
        <TouchableOpacity 
          style={[styles.registerButton, loading && styles.registerButtonDisabled]} 
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerButtonText}>
            {loading ? 'Registrando...' : 'REGISTRARSE'}
          </Text>
        </TouchableOpacity>

        {/* Enlace a Login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginLink}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  form: {
    paddingHorizontal: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 8,
  },
});