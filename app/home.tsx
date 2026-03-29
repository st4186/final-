/**
 * Pantalla principal de la aplicación
 * Muestra los recursos en uso y permite navegar a otras pantallas
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Datos de ejemplo
const recursos = [
  { id: '1', nombre: 'LAB CHAIRS', ubicacion: 'Building B- BL01', usuario: 'user@gmail.com', estado: 'IN USE' },
  { id: '2', nombre: 'IT LAB', ubicacion: 'Building D- DL02', usuario: 'user@gmail.com', estado: 'IN QUEUE' },
  { id: '3', nombre: 'INDUSTRIAL WORKSHOP', ubicacion: 'Building B', usuario: 'user@gmail.com', estado: 'IN QUEUE', horario: '9AM-10AM' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');

  // Filtrar recursos
  const recursosFiltrados = recursos.filter(item =>
    item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Color según estado
  const getColorEstado = (estado: string) => {
    if (estado === 'IN USE') return '#FF9800';
    if (estado === 'IN QUEUE') return '#F44336';
    return '#4CAF50';
  };

  // Tarjeta de recurso
  const TarjetaRecurso = ({ item }: any) => (
    <View style={styles.tarjeta}>
      <View style={styles.tarjetaEncabezado}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={[styles.estado, { color: getColorEstado(item.estado) }]}>
          {item.estado}
        </Text>
      </View>
      <Text style={styles.ubicacion}>{item.ubicacion}</Text>
      {item.horario && <Text style={styles.horario}>TIME: {item.horario}</Text>}
      <Text style={styles.usuario}>Usuario: {item.usuario}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Encabezado */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>EDUTECH</Text>
          <Text style={styles.subtitulo}>Resources available</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle-outline" size={40} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View style={styles.buscadorContainer}>
        <View style={styles.buscador}>
          <Ionicons name="search-outline" size={18} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Check inventory"
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>
      </View>

      {/* Botón SEE LIST */}
      <TouchableOpacity 
        style={styles.botonLista} 
        onPress={() => router.push('/inventory')}
      >
        <Text style={styles.textoBoton}>SEE LIST</Text>
        <Ionicons name="arrow-forward" size={18} color="#4A90E2" />
      </TouchableOpacity>

      {/* Título de sección */}
      <Text style={styles.tituloSeccion}>IN USE AND LOCATION</Text>

      {/* Lista de recursos */}
      <FlatList
        data={recursosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={TarjetaRecurso}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />

      {/* Barra inferior */}
      <View style={styles.barraInferior}>
        <TouchableOpacity style={styles.itemBarra}>
          <Ionicons name="home" size={22} color="#4A90E2" />
          <Text style={[styles.textoBarra, styles.textoActivo]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.itemBarra}
          onPress={() => router.push('/inventory')}
        >
          <Ionicons name="search-outline" size={22} color="#999" />
          <Text style={styles.textoBarra}>Search</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.itemBarra}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person-outline" size={22} color="#999" />
          <Text style={styles.textoBarra}>Profile</Text>
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
  subtitulo: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  buscadorContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  botonLista: {
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
  textoBoton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  tituloSeccion: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  tarjetaEncabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nombre: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  estado: {
    fontSize: 11,
    fontWeight: '600',
  },
  ubicacion: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  horario: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },
  usuario: {
    fontSize: 11,
    color: '#888',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  barraInferior: {
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
  itemBarra: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  textoBarra: {
    fontSize: 10,
    color: '#999',
  },
  textoActivo: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});