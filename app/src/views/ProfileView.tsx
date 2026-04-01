/**
 * ProfileView - Vista de perfil de usuario (UI layer)
 * Patrón MVVM: Esta vista solo maneja presentación y eventos
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useAuthViewModel } from '../viewmodels/useAuthViewModel';
import { useProfileViewModel } from '../viewmodels/useProfileViewModel';

export default function ProfileView() {
  const router = useRouter();
  const { logout } = useAuthViewModel();
  const { user, loading, error, loadUserProfile } = useProfileViewModel();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Quieres salir de la aplicación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Salir', 
          onPress: async () => {
            setIsLoggingOut(true);
            const success = await logout();
            setIsLoggingOut(false);
            if (success) {
              router.replace('/login');
            } else {
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            }
          } 
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#F44336" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadUserProfile}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header con botón regresar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Foto y nombre del usuario */}
      <View style={styles.profileInfo}>
        <Ionicons name="person-circle" size={80} color="#4A90E2" />
        <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'usuario@edutech.com'}</Text>
        {user?.role && (
          <Text style={styles.userRole}>{user.role.toUpperCase()}</Text>
        )}
      </View>

      {/* Opciones del menú */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={22} color="#4A90E2" />
          <Text style={styles.menuText}>Mi cuenta</Text>
          <Ionicons name="chevron-forward" size={18} color="#ccc" style={styles.menuIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="time-outline" size={22} color="#4CAF50" />
          <Text style={styles.menuText}>Mis reservas</Text>
          <Ionicons name="chevron-forward" size={18} color="#ccc" style={styles.menuIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={22} color="#FF9800" />
          <Text style={styles.menuText}>Ayuda</Text>
          <Ionicons name="chevron-forward" size={18} color="#ccc" style={styles.menuIcon} />
        </TouchableOpacity>
      </View>

      {/* Botón cerrar sesión */}
      <TouchableOpacity 
        style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]} 
        onPress={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <ActivityIndicator size="small" color="#F44336" />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={22} color="#F44336" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Versión */}
      <Text style={styles.version}>EDUTECH v1.0.0</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  profileInfo: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  userRole: {
    fontSize: 12,
    color: '#4A90E2',
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  menu: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  menuIcon: {
    marginLeft: 'auto',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F44336',
    gap: 8,
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
  version: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 24,
  },
});