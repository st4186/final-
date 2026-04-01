
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getToken } from './src/helpers/storage';

export default function Index() {
  const router = useRouter();

  React.useEffect(() => {
    // Verificar si ya hay sesión iniciada
    const checkSession = async () => {
      const token = await getToken();
      if (token) {
        router.replace('/home');
      }
    };
    checkSession();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EDUTECH</Text>
      <Text style={styles.subtitle}>Recursos disponibles</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/login')}
      >
        <Text style={styles.buttonText}>Comenzar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#fff'
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 8,
    color: '#007AFF'
  },
  subtitle: { 
    fontSize: 16, 
    color: '#666', 
    marginBottom: 40 
  },
  button: { 
    backgroundColor: '#007AFF', 
    paddingHorizontal: 32, 
    paddingVertical: 12, 
    borderRadius: 8 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
  }
});
