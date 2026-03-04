import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useContact } from "../hooks/useContact.js";

const PantallaContacto = () => {
    //Deconstruir nuestro hook
    const {
        name,
        setName,
        age,
        setAge,
        email,
        setEmail,
        handleContact
    } = useContact();

    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>Iniciar Sesion.</Text>
            {/* Input Contacto */}

            <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
            keyboardType="default"
            autoCapitalize="words"/>

            <TextInput
            style={styles.input}
            placeholder="Edad"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"/>

            <TextInput
            style={styles.input}
            placeholder="Correo Electronico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-adress"
            autoCapitalize="none"/>

            <Button 
            title="Registrar Contacto."
            onPress={handleContact}
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

export default PantallaContacto;