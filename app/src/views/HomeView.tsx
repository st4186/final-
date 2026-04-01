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

  // Manejar búsqueda
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Manejar cancelación de solicitud
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

  // Componente Tarjeta de Recurso
  const ResourceCard = ({ item }: { item: UserResource }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.resourceName}>{item.nombre}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.estado) }]}>
          {item.estado}
        </Text>
      </View>
      <Text style={styles.location}>{item.ubicacion}</Text>
      {item.horario && <Text style={styles.schedule}>TIME: {item.horario}</Text>}
      <Text style={styles.user}>Usuario: {item.usuario}</Text>
      
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

  // Estado de carga
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Cargando...</Text>
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

  const filtered = filteredResources(searchQuery);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>EDUTECH</Text>
          <Text style={styles.subtitle}>Resources available</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle-outline" size={40} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Check inventory"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Botón SEE LIST */}
      <TouchableOpacity 
        style={styles.listButton} 
        onPress={() => router.push('/inventory')}
      >
        <Text style={styles.listButtonText}>SEE LIST</Text>
        <Ionicons name="arrow-forward" size={18} color="#4A90E2" />
      </TouchableOpacity>

      {/* Título de sección */}
      <Text style={styles.sectionTitle}>IN USE AND LOCATION</Text>

      {/* Lista de recursos */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ResourceCard item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No se encontraron resultados' : 'No hay recursos en uso'}
            </Text>
          </View>
        }
      />

      {/* Barra de navegación inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={22} color="#4A90E2" />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/inventory')}
        >
          <Ionicons name="search-outline" size={22} color="#999" />
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person-outline" size={22} color="#999" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  subtitle: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  listButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 80,
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
    marginBottom: 8,
  },
  resourceName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 11,
    fontWeight: '600',
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  schedule: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },
  user: {
    fontSize: 11,
    color: '#888',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#F44336',
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 10,
    color: '#999',
  },
  navTextActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});