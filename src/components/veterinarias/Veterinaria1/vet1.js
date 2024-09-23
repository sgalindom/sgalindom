import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ImageBackground, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Vet1Screen = () => {
  const navigation = useNavigation();
  const doctorImage = require('../../imagenes/fondomain.jpg');
  const bañadoImage = require('../../imagenes/fondomain.jpg');
  const ubicacionImage = require('../../imagenes/fondomain.jpg');
  const backgroundImage = require('../../imagenes/fondomain.jpg');

  const goToDomicilio = () => {
    navigation.navigate('proximamente');
  };

  const goToBañado = () => {
    navigation.navigate('proximamente');
  };

  const goToUbicanos = () => {
    const direccionURL = 'https://www.google.com/maps/place/ANIMAL+ZONE+BUCARAMANGA/@7.1029473,-73.1243192,15z/data=!4m2!3m1!1s0x0:0x264d11db2c82cc34?sa=X&ved=2ahUKEwjS94SU4_mCAxU2mYQIHehPAskQ_BJ6BAhBEAA';
    Linking.openURL(direccionURL);
  };

  const handleCalificar = () => {
    navigation.navigate('proximamente');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>¡Bienvenido a Dog's House</Text>
          <Text style={styles.subtitle}>Descubre nuestros servicios</Text>
        </View>
        <View style={styles.servicesContainer}>
          <TouchableOpacity style={styles.serviceCard} onPress={goToDomicilio}>
            <Image source={doctorImage} style={styles.serviceImage} />
            <Text style={styles.serviceTitle}>Consulta Médica</Text>
            <Text style={styles.serviceDescription}>Consulta médica para tu mascota en casa.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceCard} onPress={goToBañado}>
            <Image source={bañadoImage} style={styles.serviceImage} />
            <Text style={styles.serviceTitle}>Servicio de Bañado</Text>
            <Text style={styles.serviceDescription}>Baño y cuidado higiénico para tu mascota.</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.servicesContainer}>
          <TouchableOpacity style={styles.serviceCard} onPress={goToDomicilio}>
            <Image source={doctorImage} style={styles.serviceImage} />
            <Text style={styles.serviceTitle}>Pet Shop</Text>
            <Text style={styles.serviceDescription}>Consulta con nuestros especialistas.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceCard} onPress={goToUbicanos}>
            <Image source={ubicacionImage} style={styles.serviceImage} />
            <Text style={styles.serviceTitle}>Ubícanos</Text>
            <Text style={styles.serviceDescription}>Encuentra nuestra ubicación y visítanos.</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.rateButton} onPress={handleCalificar}>
          <Icon name="star" size={24} color="white" />
          <Text style={styles.rateButtonText}>Califica nuestro servicio</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '90%', // Ajuste para mantener las tarjetas dentro de la pantalla
  },
  serviceCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    padding: 20,
    width: '45%', // Ajustar el ancho para mostrar solo dos tarjetas por fila
  },
  serviceImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: 'black',
  },
  serviceDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: 'black',
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2AC9FA',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 60,
    marginTop: 30,
  },
  rateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
});

export default Vet1Screen;
