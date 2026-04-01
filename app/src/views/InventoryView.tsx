/**
 * InventoryView - Vista de inventario (UI layer)
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

import { Resource } from '../models';
import { useInventoryViewModel } from '../viewmodels/useInventoryViewModel';

export default function InventoryView() {
  const router = useRouter();
  const {
    filteredResources,
    loading,
    error,
    loadResources,
    updateFilters,
    requestResource,
    getStatusColor,
  } = useInventoryViewModel();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadResources();
  }, []);

  // Manejar búsqueda con debounce simple
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    updateFilters({ search: text });
  };

  // Manejar solicitud de recurso
  const handleRequest = async (resource: Resource) => {
    if (resource.estado !== 'AVAILABLE') {
      Alert.alert(
        'No disponible',
        `Este recurso está actualmente: ${resource.estado}`
      );
      return;
    }

    Alert.alert(
      'Confirmar solicitud',
      `¿Deseas solicitar "${resource.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Solicitar',
          onPress: async () => {
            const success = await requestResource(resource.id);
            if (success) {
              Alert.alert('Éxito', 'Solicitud enviada correctamente');
            } else {
              Alert.alert('Error', 'No se pudo procesar la solicitud');
            }
          },
        },
      ]
    );
  };

  // Componente Tarjeta (definido dentro para acceso a funciones)
  const ResourceCard = ({ item }: { item: Resource }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.resourceName}>{item.nombre}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.estado) }]}>
          {item.estado}
        </Text>
      </View>
      <Text style={styles.location}>{item.ubicacion}</Text>
      <TouchableOpacity
        style={[
          styles.requestButton,
          item.estado !== 'AVAILABLE' && styles.requestButtonDisabled,
        ]}
        onPress={() => handleRequest(item)}
        disabled={item.estado !== 'AVAILABLE'}
      >
        <Text style={styles.requestButtonText}>REQUEST</Text>
      </TouchableOpacity>
    </View>
  );

  // Estado de carga
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Cargando inventario...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Estado de error
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
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Total Resources</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search inventory"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de recursos */}
      <FlatList
        data={filteredResources}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ResourceCard item={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No se encontraron recursos</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  resourceName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  status: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 8,
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  requestButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestButtonDisabled: {
    backgroundColor: '#ccc',
  },
  requestButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  empty: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});