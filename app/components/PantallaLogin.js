import React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useLogin } from "../hooks/useLogin";

const PantallaLogin = () => {
    //Deconstruir nuestro hook
    const {
        email,
        setEmail,
        password,
        setPassword,
        handleLogin
    } = useLogin();

    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>Iniciar Sesion.</Text>
            {/* Input Correo */}

            <TextInput
            style={styles.input}
            placeholder="Correo Electronico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-adress"
            autoCapitalize="none"/>

            <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEbtry={true}/>

            <Button 
            title="Iniciar Sesion"
            onPress={handleLogin}
            color="#28a745"/>
            
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
    },
    titulo: {
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
})

export default PantallaLogin;