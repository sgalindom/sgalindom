import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const backgroundImg = require('../imagenes/fondomain.jpg');

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
        <View style={styles.planCard}>
          <Image source={require('../imagenes/Basico.jpg')} style={styles.planImage} />
          <View style={styles.planContent}>
            <Text style={styles.planTitle}>Plan Básico Mensual Mascota</Text>
            <TouchableOpacity style={styles.planButton} onPress={() => goToScreen('Basico')}>
              <Icon name="paw" size={24} color="#fff" style={styles.planButtonIcon} />
              <Text style={styles.buttonText}>Explorar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tarjeta del Plan Premium Mensual Mascota */}
        <View style={styles.planCard}>
          <Image source={require('../imagenes/Premium.jpg')} style={styles.planImage} />
          <View style={styles.planContent}>
            <Text style={styles.planTitle}>Plan Premium Mensual Mascota</Text>
            <TouchableOpacity style={styles.planButton} onPress={() => goToScreen('Premium')}>
              <Icon name="star" size={24} color="#fff" style={styles.planButtonIcon} />
              <Text style={styles.buttonText}>Explorar</Text>
            </TouchableOpacity>
          </View>
        </View>

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
    marginBottom: 30,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 10,
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    marginBottom: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    width: '90%',
  },
  planImage: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
  },
  planContent: {
    padding: 15,
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
    textAlign: 'center',
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 15,
  },
  planButtonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ServicioFuneraria;
