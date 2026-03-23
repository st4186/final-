import { Alert, Button, View } from "react-native";
import StorageService from "../helpers/StorageService";

//Todos los hooks empiezan en minuscula y las demas inicos de palabras en mayuscula.
//Componentes en mayuscula
//Funciones genericas en minuscula
const LoginScreen = () => {
    const handleLogin = async (email, password, token) => {
        //Validar con REGEX
        //true / false
        if (!StorageService.validate('email', email)) {
            Alert.alert ("Error", "Correo no valido");
            return;
        }
        //Guardar datos sensibles de forma segura
        await StorageService.saveCredentials(email, token);

        //Guardar datos generales
        await StorageService.setItem('last_login', new Date().toString());

        Alert.alert("Exito", "Sesion iniciada y protegida")
    }

    return (
        <View style={{padding:20}}>
            <Button
            title="Simular Login"
            onPress={() => handleLogin('dev@correo.com', 'Pas123', 'SECRET-123')} //Handle es para el triger de un componente, depende de un componente, tambien es una funcion. Las funciones auxiliares se pueden nombrar de otra forma. 
            />
        </View>
    )//() es para la vista siempre, asi es la sintaxis y {} regresar un objeto.
}

export default LoginScreen;