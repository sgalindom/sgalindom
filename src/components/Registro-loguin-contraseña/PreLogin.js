import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const backgroundImage = require('../imagenes/PreLogin.jpg');

function PreLogin({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const isAdmin = await checkAdminStatus(user.email);

          if (isAdmin) {
            console.log('Usuario autenticado como administrador');
            navigation.replace('paneladmin');
          } else {
            console.log('Usuario autenticado como usuario normal');
            navigation.replace('MainPanel');
          }
        } catch (error) {
          console.error('Error al verificar el estado del usuario', error);
          navigation.replace('Login');
        } finally {
          setIsLoading(false);
        }
      } else {
        // El usuario no está autenticado, redirige a Login
        navigation.replace('Inicio');
        setIsLoading(false);
      }
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2F9FFA" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={backgroundImage} style={styles.backgroundImage} />
    </View>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
});

export default PreLogin;
