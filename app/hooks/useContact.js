import { useState } from "react";
import { Alert } from "react-native";

export const useContact = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');

    const handleContact = () => {
        // Validación de campos vacíos
        if (name.trim() === '' || age.trim() === ''){
            Alert.alert('Error', 'Todos los campos son requeridos.');
            return;
        }

        if (email.trim() === '' || password.trim() === ''){
            Alert.alert('Error', 'Todos los campos son requeridos.');
            return;
        }

        if (!email.includes('@')){
            Alert.alert('Error', 'Agregue un email valido.');
            return;
        }

        if (email.length > 30) {
            Alert.alert('Error', 'La edad no puede tener más de 30 dígitos.');
            return;
        }

        const ageNumber = parseInt(age);

        // Validaciones de edad
        if (age.length > 3) {
            Alert.alert('Error', 'La edad no puede tener más de 3 dígitos.');
            return;
        }

        if (ageNumber > 116) {
            Alert.alert('Error', 'La edad no puede ser mayor a 116 años.');
            return;
        }

        // Éxito
        Alert.alert('Éxito', `Contacto ${name} registrado correctamente.`);
        setName('');
        setAge('');
        setEmail('');
    }

    return {
        name,
        setName,
        age,
        setAge,
        email,
        setEmail,
        handleContact
    }
}