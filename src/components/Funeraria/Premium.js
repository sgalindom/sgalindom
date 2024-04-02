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

const Premium = () => {
  const handleSolicitar = () => {
    Linking.openURL('https://jardineslacolina.com/producto/plan-premium-mensual-mascota/');
  };

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Plan Premium Mascotas</Text>
        <View style={styles.infoContainer}>
          <InfoCard title="Total Integrantes" description="1" />
          <InfoCard title="Mascotas hasta los 10 años" description="" />
          <InfoCard title="Precio base mensual" description="$16.200" />
          <InfoCard
            title="Recogida y traslado de la mascotas"
            description="Desde la veterinaria o casa hasta el lugar de cremación"
          />
          <InfoCard title="Entrega de cenizas en cofre o bonsai" description="" />
          <InfoCard title="Terapia virtual para superar la pérdida" description="" />
          <InfoCard title="Homenaje de despedida" description="" />
          <InfoCard title="Monto máximo de cubrimiento" description="$600.000" />
          <InfoCard
            title="31 días después de la afiliación: Consulta médica veterinaria a domicilio o en clínica por accidente o enfermedad nueva no preexistente. Monto máximo $100.000"
            description=""
          />
          <InfoCard title="61 días después de la afiliación: Baño medicado / pipeta anti-pulgas. Monto máximo $60.000" description="" />
          <InfoCard
            title="91 días después de la afiliación: Gastos veterinarios en caso de accidente o enfermedad para consulta de urgencia y exámenes de laboratorio. Monto máximo $150.000"
            description=""
          />
          <InfoCard
        
            title="Mes de cumpleaños: Spa de cumpleaños (Auxilio para desparasitación de la mascota, Limpieza de oídos y corte de uñas). Monto máximo $80.000"
            description=""
          />
          <InfoCard
            title="Todo el año – Ilimitado: Orientación veterinaria telefónica, Orientación nutricional veterinaria – mascotas, Referencia de centros de adiestramiento, Referencia y coordinación con salón de belleza, boutiques y clínicas veterinarias"
            description=""
          />
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

export default Premium;
