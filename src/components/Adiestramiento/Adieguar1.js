import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment-timezone';

const AdieguarScreen = ({ route }) => {
  const { adieguarId } = route.params;
  const [guarderia, setGuarderia] = useState(null);

  useEffect(() => {
    const obtenerDatosGuarderia = async () => {
      try {
        const snapshot = await firestore().collection('Guarderiasyadiestramiento').doc(adieguarId).get();

        if (snapshot.exists) {
          setGuarderia(snapshot.data());
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
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={require('../imagenes/fondomain.jpg')} style={styles.background}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Image source={{ uri: guarderia.Foto }} style={styles.image} />
          <Text style={styles.title}>{guarderia.Nombre}</Text>
          <View style={styles.descriptionCard}>
            <Text style={styles.description}>{guarderia.Descripcion}</Text>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Icon name="location" size={20} color="black" style={styles.icon} />
              <Text style={styles.infoText}>{guarderia.Barrio}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="location-sharp" size={20} color="black" style={styles.icon} />
              <Text style={styles.infoText}>{guarderia.Direccion}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Servicios</Text>
              {guarderia.Servicios && guarderia.Servicios.split('-').map((servicio, index) => (
                <Text key={index} style={styles.service}>{servicio.trim()}</Text>
              ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={llamarTelefono}>
              <Icon name="call" size={20} color="white" style={styles.icon} />
              <Text style={styles.buttonText}>Llamar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={abrirMapa}>
              <Icon name="map" size={20} color="white" style={styles.icon} />
              <Text style={styles.buttonText}>Abrir Mapa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={abrirPagina}>
              <Icon name="globe" size={20} color="white" style={styles.icon} />
              <Text style={styles.buttonText}>Abrir Página Web</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
  },
  descriptionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  description: {
    fontSize: 18,
    color: 'black',
    textAlign: 'justify',
  },
  infoContainer: {
    alignItems: 'center',
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
    color: 'black',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  service: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2AC9FA',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default AdieguarScreen;
