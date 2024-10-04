import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, StyleSheet, Dimensions, ActivityIndicator, Animated, Modal } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const backgroundImage = require('../imagenes/fondomain.jpg');
const logoImage = require('../imagenes/logo_.png');

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonScale] = useState(new Animated.Value(1));
  const [hidePassword, setHidePassword] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar el modal
  const [modalMessage, setModalMessage] = useState(''); // Mensaje a mostrar en el modal

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setIsLoading(true);  // Mostrar el indicador de carga mientras se verifica
          const isAdmin = await checkAdminStatus(user.email);
          
          if (isAdmin) {
            console.log('Inicio de sesión exitoso - Administrador');
            navigation.reset({
              index: 0,
              routes: [{ name: 'paneladmin' }],  // Asegúrate de que el stack se limpie y navegue directamente a admin
            });
          } else {
            console.log('Inicio de sesión exitoso - Usuario normal');
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainPanel' }],  // Limpia el stack y navega al MainPanel
            });
          }
        } catch (error) {
          console.error('Error al verificar el estado del usuario', error);
          showErrorModal('Inicio de sesión fallido. Inténtalo de nuevo.');
        } finally {
          setIsLoading(false);  // Ocultar el indicador de carga
        }
      } else {
        console.log('Usuario no autenticado, redirigiendo al Login');
        navigation.navigate('Login');  // Redirigir al Login si no hay usuario autenticado
      }
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  
    return unsubscribe;
  }, [navigation, fadeAnim]);
  
  

  const checkAdminStatus = async (userEmail) => {
    try {
      const adminSnapshot = await firestore()
        .collection('Administradores')
        .doc(userEmail)
        .get();

      return adminSnapshot.exists;
    } catch (error) {
      console.error('Error al verificar el estado del usuario', error);
      throw new Error('Error al verificar el estado del usuario');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showErrorModal('Por favor, completa todos los campos.');
      return;
    }

    if (!isValidEmail(email)) {
      showErrorModal('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    try {
      setIsLoading(true);
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      if (error.code === 'auth/invalid-email') {
        showErrorModal('El correo electrónico es inválido.');
      } else if (error.code === 'auth/wrong-password') {
        showErrorModal('La contraseña es incorrecta.');
      } else if (error.code === 'auth/user-not-found') {
        showErrorModal('No se encontró una cuenta con ese correo electrónico.');
      } else {
        showErrorModal('Inicio de sesión fallido. Verifica tus credenciales.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const showErrorModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
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
              keyboardType="email-address"
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
            />
          </View>

          {/* Modal para errores */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Icon name="exclamation-circle" size={50} color="red" />
                <Text style={styles.modalText}>{modalMessage}</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity onPress={handleLogin}>
            <Animated.View style={[styles.button, { transform: [{ scale: buttonScale }] }]}>
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRecuperarContraseña}>
            <Text style={styles.recuperarText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </Animated.View>
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
    backgroundColor: '#FFFFFF',
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
    color: '#333',
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    color: '#333',
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
    shadowRadius: 8,
    elevation: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF0000',
    marginBottom: 10,
    textAlign: 'center',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
  },
  enlaceRecuperarContraseña: {
    marginVertical: 10,
  },
  enlaceRecuperarContraseñaTexto: {
    color: 'black',
    fontSize: 16,
  },
  registerButton: {
    marginTop: 20,
  },
  registerButtonText: {
    color: 'black',
    fontSize: 16,
  },
  bottomRightTextContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  bottomRightText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  modalButton: {
    backgroundColor: '#2F9FFA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Login;
