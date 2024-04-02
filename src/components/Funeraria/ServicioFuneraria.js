import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native';

const backgroundImg = require('../imagenes/Fondofuneraria.jpg');

const ServicioFuneraria = ({ navigation }) => {
  const goToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Mensaje */}
        <Text style={styles.messageText}>
          Conmemora a tu compañero de vida con el amor y respeto que merecen. Además, obtendrás beneficios adicionales como descuentos en veterinarias aliadas, kit de cumpleaños y mucho más para celebrar su vida de la mejor manera.
        </Text>

        {/* Tarjeta del Plan Básico Mensual Mascota */}
        <TouchableOpacity style={styles.planCard} onPress={() => goToScreen('Basico')}>
          <Image source={require('../imagenes/Basico.jpg')} style={styles.planImage} />
          <Text style={styles.planTitle}>Plan Básico Mensual Mascota</Text>
          <TouchableOpacity style={styles.planButton} onPress={() => goToScreen('Basico')}>
            <Text style={styles.buttonText}>Explorar</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Tarjeta del Plan Premium Mensual Mascota */}
        <TouchableOpacity style={styles.planCard} onPress={() => goToScreen('Premium')}>
          <Image source={require('../imagenes/Premium.jpg')} style={styles.planImage} />
          <Text style={styles.planTitle}>Plan Premium Mensual Mascota</Text>
          <TouchableOpacity style={styles.planButton} onPress={() => goToScreen('Premium')}>
            <Text style={styles.buttonText}>Explorar</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Puedes agregar más tarjetas según sea necesario */}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 20,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 5,
    width: '100%', // Añadido para mantener el tamaño
  },
  planImage: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingHorizontal: 10,
    color: 'black',
    textAlign: 'center',
  },
  planButton: {
    backgroundColor: '#2F9FFA',
    padding: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ServicioFuneraria;
