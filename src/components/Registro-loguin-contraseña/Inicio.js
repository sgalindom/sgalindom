import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ImageBackground, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';

const Inicio = () => {
  const navigation = useNavigation();
  const [backgroundUrl, setBackgroundUrl] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const backgroundUrl = await storage().ref('imagenes/fondomain.jpg').getDownloadURL();
        const logoUrl = await storage().ref('imagenes/fondoperfil.jpg').getDownloadURL();
        setBackgroundUrl(backgroundUrl);
        setLogoUrl(logoUrl);
      } catch (error) {
        console.error('Error fetching images from Firebase Storage', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      await auth().signInWithCredential(googleCredential);
      Alert.alert('Inicio de sesión con Google exitoso');
      navigation.navigate('MainPanel');
    } catch (error) {
      console.error(error);
      Alert.alert('Error en el inicio de sesión con Google', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: backgroundUrl }} style={styles.background}>
        <Image source={{ uri: logoUrl }} style={styles.logo} />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Icon name="log-in-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Registro')}>
          <Icon name="person-add-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogleSignIn}>
          <Icon name="logo-google" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Iniciar Sesión con Google</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Color de fondo del contenedor principal
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 300, // Ancho de la imagen del logo
    height: 150, // Alto de la imagen del logo
    resizeMode: 'contain',
    marginBottom: 50, // Espacio entre el logo y los botones
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
    elevation: 3, // Leve sombra para dar profundidad
    width: '80%', // Ancho de los botones
  },
  googleButton: {
    backgroundColor: '#DB4437',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Inicio;
