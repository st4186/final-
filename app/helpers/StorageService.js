//Encriptar todo lo que queramos aqui en vez de que sea en cada archivo.
//Keychain, Async Storage and REGEX.
//Trata SIEMPRE de optimizar tu codigo.

import AsyncStorage from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';

class StorageService {
    //REGEX
    //Commun patterns
    static patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    };

    static validate(type, value) {
        return this.patterns[type] ? this.patterns[type].test(value): false;
    }

    //ASYNC STORAGE - Data No Sencisble
    //Async espera un subproceso
    static async setItem(key, value){
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (error) {
            console.error("Error guradando en AsyncStorage", error);
        }
    }

    static async getItem(key){
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error("Error obteniendo en AsyncStorage", error);
        }
    }

    //KEYCHAIN - Data Sensible
    //No modificar los datos(no se convierte la informacion sensible a JSON)
    static async saveCredentials(username, token){
        try {
            await Keychain.setGenericPassword(username, token);
            return true;
        } catch (error) {
            console.error("Error en Keychain", error);
        }
    }
}

//Investigar Await, Parsear, operadores ternarios