import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const PerfilImage = () => {
  return (
    <ImageBackground source={require('../../imagenes/fondoperfil.jpg')} style={styles.perfilImageContainer} resizeMode="cover" />
  );
};

const TextoBienvenida = () => {
  return (
    <View style={styles.textContainer}>
      <Text style={styles.title}>¡Bienvenido a Pet Shop!</Text>
      <Text style={styles.subtitle}>Encuentra todo para consentir a tu mascota</Text>
    </View>
  );
};

const Vet1Screen = () => {
  const navigation = useNavigation();
  const backgroundImage = require('../../imagenes/fondomain.jpg');

  const goToComida = () => {
    navigation.navigate('vet1comida');
  };

  const goToJuguetes = () => {
    navigation.navigate('vet1juguetes');
  };

  const goToAccesorios = () => {
    navigation.navigate('vet1accesorios');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <PerfilImage />
        </View>
        <View style={styles.bottomContainer}>
          <TextoBienvenida />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={goToComida} accessibilityLabel="Comida para Mascotas" accessibilityRole="button">
              <Icon name="paw-outline" size={30} color="white" />
              <Text style={styles.buttonText}>Comida para Mascotas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={goToJuguetes} accessibilityLabel="Juguetes Divertidos" accessibilityRole="button">
              <Icon name="paw-print-outline" size={30} color="white" />
              <Text style={styles.buttonText}>Juguetes Divertidos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={goToAccesorios} accessibilityLabel="Accesorios de Estilo" accessibilityRole="button">
              <Icon name="ribbon-outline" size={30} color="white" />
              <Text style={styles.buttonText}>Accesorios de Estilo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  topContainer: {
    flex: 0.4,
    justifyContent: 'flex-end',
  },
  perfilImageContainer: {
    width: '100%',
    height: '69%',
    justifyContent: 'flex-end',
  },
  bottomContainer: {
    flex: 0.6,
    justifyContent: 'flex-start',
  },
  textContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2AC9FA',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonsContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2AC9FA',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginLeft: 10,
  },
});

export default Vet1Screen;
