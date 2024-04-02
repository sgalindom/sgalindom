import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, ImageBackground } from 'react-native';

const backgroundImg = require('../imagenes/Fondopremium.jpg');

// Nuevo componente para la tarjeta de información
const InfoCard = ({ title, description }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
  </View>
);

const Basico = () => {
  const handleSolicitar = () => {
    Linking.openURL('https://jardineslacolina.com/producto/plan-basico-mensual-mascota/');
  };

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Plan Básico Mascotas</Text>
        <View style={styles.infoContainer}>
          <InfoCard title="Total Integrantes" description="1" />
          <InfoCard title="Mascotas hasta los 10 años" description="" />
          <InfoCard title="Precio base mensual" description="$12.500" />
          <InfoCard
            title="Recogida y traslado de la mascotas"
            description="Desde la veterinaria o casa hasta el lugar de cremación"
          />
          <InfoCard title="Entrega de cenizas en cofre o bonsai" description="" />
          <InfoCard title="Terapia virtual para superar la pérdida" description="" />
          <InfoCard title="Homenaje de despedida" description="" />
          <InfoCard title="Monto máximo de cubrimiento" description="$600.000" />
        </View>
        <TouchableOpacity style={styles.solicitarButton} onPress={handleSolicitar}>
          <Text style={styles.buttonText}>Solicitar</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
    width: '100%',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  cardDescription: {
    fontSize: 16,
    color: 'black',
  },
  solicitarButton: {
    backgroundColor: '#2F9FFA',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Basico;
