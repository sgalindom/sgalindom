import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Linking, ScrollView, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment-timezone';

const AdieguarScreen = ({ route }) => {
  const { adieguarId } = route.params;
  const [guarderia, setGuarderia] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0)); // Animación de desvanecimiento

  useEffect(() => {
    const obtenerDatosGuarderia = async () => {
      try {
        const snapshot = await firestore().collection('Guarderiasyadiestramiento').doc(adieguarId).get();

        if (snapshot.exists) {
          setGuarderia(snapshot.data());
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start(); // Animar desvanecimiento
        } else {
          console.log('No se encontró la guardería o adiestramiento con el ID proporcionado.');
        }
      } catch (error) {
        console.error('Error al obtener datos de la guardería o adiestramiento:', error);
      }
    };

    obtenerDatosGuarderia();
  }, [adieguarId]);

  const llamarTelefono = () => {
    if (guarderia && guarderia.Telefono) {
      Linking.openURL(`tel:${guarderia.Telefono}`);
    }
  };

  const abrirMapa = () => {
    if (guarderia && guarderia.Maps) {
      Linking.openURL(guarderia.Maps);
    }
  };

  const abrirPagina = () => {
    if (guarderia && guarderia.Pagina) {
      Linking.openURL(guarderia.Pagina);
    }
  };

  const isAbierto = (horario) => {
    if (horario && horario.apertura && horario.cierre) {
      const now = moment();
      const horaActual = now.format('HH:mm');
      return horaActual >= horario.apertura && horaActual <= horario.cierre;
    } else {
      return false;
    }
  };

  if (!guarderia) {
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
            {/* Contenedor para la imagen de la guardería */}
            <View style={styles.imageWrapper}>
              <Image source={{ uri: guarderia.Foto }} style={styles.image} />
            </View>
            <Text style={styles.title}>{guarderia.Nombre}</Text>

            {/* Descripción de la Guardería */}
            <View style={styles.descriptionCard}>
              <Text style={styles.description}>{guarderia.Descripcion}</Text>
            </View>

            {/* Información de la guardería */}
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Icon name="location" size={22} color="#2AC9FA" style={styles.icon} />
                <Text style={styles.infoText}>{guarderia.Barrio}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="location-sharp" size={22} color="#2AC9FA" style={styles.icon} />
                <Text style={styles.infoText}>{guarderia.Direccion}</Text>
              </View>
            </View>

            {/* Servicios ofrecidos */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Servicios</Text>
              {guarderia.Servicios && guarderia.Servicios.split('-').map((servicio, index) => (
                <Text key={index} style={styles.service}>{servicio.trim()}</Text>
              ))}
            </View>

            {/* Botones de acción */}
            <TouchableOpacity style={styles.button} onPress={llamarTelefono}>
              <Icon name="call" size={20} color="white" style={styles.icon} />
              <Text style={styles.buttonText}>Llamar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonOutline} onPress={abrirMapa}>
              <Icon name="map" size={20} color="#2AC9FA" style={styles.icon} />
              <Text style={styles.buttonOutlineText}>Abrir Mapa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonOutline} onPress={abrirPagina}>
              <Icon name="globe" size={20} color="#2AC9FA" style={styles.icon} />
              <Text style={styles.buttonOutlineText}>Abrir Página Web</Text>
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
    width: '80%',
    height: 200,
    borderRadius: 20,
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
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  service: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2AC9FA', // Botón de color llamativo
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 30,
    marginVertical: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 30,
    borderColor: '#2AC9FA',
    borderWidth: 2,
    marginVertical: 12,
  },
  buttonOutlineText: {
    color: '#2AC9FA',
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: '#333',
  },
});

export default AdieguarScreen;
