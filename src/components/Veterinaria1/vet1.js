import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ImageBackground, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const VeterinariaScreen = () => {
  const navigation = useNavigation();
  const doctorImage = require('../imagenes/doctor.jpg');
  const bañadoImage = require('../imagenes/bañado.jpg');
  const petShopImage = require('../imagenes/petshop.jpg');
  const ubicacionImage = require('../imagenes/ubicacion.jpg');
  const backgroundImage = require('../imagenes/color.jpg');
  

  const sharedCardStyle = {
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
  };

  const goToDomicilio = () => {
    navigation.navigate('vet1dr');
  };

  const goToBañado = () => {
    navigation.navigate('baño');
  };

  const goToPetShop = () => {
    navigation.navigate('petshop');
  };

  const goToUbicanos = () => {
    const direccionURL = 'https://www.google.com/maps/place/ANIMAL+ZONE+BUCARAMANGA/@7.1029473,-73.1243192,15z/data=!4m2!3m1!1s0x0:0x264d11db2c82cc34?sa=X&ved=2ahUKEwjS94SU4_mCAxU2mYQIHehPAskQ_BJ6BAhBEAA';
    Linking.openURL(direccionURL);
  };

  const handleCalificar = () => {
    navigation.navigate('vet1calificacion');
  };

  const renderCalificarButton = () => (
    <TouchableOpacity
      style={[styles.calificarButton, { marginTop: 20, width: '40%' }]}
      onPress={handleCalificar}
    >
      <Text style={styles.calificarButtonText}>Califícanos</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Conoce los servicios de Animal Zone</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.servicioCard, sharedCardStyle]}
            onPress={goToDomicilio}
          >
            <View style={styles.imageContainer}>
              <Image source={doctorImage} style={styles.servicioImage} />
            </View>
            <Text style={styles.servicioTitle}>Consulta Medica</Text>
            <Text style={styles.servicioDescription}>Consulta médica para tu mascota en casa.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.servicioCard, sharedCardStyle]}
            onPress={goToPetShop}
          >
            <View style={styles.imageContainer}>
              <Image source={petShopImage} style={styles.servicioImage} />
            </View>
            <Text style={styles.servicioTitle}>Explorar Pet Shop</Text>
            <Text style={styles.servicioDescription}>Encuentra productos y accesorios para tu mascota.</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.servicioCard, sharedCardStyle]}
            onPress={goToBañado}
          >
            <View style={styles.imageContainer}>
              <Image source={bañadoImage} style={styles.servicioImage} />
            </View>
            <Text style={styles.servicioTitle}>Servicio de Bañado de perros</Text>
            <Text style={styles.servicioDescription}>Baño y cuidado higiénico para tu mascota.</Text>
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
          </TouchableOpacity>
        </View>
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
    color: 'black', // Letra en negro
  },
  servicioDescription: {
    fontSize: 14,
    marginVertical: 8,
    marginLeft: 8,
    marginRight: 8,
    color: 'black', // Letra en negro
  },
  calificarButton: {
    backgroundColor: '#2AC9FA',
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
