import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Linking, Image } from 'react-native';

const backgroundImage = require('./imagenes/fondopanelbaño.jpg');
const tuFoto = require('./imagenes/tu_foto.jpg');

const ContactanosScreen = () => {
  const contactarWhatsApp = () => {
    Linking.openURL('whatsapp://send?text=Hola, estoy contactándote desde Pet Services la app&phone=+123456789');
  };

  const llamarDesarrollador = () => {
    Linking.openURL('tel:+57 3202212377');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={tuFoto} style={styles.foto} />
        <Text style={styles.text}>¡Hola!</Text>
        <Text style={styles.descripcion}>
          Soy Sebastian G, el desarrollador de esta aplicación. Si deseas hacer parte de esta aplicacion e incluir tu negocio o tienes alguna pregunta o sugerencia, ¡no dudes en contactarme!
        </Text>
        <TouchableOpacity style={styles.whatsappButton} onPress={contactarWhatsApp}>
          <Text style={styles.buttonText}>Contactar por WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.llamarButton} onPress={llamarDesarrollador}>
          <Text style={styles.buttonText}>Llamar al Desarrollador</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  foto: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF', // Cambia el color del texto si es necesario para que sea visible en la imagen de fondo
  },
  descripcion: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    color: '#FFFFFF', // Cambia el color del texto si es necesario para que sea visible en la imagen de fondo
  },
  whatsappButton: {
    backgroundColor: '#34B7F1',
    padding: 15,
    borderRadius: 8,
    margin: 10,
    width: 280,
  },
  llamarButton: {
    backgroundColor: '#34B7F1',
    padding: 15,
    borderRadius: 8,
    margin: 10,
    width: 280,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ContactanosScreen;
