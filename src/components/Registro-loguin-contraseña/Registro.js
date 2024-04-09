import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const logoImage = require('../imagenes/logo_3.png');
const backgroundImage = require('../imagenes/Registro.jpg');

function Registro({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [edad, setEdad] = useState('');

  const handleRegistro = async () => {
    try {
      if (password !== confirmPassword) {
        console.error('Las contraseñas no coinciden');
        return;
      }

      await auth().createUserWithEmailAndPassword(email, password);
      console.log('Registro exitoso');

      const user = auth().currentUser;

      if (user) {
        const userData = {
          nombreCompleto,
          telefono,
          direccion,
          edad,
        };

        // Crea la colección "datos" dentro del perfil del usuario y agrega los datos
        await firestore().collection('usuarios').doc(user.email).collection('datos').add(userData);

        navigation.navigate('MainPanel');
      }
    } catch (error) {
      console.error('Error al registrar usuario', error);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} />
        </View>
        <Text style={styles.welcomeText}>Regístrate aquí</Text>
        <Text style={styles.sectionTitle}>Datos personales</Text>
        <TextInput
          placeholder="Nombre completo"
          onChangeText={(text) => setNombreCompleto(text)}
          style={styles.input}
          placeholderTextColor="black" // Cambiado a negro
        />
        <TextInput
          placeholder="Teléfono"
          onChangeText={(text) => setTelefono(text)}
          style={styles.input}
          placeholderTextColor="black" // Cambiado a negro
        />
        <TextInput
          placeholder="Dirección"
          onChangeText={(text) => setDireccion(text)}
          style={styles.input}
          placeholderTextColor="black" // Cambiado a negro
        />
        <TextInput
          placeholder="Edad"
          onChangeText={(text) => setEdad(text)}
          style={styles.input}
          placeholderTextColor="black" // Cambiado a negro
        />
        <TextInput
          placeholder="Correo electrónico"
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          placeholderTextColor="black" // Cambiado a negro
        />
        <Text style={styles.sectionTitle}>Mi contraseña</Text>
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          placeholderTextColor="black" // Cambiado a negro
        />
        <TextInput
          placeholder="Confirmar contraseña"
          secureTextEntry
          onChangeText={(text) => setConfirmPassword(text)}
          style={styles.input}
          placeholderTextColor="black" // Cambiado a negro
        />
        <TouchableOpacity onPress={handleRegistro} style={styles.button}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: windowWidth,
    height: windowHeight,
  },
  logoContainer: {
    marginBottom: 1,
  },
  logo: {
    width: 250,
    height: 200,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black', // Cambiado a negro
    borderRadius: 4,
    width: 280,
    marginBottom: 10,
    padding: 8,
    backgroundColor: 'white',
    color: 'black', // Cambiado a negro
  },
  button: {
    backgroundColor: '#2F9FFA',
    padding: 10,
    borderRadius: 4,
    width: 280,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Registro;
