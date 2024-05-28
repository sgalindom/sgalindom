import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const backgroundImg = require('../imagenes/fondomain.jpg');

// Nuevo componente para la tarjeta de información
const InfoCard = ({ title, description, icon }) => (
  <View style={styles.card}>
    <Icon name={icon} size={24} color="#2F9FFA" style={styles.icon} />
    <View style={styles.textContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
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
          <InfoCard title="Total Integrantes" description="1" icon="users" />
          <InfoCard title="Mascotas hasta los 10 años" description="Incluidas" icon="paw" />
          <InfoCard title="Precio base mensual" description="$12.500 COP" icon="money" />
          <InfoCard
            title="Recogida y traslado de la mascotas"
            description="Desde la veterinaria o casa hasta el lugar de cremación"
            icon="car"
          />
          <InfoCard title="Entrega de cenizas en cofre o bonsai" description="Incluida" icon="tree" />
          <InfoCard title="Terapia virtual para superar la pérdida" description="Incluida" icon="heart" />
          <InfoCard title="Homenaje de despedida" description="Incluido" icon="globe" />
          <InfoCard title="Monto máximo de cubrimiento" description="$600.000 COP" icon="credit-card" />
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
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  infoContainer: {
    marginBottom: 20,
    width: '100%',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  cardDescription: {
    fontSize: 16,
    color: '#555',
  },
  solicitarButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Basico;
