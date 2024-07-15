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
  Animated,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const backgroundImage = require('../imagenes/fondomain.jpg');
const logoImage = require('../imagenes/logo_.png');

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [buttonScale] = useState(new Animated.Value(1));
  const [hidePassword, setHidePassword] = useState(true); 
  const [fadeAnim] = useState(new Animated.Value(0)); // Animación de desvanecimiento

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
      // Iniciar animación de desvanecimiento cuando los datos estén cargados
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });

    return unsubscribe;
  }, [navigation, fadeAnim]);

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

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
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
      <View style={styles.overlay}>
        <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
          <View style={styles.logoContainer}>
            <Image source={logoImage} style={styles.logo} />
          </View>
          <Text style={styles.welcomeText}>Inicia Sesión</Text>
          <View style={styles.inputContainer}>
            <Icon name="envelope" size={20} color="gray" style={styles.icon} />
            <TextInput
              placeholder="Correo electrónico"
              onChangeText={(text) => setEmail(text)}
              value={email}
              style={styles.input}
              placeholderTextColor="#333"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="gray" style={styles.icon} />
            <TextInput
              placeholder="Contraseña"
              secureTextEntry={hidePassword} 
              onChangeText={(text) => setPassword(text)}
              value={password}
              style={styles.input}
              placeholderTextColor="#333"
            />
            <TouchableOpacity
              onPress={() => setHidePassword(!hidePassword)} 
              style={styles.eyeIconContainer}
            >
              <Icon name={hidePassword ? 'eye' : 'eye-slash'} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              onPress={() => { handleLogin(); animateButton(); }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity onPress={handleRecuperarContraseña} style={styles.enlaceRecuperarContraseña}>
            <Text style={styles.enlaceRecuperarContraseñaTexto}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Registro')} style={styles.registerButton}>
            <Text style={styles.registerButtonText}>¿No tienes una cuenta? Regístrate</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <View style={styles.bottomRightTextContainer}>
        <Text style={styles.bottomRightText}>Versión 0.0.1</Text>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF', 
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: '#000000', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF', // Fondo blanco
    borderWidth: 1,
    borderColor: '#333', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  icon: {
    marginRight: 10,
    color: '#333', // Color del icono gris
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    color: '#333', // Texto gris
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerButton: {
    marginTop: 20,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: '#000000', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  enlaceRecuperarContraseña: {
    marginTop: 10,
  },
  enlaceRecuperarContraseñaTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: '#000000', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
  },
  bottomRightTextContainer: {
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
  bottomRightText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Login;
