import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Vet2ServiciosMedicos = () => {
  const navigation = useNavigation();

  const backgroundImage = require('../../imagenes/fondomain.jpg');
  const whatsappNumber = '+573212016821';

  const goToEspecialistas = () => {
    navigation.navigate('vet2consultas');
  };

  const sendWhatsAppMessage = (message) => {
    const whatsappURL = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

    Linking.openURL(whatsappURL).catch(() => {
      alert('No se puede abrir WhatsApp. Asegúrate de tener la aplicación instalada.');
    });
  };

  const goToServicioRX = () => {
    sendWhatsAppMessage('Hola, estoy interesado en el Servicio RX. ¿Puedes proporcionarme más información?');
  };

  const goToServiciosVacunacion = () => {
    sendWhatsAppMessage('Hola, estoy interesado en los Servicios de Vacunación. ¿Puedes proporcionarme más información?');
  };

  const goToServicioLaboratorio = () => {
    sendWhatsAppMessage('Hola, estoy interesado en el Servicio de Laboratorio. ¿Puedes proporcionarme más información?');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.card} onPress={goToEspecialistas}>
          <Text style={styles.cardText}>Consulta General y Especializada</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={goToServicioRX}>
          <Text style={styles.cardText}>Servicio RX</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={goToServiciosVacunacion}>
          <Text style={styles.cardText}>Servicios Vacunación</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={goToServicioLaboratorio}>
          <Text style={styles.cardText}>Servicio de Laboratorio</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 16,
  },
  card: {
    width: '100%', // Ocupa toda la pantalla horizontal
    aspectRatio: 2, // Ajusta según tus necesidades
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo semi-transparente blanco
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    elevation: 2,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Vet2ServiciosMedicos;
