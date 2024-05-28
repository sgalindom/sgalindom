import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ImageBackground, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const VeterinariaScreen = () => {
  const navigation = useNavigation();
  const doctorImage = require('../../imagenes/logo_.png');
  const ubicacionImage = require('../../imagenes/ubicacion.jpg');
  const backgroundImage = require('../../imagenes/fondomain.jpg');

  const sharedButtonStyle = {
    backgroundColor: '#2AC9FA',
    padding: 10,
    borderRadius: 4,
    width: '100%',
    marginTop: 8,
  };

  const sharedCardStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    margin: 16,
    width: '80%',  // Ajustar el ancho según tus preferencias
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'white',
  };

  const goToDomicilio = () => {
    navigation.navigate('vet2serviciosmedicos');
  };

  const goToUbicanos = () => {
    const direccionURL = 'https://www.google.com/maps/place/Centro+Cl%C3%ADnico+Veterinario+los+Andes/@7.1025409,-73.1276746,15z/data=!4m2!3m1!1s0x0:0x4f54888661049721?sa=X&ved=2ahUKEwiUwY2ajOKDAxWFnWoFHZF_DGUQ_BJ6BAhFEAA&hl=es';
    Linking.openURL(direccionURL);
  };

  const handleCalificar = () => {
    navigation.navigate('vet1calificacion');
  };

  const renderCalificarButton = () => (
    <TouchableOpacity
      style={[styles.calificarButton, sharedButtonStyle, { marginTop: 20, width: '40%' }]}
      onPress={handleCalificar}
    >
      <Text style={styles.calificarButtonText}>Califícanos</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Conoce los servicios de Centro Clínico Veterinario los Andes</Text>
        <TouchableOpacity
          style={[styles.servicioCard, sharedCardStyle]}
          onPress={goToDomicilio}
        >
          <View style={styles.imageContainer}>
            <Image source={doctorImage} style={styles.servicioImage} />
          </View>
          <Text style={styles.servicioTitle}>Servicios médicos</Text>
          <Text style={styles.servicioDescription}>Explora los diversos servicios que ofrecemos para tu mascota</Text>
          <TouchableOpacity
            style={[styles.explorarButtonStyle, sharedButtonStyle]}
            onPress={goToDomicilio}
          >
            <Text style={styles.explorarButtonText}>Explorar</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.servicioCard, sharedCardStyle, styles.ubicanosCard]}
          onPress={goToUbicanos}
        >
          <View style={styles.imageContainer}>
            <Image source={ubicacionImage} style={styles.servicioImage} />
          </View>
          <Text style={styles.servicioTitle}>Ubícanos</Text>
          <Text style={styles.servicioDescription}>Encuéntranos en el mapa y visítanos.</Text>
          <TouchableOpacity
            style={[styles.explorarButtonStyle, sharedButtonStyle, styles.ubicanosButton]}
            onPress={goToUbicanos}
          >
            <Text style={styles.explorarButtonText}>Explorar</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {renderCalificarButton()}
      </ScrollView>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: '#2AC9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  servicioCard: {
    borderRadius: 8,
    overflow: 'hidden',
    margin: 16,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'white',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    overflow: 'hidden',
  },
  servicioImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  servicioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    marginLeft: 8,
    marginRight: 8,
    textAlign: 'center',
  },
  servicioDescription: {
    fontSize: 14,
    marginVertical: 8,
    marginLeft: 8,
    marginRight: 8,
  },
  explorarButtonStyle: {
    backgroundColor: '#2AC9FA',
    padding: 10,
    borderRadius: 4,
    width: '100%',
    marginTop: 8,
  },
  explorarButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  ubicanosCard: {
    marginTop: 10,
  },
  ubicanosButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2AC9FA',
    padding: 10,
    borderRadius: 4,
  },
  calificarButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 8,
    width: '40%',
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  calificarButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default VeterinariaScreen;
