import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const backgroundImage = require('../imagenes/recontraseña.jpg');
const logoImage = require('../imagenes/logo_2.png');

function RecuperarContraseña({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleRecuperarContraseña = async () => {
    try {
      if (!email) {
        Alert.alert('Por favor, ingresa un correo electrónico');
        return;
      }

      console.log('Intentando enviar correo de restablecimiento de contraseña...');
      await auth().sendPasswordResetEmail(email);
      console.log('Correo de restablecimiento de contraseña enviado con éxito.');

      // Mostrar alerta de éxito
      Alert.alert(
        'Correo Enviado',
        'Se ha enviado un correo con instrucciones para restablecer tu contraseña.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      console.error('Error al enviar correo de restablecimiento de contraseña', error);
      setError('Error al enviar correo de restablecimiento de contraseña. Inténtalo de nuevo.');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <TextInput
          placeholder="Correo electrónico"
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          placeholderTextColor="black" // Cambiado a negro
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity onPress={handleRecuperarContraseña} style={styles.button}>
          <Text style={styles.buttonText}>Recuperar Contraseña</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black', // Cambiado a negro
    borderRadius: 8,
    width: '100%',
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'white',
    color: 'black', // Cambiado a negro
  },
  button: {
    backgroundColor: '#2F9FFA',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 10,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
});

export default RecuperarContraseña;
