import { useState } from "react";
import { Alert } from "react-native";

//Un hook = encapsular toda la logica (Login).

export const useLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Espacio vacio validation
        if (email.trim() === '' || password.trim() === ''){
            Alert.alert('Error', 'Todos los campos son requeridos.');
            return;
        }

        if (!email.includes('@')){
            Alert.alert('Error', 'Agregue un email valido.');
            return;
        }

        //Simulation 
        Alert.alert('Exito', `Inicio de sesion correcto con: ${email}`);

        setEmail('');
        setPassword('');
    }

    //Hook exporta a la vista
    return{
        email,
        setEmail,
        password,
        setPassword,
        handleLogin
    }
}