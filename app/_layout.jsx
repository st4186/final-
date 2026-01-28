import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function RootLayout() {
  const [mood, setMood] = useState('Neutral 😐');

  const [control, setControl] = useState(20);

  return (
    <View style={styles.container} >
      <Text style={styles.title} >Hoy me siento: {mood}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Feliz 😊" onPress={() => setMood("Feliz 😊")}/>
        <Button title="Cansado 🥱" onPress={() => setMood("Cansado 🥱")}/>
        <Button title="Productivo 🫡" onPress={() => setMood("Productivo 🫡")}/>
      </View>

      <Text style={{fontSize: control}}>Controlo mi tamaño</Text>
      <View style={styles.buttonContainer}>
        <Button title="Mas" onPress={() => setControl(control +1)}/>
        <Button title="Menos" onPress={() => setControl(control -1)}/> 
      </View>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    felx: 1, //Abarca toda la pantalla
    justifyContent: 'center' ,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
    titleControl: {
    fontSize: 24,
    marginBottom: 20
  },
  buttonContainer: {
    gap: 10
  }
});
