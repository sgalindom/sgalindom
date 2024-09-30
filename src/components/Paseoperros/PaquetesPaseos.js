import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ImageBackground, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PaquetesPaseos = ({ navigation }) => {
  const fondoPaquetesImage = require('../imagenes/fondomain.jpg');
  const paseoImage = require('../imagenes/fondomain.jpg'); // Imagen representativa de paseos

  const animatedScale = new Animated.Value(1);

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(animatedScale, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animatedScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const navigateToSolicitudPaseo = () => {
    navigation.navigate('SolicitudPaseo');
  };

  return (
    <ImageBackground source={fondoPaquetesImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Nuestros Paseos</Text>

        <Animated.View style={[styles.infoCard, { transform: [{ scale: animatedScale }] }]} onTouchStart={startAnimation}>
          <Image source={paseoImage} style={styles.paseoImage} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>¿Por qué elegir nuestros paseos?</Text>
            <Text style={styles.infoText}>
              Ofrecemos paseos profesionales y seguros para tu mascota. Nuestro servicio está diseñado para que tu perro
              se mantenga activo, feliz y saludable. Con opciones diarias, semanales y mensuales, puedes adaptar el
              servicio a las necesidades de tu peludo.
            </Text>
            <Text style={styles.infoText}>
              Nos encargamos de que tu perro disfrute de un ambiente seguro, bajo el cuidado de paseadores expertos que
              garantizarán su bienestar.
            </Text>
          </View>
        </Animated.View>

        <TouchableOpacity style={styles.agendarButton} onPress={navigateToSolicitudPaseo}>
          <Text style={styles.agendarButtonText}>¡Agenda ya tu Paseo!</Text>
          <Icon name="arrow-forward-circle" size={24} color="#fff" style={styles.agendarIcon} />
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: '#F0F8FF',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: '#FF6F61',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    marginVertical: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  paseoImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 15,
    marginBottom: 20,
  },
  infoTextContainer: {
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    textAlign: 'justify',
  },
  agendarButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6F61',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    marginTop: 20,
  },
  agendarButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  agendarIcon: {
    marginLeft: 10,
  },
});

export default PaquetesPaseos;
