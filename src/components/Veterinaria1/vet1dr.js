import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Vet1DrScreen = () => {
  const drWhatsAppNumber = '3202212377';
  const drBirthday = new Date('1980-01-01');

  const calculateAge = () => {
    const today = new Date();
    const age = today.getFullYear() - drBirthday.getFullYear();

    return today.getMonth() < drBirthday.getMonth() ||
      (today.getMonth() === drBirthday.getMonth() && today.getDate() < drBirthday.getDate())
      ? age - 1
      : age;
  };

  const navigation = useNavigation();

  const handleWhatsApp = () => {
    const whatsappLink = `https://wa.me/${drWhatsAppNumber}?text=${encodeURIComponent(
      'Hola Dr. Manuel, Vengo de parte de Pets Services y quisiera consultar más sobre sus servicios.'
    )}`;
    Linking.openURL(whatsappLink);
  };

  const handleLlamar = () => {
    const telefonoLink = `tel:${drWhatsAppNumber}`;
    Linking.openURL(telefonoLink);
  };

  const handleAgendarCita = () => {
    navigation.navigate('vet1citasdr');
  };

  return (
    <ImageBackground source={require('../imagenes/fondodr.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={require('../imagenes/drmanuel.jpg')} style={styles.veterinarioImage} />
        <View style={styles.textContainer}>
          <Text style={[styles.nombre, styles.blackText]}>DR. Manuel</Text>
          <Text style={[styles.profesion, styles.blackText]}>Veterinario</Text>
          <Text style={[styles.edad, styles.blackText]}>{calculateAge()} años</Text>
          <Text style={[styles.empresa, styles.blackText]}>Animal Zone</Text>
        </View>
        <View style={styles.presentationContainer}>
          <Text style={[styles.sobreMi, styles.blackText]}>¡Conoce al Dr. Manuel!</Text>
          <Text style={[styles.descripcion, styles.blackText]}>
            Bienvenido a Animal Zone, donde el bienestar de tu mascota es nuestra prioridad. Soy el
            Dr. Manuel, un veterinario apasionado con más de 10 años de experiencia en el cuidado
            de mascotas.
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handleAgendarCita} style={[styles.button, styles.agendarCitaButton]}>
            <Text style={styles.buttonText}>Agendar Cita</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLlamar} style={[styles.button, styles.llamarButton]}>
            <Text style={styles.buttonText}>Llamar</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
  },
  veterinarioImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginVertical: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  nombre: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'black',
  },
  profesion: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  edad: {
    fontSize: 20,
    marginBottom: 10,
    color: 'black',
  },
  empresa: {
    fontSize: 20,
    marginBottom: 10,
    color: 'black',
  },
  presentationContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sobreMi: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  descripcion: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#2AC9FA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  agendarCitaButton: {
    backgroundColor: '#2AC9FA',
  },
  llamarButton: {
    backgroundColor: '#2AC9FA',
  },
  blackText: {
    color: 'black',
  },
});

export default Vet1DrScreen;
