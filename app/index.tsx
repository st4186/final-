import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

const GeneradorSaludos = () => {
  //State definition
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');

  //Function to trigger the action btn
  const handleBtnHello = () => {
    //Empty space validation
    if (name.trim() === '' || age.trim() === '' || email.trim() === ''){
      Alert.alert('Error', 'Please, all fields are required');
      return;
    }
    //Show alert with hello message
    Alert.alert('Welcome', `Hello, ${name} with email ${email} you are ${age} years old.`);

    //Clean
    setName('');
    setAge('');
    setEmail('');
  }

  
  
  //Structure
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingresa tus datos</Text>

      <TextInput
      style={styles.input}
      placeholder="Escribe tu nombre"
      value={name}
      onChangeText={setName} // Actualizar el estado/espacio de memoria cada vez que entra un caracteren el input
      autoCapitalize="words" //Pone en mayuscula la primer letra
      />
      
      <TextInput
      style={styles.input}
      placeholder="Escribe tu edad"
      value={age}
      onChangeText={setAge} // Actualizar el estado/espacio de memoria cada vez que entra un caracteren el input
      keyboardType="numeric"
      maxLength={3}
      />

      <TextInput
      style={styles.input}
      placeholder="Escribe tu email"
      value={email}
      onChangeText={setEmail} // Actualizar el estado/espacio de memoria cada vez que entra un caracteren el input
      maxLength={20}
      keyboardType="email-address"
      />

      <Button
      title="Saludar"
      onPress={handleBtnHello}
      color="#00bfff"
      />
    </View>
  )
}

export default function Index() {
  return (
    <GeneradorSaludos/>
  );
}

  const styles =  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: '#F5F5F5'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#333'
    },
    input: {
      height: 50,
      borderColor: '#cccccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 15,
      backgroundColor: '#ffffff',
      fontSize: 16
    }
  });