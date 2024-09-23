import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Linking, ScrollView, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

const VerveterinariasScreen = ({ route, navigation }) => {
  const { veterinariaId } = route.params || {};
  const [veterinaria, setVeterinaria] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0)); // Animación para desvanecimiento

  useEffect(() => {
    if (veterinariaId) {
      const obtenerDatosVeterinaria = async () => {
        try {
          const snapshot = await firestore().collection('Veterinarias').doc(veterinariaId).get();

          if (snapshot.exists) {
            setVeterinaria(snapshot.data());
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }).start(); // Animar desvanecimiento
          } else {
            console.log('No se encontró la veterinaria con el ID proporcionado.');
          }
        } catch (error) {
          console.error('Error al obtener datos de la veterinaria:', error);
        }
      };

      obtenerDatosVeterinaria();
    } else {
      console.log('No se ha proporcionado un ID válido.');
    }
  }, [veterinariaId]);

  if (!veterinaria) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={require('../imagenes/fondomain.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <View style={styles.cardContainer}>
            {/* Contenedor para centrar la imagen */}
            <View style={styles.imageWrapper}>
              <Image source={{ uri: veterinaria.Foto }} style={styles.image} />
            </View>
            <Text style={styles.title}>{veterinaria.Nombre}</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.description}>{veterinaria.Descripcion}</Text>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Icon name="location" size={20} color="#2AC9FA" style={styles.icon} />
                <Text style={styles.infoText}>{veterinaria.Barrio}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="location-sharp" size={20} color="#2AC9FA" style={styles.icon} />
                <Text style={styles.infoText}>{veterinaria.Direccion}</Text>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Servicios</Text>
              {veterinaria.Servicios && veterinaria.Servicios.split('-').map((servicio, index) => (
                <Text key={index} style={styles.service}>{servicio.trim()}</Text>
              ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(`tel:${veterinaria.Telefono}`)}>
              <Icon name="call" size={20} color="white" style={styles.icon} />
              <Text style={styles.buttonText}>Llamar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonOutline} onPress={() => Linking.openURL(veterinaria.Maps)}>
              <Icon name="map" size={20} color="#2AC9FA" style={styles.icon} />
              <Text style={styles.buttonOutlineText}>Abrir Mapa</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    width: '100%',
  },
  imageWrapper: {
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center', // Centra horizontalmente
    marginBottom: 20,
  },
  image: {
    width: '50%',
    height: 200,
    borderRadius: 15,
    shadowColor: '#2AC9FA', // Sombra color neón
    shadowOpacity: 0.6,
    shadowOffset: { width: 5, height: 8 },
    shadowRadius: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2AC9FA', // Verde neón
    marginBottom: 15,
    textAlign: 'center',
  },
  descriptionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'justify',
  },
  infoContainer: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2AC9FA', // Verde neón
    marginBottom: 10,
  },
  service: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2AC9FA', // Verde neón
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#2AC9FA', // Sombras neón
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  buttonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2AC9FA', // Borde neón
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 10,
    width: '100%',
  },
  buttonOutlineText: {
    color: '#2AC9FA', // Texto neón
    marginLeft: 5,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: '#fff',
  },
});

export default VerveterinariasScreen;
