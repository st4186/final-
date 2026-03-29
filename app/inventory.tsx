/**
 * Pantalla de inventario
 * Muestra todos los recursos disponibles con botón REQUEST
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

// Lista de recursos
const recursos = [
  { id: '1', nombre: 'LIBRARY CUBICLE', ubicacion: 'LEARNING COMMONS', estado: 'AVAILABLE' },
  { id: '2', nombre: 'MAC LAB', ubicacion: 'BUILDING D', estado: 'AVAILABLE' },
  { id: '3', nombre: 'INDUSTRIAL WORKSHOP', ubicacion: 'BUILDING B', estado: 'AVAILABLE' },
  { id: '4', nombre: 'LASER PRINTER', ubicacion: 'BUILDING D', estado: 'AVAILABLE' },
  { id: '5', nombre: 'LAB CHAIRS', ubicacion: 'BUILDING B- BL01', estado: 'IN USE' },
  { id: '6', nombre: 'IT LAB', ubicacion: 'BUILDING D- DL02', estado: 'IN QUEUE' },
];

export default function InventoryScreen() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');

  // Filtrar recursos
  const recursosFiltrados = recursos.filter(item =>
    item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Color según estado
  const colorEstado = (estado: string) => {
    if (estado === 'AVAILABLE') return '#4CAF50';
    if (estado === 'IN USE') return '#FF9800';
    return '#F44336';
  };

  // Botón REQUEST
  const solicitar = (nombre: string) => {
    alert(`Solicitaste: ${nombre}`);
  };

  // Tarjeta de recurso
  const Tarjeta = ({ item }: any) => (
    <View style={styles.tarjeta}>
      <View style={styles.fila}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={[styles.estado, { color: colorEstado(item.estado) }]}>
          {item.estado}
        </Text>
      </View>
      <Text style={styles.ubicacion}>{item.ubicacion}</Text>
      <TouchableOpacity 
        style={styles.boton}
        onPress={() => solicitar(item.nombre)}
      >
        <Text style={styles.textoBoton}>REQUEST</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Total Resources</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Buscador */}
      <View style={styles.buscador}>
        <Ionicons name="search-outline" size={18} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Search inventory"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* Lista */}
      <FlatList
        data={recursosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={Tarjeta}
        contentContainerStyle={styles.lista}
      />
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
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  buscador: {
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
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
    marginBottom: 12,
  },
  boton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});