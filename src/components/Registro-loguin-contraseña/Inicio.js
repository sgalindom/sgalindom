import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import auth from '@react-native-firebase/auth';

const Inicio = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthStatus = () => {
      const unsubscribe = auth().onAuthStateChanged(user => {
        if (user) {
          // Si el usuario está autenticado, navega al MainPanel
          navigation.navigate('MainPanel');
        }
      });
      // Cleanup subscription on unmount
      return () => unsubscribe();
    };

    checkAuthStatus();
  }, [navigation]);

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToRegistro = () => {
    navigation.navigate('Registro');
  };

  const navigateToHola = () => {
    navigation.navigate('proximamente');
  };

  return (
    <View style={styles.container}>
      <FastImage
        style={styles.background}
        source={require('../imagenes/MiPerfil.jpg')} // Cambia esta ruta al lugar donde está la imagen en tu proyecto
        resizeMode={FastImage.resizeMode.cover}
      >
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={navigateToLogin}
          >
            <Icon name="log-in-outline" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={navigateToRegistro}
          >
            <Icon name="person-add-outline" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={navigateToHola}
          >
            <Icon name="logo-google" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Iniciar Sesión con Google</Text>
          </TouchableOpacity>
        </View>
      </FastImage>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonsContainer: {
    position: 'absolute',
    top: '20%',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    borderRadius: 30,
    elevation: 3,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
});

export default Inicio;
