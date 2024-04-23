import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ImageBackground } from 'react-native';

const PaquetesPaseos = ({ navigation }) => {
  const diarioImage = require('../imagenes/Diario.jpg');
  const semanalImage = require('../imagenes/semanal.jpg');
  const mensualImage = require('../imagenes/mensual.jpg');
  const fondoPaquetesImage = require('../imagenes/fondopanelbaño.jpg');

  const sharedButtonStyle = {
    backgroundColor: '#2F9FFA',
    padding: 10,
    borderRadius: 4,
    width: 280,
    margin: 10,
  };

  const navigateToSolicitudPaseo = (paquete) => {
    navigation.navigate('SolicitudPaseo', { paquete });
  };

  return (
    <ImageBackground source={fondoPaquetesImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Elige un paquete de paseos:</Text>
        <TouchableOpacity
          style={styles.paqueteCard}
          onPress={() => navigateToSolicitudPaseo('Diario')}
        >
          <Image source={diarioImage} style={styles.paqueteImage} />
          <Text style={styles.paqueteTitle}>Paquete Diario</Text>
          <Text style={styles.paqueteDescription}>Paseos diarios para tu perro.</Text>
          <Text style={styles.paquetePrice}>$12.000 por día</Text>
          <TouchableOpacity style={sharedButtonStyle} onPress={() => navigateToSolicitudPaseo('Diario')}>
            <Text style={styles.solicitarButtonText}>Solicitar</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paqueteCard}
          onPress={() => navigateToSolicitudPaseo('Semanal')}
        >
          <Image source={semanalImage} style={styles.paqueteImage} />
          <Text style={styles.paqueteTitle}>Paquete Semanal</Text>
          <Text style={styles.paqueteDescription}>Paseos semanales para tu perro.</Text>
          <Text style={styles.paquetePrice}>$60.000 por semana</Text>
          <TouchableOpacity style={sharedButtonStyle} onPress={() => navigateToSolicitudPaseo('Semanal')}>
            <Text style={styles.solicitarButtonText}>Solicitar</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paqueteCard}
          onPress={() => navigateToSolicitudPaseo('Mensual')}
        >
          <Image source={mensualImage} style={styles.paqueteImage} />
          <Text style={styles.paqueteTitle}>Paquete Mensual</Text>
          <Text style={styles.paqueteDescription}>Paseos mensuales para tu perro.</Text>
          <Text style={styles.paquetePrice}>$240.000 por mes</Text>
          <TouchableOpacity style={sharedButtonStyle} onPress={() => navigateToSolicitudPaseo('Mensual')}>
            <Text style={styles.solicitarButtonText}>Solicitar</Text>
          </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: 'white',
  },
  paqueteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  paqueteImage: {
    width: 290,
    height: 260,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },
  paqueteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  paqueteDescription: {
    fontSize: 16,
    marginTop: 8,
  },
  paquetePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  solicitarButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PaquetesPaseos;
