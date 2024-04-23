import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Vet2Consultas = () => {
  const navigation = useNavigation();
  const backgroundImage = require('../../imagenes/fondomain.jpg');
  const medico1Image = require('../../imagenes/veterinaria2.jpg');
  const medico2Image = require('../../imagenes/veterinaria2.jpg');
  const medico3Image = require('../../imagenes/veterinaria2.jpg');
  const medico4Image = require('../../imagenes/veterinaria2.jpg');

  const medicos = [
    { id: 1, nombre: 'Dr. Juan Pérez', especialidad: 'Médico General', caracteristicas: 'Experiencia en atención primaria' },
    { id: 2, nombre: 'Dra. María García', especialidad: 'Pediatra', caracteristicas: 'Especializada en cuidado infantil' },
    { id: 3, nombre: 'Dr. Carlos Rodríguez', especialidad: 'Cirujano', caracteristicas: 'Especializado en cirugías generales' },
    { id: 4, nombre: 'Dra. Ana Martínez', especialidad: 'Dermatóloga', caracteristicas: 'Tratamientos para la piel y dermatología' },
  ];

  const sendWhatsAppMessage = (medico) => {
    const phoneNumber = '+573212016821';
    const message = `Hola, estoy interesado en agendar una cita con el Dr. ${medico.nombre}`;

    const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    Linking.openURL(whatsappURL).catch(() => {
      alert('No se puede abrir WhatsApp. Asegúrate de tener la aplicación instalada.');
    });
  };

  const goToMedicoDetails = (medico) => {
    sendWhatsAppMessage(medico);
    // También puedes agregar aquí la navegación a la pantalla de detalles del médico si es necesario
    // navigation.navigate('DetallesMedico', { medico });
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        {medicos.map((medico) => (
          <TouchableOpacity
            key={medico.id}
            style={styles.card}
            onPress={() => goToMedicoDetails(medico)}
          >
            <View style={styles.contentContainer}>
              <Image source={medico.id === 1 ? medico1Image : medico.id === 2 ? medico2Image : medico.id === 3 ? medico3Image : medico4Image} style={styles.medicoImage} />
              <View style={styles.textContainer}>
                <Text style={styles.medicoName}>{medico.nombre}</Text>
                <Text style={styles.medicoEspecialidad}>{medico.especialidad}</Text>
                <Text style={styles.medicoCaracteristicas}>{medico.caracteristicas}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 16,
  },
  card: {
    width: '90%', // Ajusta el ancho según tus necesidades
    aspectRatio: 2, // Ajusta el aspecto según tus necesidades
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo semi-transparente blanco
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    elevation: 2,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicoImage: {
    width: '40%',
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  medicoName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  medicoEspecialidad: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
  },
  medicoCaracteristicas: {
    fontSize: 12,
    color: '#777',
  },
});

export default Vet2Consultas;
