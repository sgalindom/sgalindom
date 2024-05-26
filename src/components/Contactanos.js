import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Linking, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image source={tuFoto} style={styles.foto} />
          <Text style={styles.text}>¡Hola!</Text>
          <Text style={styles.descripcion}>
            Soy Sebastian G, el desarrollador de esta aplicación. Si deseas hacer parte de esta aplicacion e incluir tu negocio o tienes alguna pregunta o sugerencia, ¡no dudes en contactarme!
          </Text>
          <TouchableOpacity style={styles.whatsappButton} onPress={contactarWhatsApp}>
            <Icon name="logo-whatsapp" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Contactar por WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.llamarButton} onPress={llamarDesarrollador}>
            <Icon name="call" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Llamar al Desarrollador</Text>
          </TouchableOpacity>
        </View>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Oscurecer el fondo para mejor legibilidad
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fondo blanco semitransparente
    borderRadius: 10,
  },
  foto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#34B7F1', // Agregar borde colorido alrededor de la foto
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000', // Color negro para contraste
  },
  descripcion: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    color: '#000', // Color negro para contraste
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    padding: 15,
    borderRadius: 8,
    margin: 10,
    width: 280,
  },
  llamarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34B7F1',
    padding: 15,
    borderRadius: 8,
    margin: 10,
    width: 280,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
});

export default ContactanosScreen;
