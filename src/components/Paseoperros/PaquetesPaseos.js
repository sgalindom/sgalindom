import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PaquetesPaseos = ({ navigation }) => {
  const diarioImage = require('../imagenes/Diario.jpg');
  const semanalImage = require('../imagenes/semanal.jpg');
  const mensualImage = require('../imagenes/mensual.jpg');
  const fondoPaquetesImage = require('../imagenes/fondomain.jpg');

  const navigateToSolicitudPaseo = (paquete) => {
    navigation.navigate('SolicitudPaseo', { paquete });
  };

  return (
    <ImageBackground source={fondoPaquetesImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Descubre nuestros paquetes de paseos</Text>
        <TouchableOpacity style={styles.paqueteCard} onPress={() => navigateToSolicitudPaseo('Diario')}>
          <Image source={diarioImage} style={styles.paqueteImage} />
          <View style={styles.paqueteInfo}>
            <Text style={styles.paqueteTitle}>Paseos Diarios</Text>
            <Text style={styles.paqueteDescription}>¡Haz feliz a tu perro todos los días!</Text>
            <Text style={styles.paquetePrice}>$12.000 por día</Text>
          </View>
          <Icon name="arrow-forward" size={20} color="#2F9FFA" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.paqueteCard} onPress={() => navigateToSolicitudPaseo('Semanal')}>
          <Image source={semanalImage} style={styles.paqueteImage} />
          <View style={styles.paqueteInfo}>
            <Text style={styles.paqueteTitle}>Paseos Semanales</Text>
            <Text style={styles.paqueteDescription}>Diversión asegurada para tu amigo peludo</Text>
            <Text style={styles.paquetePrice}>$60.000 por semana</Text>
          </View>
          <Icon name="arrow-forward" size={20} color="#2F9FFA" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.paqueteCard} onPress={() => navigateToSolicitudPaseo('Mensual')}>
          <Image source={mensualImage} style={styles.paqueteImage} />
          <View style={styles.paqueteInfo}>
            <Text style={styles.paqueteTitle}>Paseos Mensuales</Text>
            <Text style={styles.paqueteDescription}>Para tener a tu perro siempre feliz y activo</Text>
            <Text style={styles.paquetePrice}>$240.000 por mes</Text>
          </View>
          <Icon name="arrow-forward" size={20} color="#2F9FFA" style={styles.icon} />
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  paqueteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  paqueteImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 8,
    marginRight: 20,
  },
  paqueteInfo: {
    flex: 1,
  },
  paqueteTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333', // Color de texto cambiado
  },
  paqueteDescription: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555', // Color de texto cambiado
  },
  paquetePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F9FFA', // Color de texto cambiado
  },
  icon: {
    marginLeft: 'auto',
  },
});

export default PaquetesPaseos;
