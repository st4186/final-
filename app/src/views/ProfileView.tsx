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
  ScrollView,
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
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#f97316" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color="#f97316" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadUserProfile}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1040" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="cube-outline" size={20} color="white" />
          </View>
          <Text style={styles.logoText}>EDUTECH</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={26} color="#aaa" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Avatar + nombre ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={52} color="white" />
          </View>
          <Text style={styles.userName}>{user?.nombre || user?.name || 'Usuario'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'usuario@edutech.com'}</Text>
          {user?.role && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
            </View>
          )}
        </View>

        {/* ── Panel blanco con menú ── */}
        <View style={styles.panel}>
          <Text style={styles.sectionLabel}>MY ACCOUNT</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconBox, { backgroundColor: '#5b3fd4' }]}>
              <Ionicons name="person-outline" size={18} color="white" />
            </View>
            <Text style={styles.menuText}>Mi cuenta</Text>
            <Ionicons name="chevron-forward" size={18} color="#9990c0" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconBox, { backgroundColor: '#f97316' }]}>
              <Ionicons name="time-outline" size={18} color="white" />
            </View>
            <Text style={styles.menuText}>Mis reservas</Text>
            <Ionicons name="chevron-forward" size={18} color="#9990c0" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconBox, { backgroundColor: '#2d1f6e' }]}>
              <Ionicons name="help-circle-outline" size={18} color="white" />
            </View>
            <Text style={styles.menuText}>Ayuda</Text>
            <Ionicons name="chevron-forward" size={18} color="#9990c0" />
          </TouchableOpacity>
        </View>

        {/* ── Botón cerrar sesión ── */}
        <TouchableOpacity
          style={[styles.logoutButton, isLoggingOut && { opacity: 0.7 }]}
          onPress={handleLogout}
          disabled={isLoggingOut}
          activeOpacity={0.85}
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.version}>EDUTECH v1.0.0</Text>
      </ScrollView>

      {/* ── Bottom nav ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <Ionicons name="home-outline" size={22} color="#9990c0" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/inventory')}>
          <Ionicons name="search-outline" size={22} color="#9990c0" />
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={22} color="#5b3fd4" />
          <Text style={[styles.navText, styles.navTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1040',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1a1040',
  },
  loadingText: {
    marginTop: 12,
    color: '#aaa',
    fontSize: 14,
  },
  errorText: {
    color: '#f97316',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#5b3fd4',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#1a1040',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#f97316',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#f97316',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Scroll
  scroll: {
    paddingBottom: 100,
  },

  // Avatar section
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: '#1a1040',
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#5b3fd4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#f97316',
    marginBottom: 14,
  },
  userName: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  userEmail: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 4,
  },
  roleBadge: {
    marginTop: 10,
    backgroundColor: '#f97316',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Panel (fondo claro con el menú)
  panel: {
    backgroundColor: '#f5f3ff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7c6fb0',
    letterSpacing: 1,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: '#1a1040',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0daf5',
    marginLeft: 52,
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c0392b',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Version
  version: {
    textAlign: 'center',
    color: '#7c6fb0',
    fontSize: 12,
    marginTop: 20,
  },

  // Bottom nav
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#f5f3ff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0daf5',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  navText: {
    fontSize: 10,
    color: '#9990c0',
  },
  navTextActive: {
    color: '#5b3fd4',
    fontWeight: '600',
  },
});
