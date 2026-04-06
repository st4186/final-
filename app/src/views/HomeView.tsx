/**
 * HomeView - Vista principal (UI layer)
 * Patrón MVVM: Esta vista solo maneja presentación y eventos
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { UserResource } from '../models';
import { useHomeViewModel } from '../viewmodels/useHomeViewModel';

export default function HomeView() {
  const router = useRouter();
  const {
    loading,
    error,
    resources,
    filteredResources,
    getStatusColor,
    cancelRequest,
    loadResources,
  } = useHomeViewModel();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadResources();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleCancel = async (resource: UserResource) => {
    Alert.alert(
      'Cancelar solicitud',
      `¿Deseas cancelar la solicitud de "${resource.nombre}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            const success = await cancelRequest(resource.id);
            if (success) {
              Alert.alert('Cancelado', 'Solicitud eliminada');
            } else {
              Alert.alert('Error', 'No se pudo cancelar');
            }
          },
        },
      ]
    );
  };

  const getStatusBadgeStyle = (estado: string) => {
    switch (estado) {
      case 'IN USE':
        return { bg: '#5b3fd4', text: '#d4c8ff' };
      case 'IN QUEUE':
        return { bg: '#d4760a', text: '#fff3e0' };
      default:
        return { bg: '#444', text: '#ccc' };
    }
  };

  const ResourceCard = ({ item }: { item: UserResource }) => {
    const badge = getStatusBadgeStyle(item.estado);
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.cardLabel}>ITEM</Text>
            <Text style={styles.resourceName}>{item.nombre}</Text>
          </View>
          {item.horario && (
            <Text style={styles.schedule}>Time: {item.horario}</Text>
          )}
        </View>

        <Text style={styles.location}>{item.ubicacion}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.userRow}>
            <Ionicons name="person-outline" size={13} color="#888" />
            <Text style={styles.userText}>{item.usuario}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>
              {item.estado}
            </Text>
          </View>
        </View>

        {item.estado === 'IN QUEUE' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancel(item)}
          >
            <Text style={styles.cancelButtonText}>CANCELAR</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5b3fd4" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color="#F44336" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadResources}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const filtered = filteredResources(searchQuery);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1040" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="cube-outline" size={20} color="white" />
          </View>
          <Text style={styles.logoText}>EDUTECH</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle-outline" size={32} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Resources available</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Text style={styles.searchLabel}>Check inventory:</Text>
          <View style={styles.searchPill}>
            <Text style={styles.searchPlaceholder}>Search</Text>
            <Ionicons name="search-outline" size={14} color="#aaa" />
          </View>
        </View>
      </View>

      {/* SEE LIST button */}
      <TouchableOpacity
        style={styles.listButton}
        onPress={() => router.push('/inventory')}
      >
        <Text style={styles.listButtonText}>SEE LIST</Text>
        <View style={styles.listButtonIcon}>
          <Ionicons name="cube-outline" size={20} color="white" />
        </View>
      </TouchableOpacity>

      {/* Panel claro con lista */}
      <View style={styles.listPanel}>
        <Text style={styles.sectionTitle}>IN USE AND LOCATION</Text>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ResourceCard item={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? 'No se encontraron resultados'
                  : 'No hay recursos en uso'}
              </Text>
            </View>
          }
        />
      </View>

      {/* Bottom nav */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={22} color="#5b3fd4" />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/inventory')}
        >
          <Ionicons name="search-outline" size={22} color="#9990c0" />
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person-outline" size={22} color="#9990c0" />
          <Text style={styles.navText}>Profile</Text>
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
    color: '#F44336',
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
    paddingBottom: 4,
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
  subtitleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#1a1040',
  },
  subtitle: {
    color: '#ccc',
    fontSize: 13,
  },

  // Search
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#1a1040',
  },
  searchBox: {
    backgroundColor: '#2d1f6e',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchLabel: {
    color: '#ccc',
    fontSize: 13,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#3d2f8e',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  searchPlaceholder: {
    color: '#ccc',
    fontSize: 13,
  },

  // SEE LIST button
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#5b3fd4',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
  },
  listButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  listButtonIcon: {
    width: 38,
    height: 38,
    backgroundColor: '#f97316',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // List panel
  listPanel: {
    flex: 1,
    backgroundColor: '#f5f3ff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 70,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7c6fb0',
    letterSpacing: 1,
    marginBottom: 14,
  },
  list: {
    paddingBottom: 20,
  },

  // Card
  card: {
    backgroundColor: '#1a1040',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardLabel: {
    color: '#aaa',
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  resourceName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  schedule: {
    color: '#aaa',
    fontSize: 11,
  },
  location: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#2d1f6e',
    paddingTop: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  userText: {
    color: '#aaa',
    fontSize: 11,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#c0392b',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Empty
  empty: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9990c0',
    fontSize: 14,
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
