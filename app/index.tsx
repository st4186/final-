import React, { useState } from "react";
import { Text, View } from "react-native";

const GeneradorSaludos = () => {
  //State definition
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
}

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
