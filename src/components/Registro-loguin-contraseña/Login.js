import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const backgroundImage = require('../imagenes/Login.jpg');
const logoImage = require('../imagenes/logo_2.png');

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const isAdmin = await checkAdminStatus(user.email);

          if (isAdmin) {
            console.log('Inicio de sesión exitoso - Administrador');
            navigation.navigate('paneladmin');
          } else {
            console.log('Inicio de sesión exitoso - Usuario normal');
            navigation.navigate('MainPanel');
          }
        } catch (error) {
          console.error('Error al verificar el estado del usuario', error);
          setError('Inicio de sesión fallido. Inténtalo de nuevo.');
        }
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, [navigation]);

  const checkAdminStatus = async (userEmail) => {
    const adminSnapshot = await firestore()
      .collection('Administradores')
      .doc(userEmail)
      .get();

    return adminSnapshot.exists;
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      setIsLoading(true);

      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (!user) {
        throw new Error('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      setError('Inicio de sesión fallido. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecuperarContraseña = () => {
    navigation.navigate('RecuperarContraseña');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2F9FFA" />
      </View>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} />
        </View>
        <Text style={styles.welcomeText}>Bienvenido</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Correo electrónico</Text>
          <TextInput
            placeholder="Correo electrónico"
            onChangeText={(text) => setEmail(text)}
            value={email}
            style={[styles.input, { color: 'black', borderColor: 'black' }]}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <TextInput
            style={[styles.input, { color: 'black', borderColor: 'black' }]}
            placeholder="Contraseña"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRecuperarContraseña} style={styles.enlaceRecuperarContraseña}>
          <Text style={styles.enlaceRecuperarContraseñaTexto}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Registro')} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>¿No tienes una cuenta? Regístrate</Text>
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
    justifyContent: 'flex-start',
    padding: 24,
    paddingTop: 50,
  },
  logoContainer: {
    marginBottom: 3, // Aumenta el margen inferior del contenedor de logo
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2, // Aumenta el margen inferior del texto de bienvenida
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 2, // Aumenta el margen inferior del contenedor de entrada
  },
  inputLabel: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    marginBottom: 2, // Aumenta el margen inferior del campo de entrada
    padding: 12,
    backgroundColor: 'white',
    color: 'black',
  },
  button: {
    backgroundColor: '#2F9FFA',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginVertical: 1, // Aumenta el margen vertical del botón
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: 1, // Aumenta el margen superior del botón de registro
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  enlaceRecuperarContraseña: {
    marginTop: 1, // Aumenta el margen superior del enlace de recuperación de contraseña
  },
  enlaceRecuperarContraseñaTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 1, // Aumenta el margen inferior del texto de error
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default Login;
