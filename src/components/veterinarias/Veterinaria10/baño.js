import React from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BañoScreen = () => {
  const navigation = useNavigation();
  const bañoImage = require('../../imagenes/baño2.jpg');
  const fondoImage = require('../../imagenes/fondopanelbaño.jpg');

  const llamarVeterinaria = () => {
    Linking.openURL('tel:+573202212377');
  };

  return (
    <ImageBackground source={fondoImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={bañoImage} style={styles.bañoImage} />
        <Text style={styles.servicioText}>Servicio de Baño de Perros y Gatos</Text>
        <Text style={styles.servicioDescription}>
          Ofrecemos un servicio de baño de alta calidad para perros y gatos, cuidando la higiene y el bienestar de tu mascota.
        </Text>
        <TouchableOpacity style={styles.agendarButton} onPress={() => navigation.navigate('vet1bañocita')}>
          <Text style={styles.buttonText}>Agendar Cita</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.llamarButton} onPress={llamarVeterinaria}>
          <Text style={styles.buttonText}>Llamar a la Veterinaria</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  bañoImage: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  servicioText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'black',
    textAlign: 'center',
  },
  servicioDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    color: 'black',
  },
  agendarButton: {
    backgroundColor: '#2F9FFA',
    padding: 15,
    borderRadius: 8,
    margin: 10,
    width: 280,
  },
  llamarButton: {
    backgroundColor: '#2F9FFA',
    padding: 15,
    borderRadius: 8,
    margin: 10,
    width: 280,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BañoScreen;
