/**
 * InventoryScreen - Pantalla de inventario (UI layer)
 * Patrón MVVM: Vista conectada a useInventoryViewModel
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

import { Resource } from './src/models/Inventory';
import { useInventoryViewModel } from './src/viewmodels/useInventoryViewModel';

export default function InventoryScreen() {
  const router = useRouter();
  const {
    loading,
    error,
    filteredResources,
    loadResources,
    updateFilters,
    requestResource,
    getStatusColor,
  } = useInventoryViewModel();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadResources();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    updateFilters({ search: text });
  };

  const handleRequest = async (item: Resource) => {
    if (item.estado !== 'AVAILABLE') return;
    Alert.alert(
      'Solicitar recurso',
      `¿Deseas solicitar "${item.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Solicitar',
          onPress: async () => {
            const success = await requestResource(item.id);
            if (success) {
              Alert.alert('Éxito', 'Recurso solicitado correctamente');
            } else {
              Alert.alert('Error', 'No se pudo solicitar el recurso');
            }
          },
        },
      ]
    );
  };

  const getBadgeStyle = (estado: string) => {
    switch (estado) {
      case 'AVAILABLE':
        return { bg: '#4CAF50', text: '#fff' };
      case 'IN USE':
        return { bg: '#5b3fd4', text: '#d4c8ff' };
      case 'IN QUEUE':
        return { bg: '#d4760a', text: '#fff3e0' };
      default:
        return { bg: '#888', text: '#fff' };
    }
  };

  const ResourceCard = ({ item }: { item: Resource }) => {
    const badge = getBadgeStyle(item.estado);
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.cardLabel}>ITEM</Text>
            <Text style={styles.resourceName}>{item.nombre}</Text>
          </View>
          <Text style={styles.timeText}>Time: -</Text>
        </View>

        <Text style={styles.location}>{item.ubicacion}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.userRow}>
            <Ionicons name="person-outline" size={13} color="#888" />
            <Text style={styles.userText}>anyone using it</Text>
          </View>
          <TouchableOpacity
            style={[styles.badge, { backgroundColor: badge.bg }]}
            onPress={() => handleRequest(item)}
            disabled={item.estado !== 'AVAILABLE'}
          >
            <Text style={[styles.badgeText, { color: badge.text }]}>
              {item.estado}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5b3fd4" />
          <Text style={styles.loadingText}>Cargando inventario...</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#1a1040" />
            <Text style={styles.backText}>|</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="cube-outline" size={16} color="white" />
          </View>
          <Text style={styles.logoText}>EDUTECH</Text>
        </View>

        {/* Search pill */}
        <View style={styles.searchPill}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <Ionicons name="search-outline" size={14} color="#aaa" />
        </View>
      </View>

      {/* Panel con lista */}
      <View style={styles.listPanel}>
        <FlatList
          data={filteredResources}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ResourceCard item={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No se encontraron resultados' : 'No hay recursos disponibles'}
              </Text>
            </View>
          }
        />
      </View>

      {/* Bottom nav */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <Ionicons name="time-outline" size={22} color="#9990c0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="cube-outline" size={22} color="#5b3fd4" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Ionicons name="person-outline" size={22} color="#9990c0" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#888',
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    color: '#ccc',
    fontSize: 18,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoIcon: {
    width: 26,
    height: 26,
    backgroundColor: '#f97316',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#f97316',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0eeff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    flex: 1,
    maxWidth: 130,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    padding: 0,
  },

  // List panel
  listPanel: {
    flex: 1,
    backgroundColor: '#f5f3ff',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 70,
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
  timeText: {
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
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
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
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0daf5',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
});
