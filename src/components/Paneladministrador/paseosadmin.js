import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import SwipeButton from 'rn-swipe-button';
import Icon from 'react-native-vector-icons/MaterialIcons';

const backgroundImage = require('../imagenes/fondomain.jpg');

const Paseosadmin = () => {
  const [paseos, setPaseos] = useState([]);

  useEffect(() => {
    const fetchPaseos = async () => {
      try {
        const paseosCollection = await firestore().collection('paseos').get();
        const paseosList = paseosCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPaseos(paseosList);
      } catch (error) {
        console.error('Error fetching paseos: ', error);
      }
    };

    fetchPaseos();
  }, []);

  const handleStartPaseo = async (id) => {
    try {
      await firestore().collection('paseos').doc(id).update({
        estado: 'en_curso', // Cambiar estado a "en_curso" al iniciar el paseo
      });
      const updatedPaseos = paseos.map(paseo => {
        if (paseo.id === id) {
          return { ...paseo, estado: 'en_curso' };
        }
        return paseo;
      });
      setPaseos(updatedPaseos);
    } catch (error) {
      console.error('Error starting paseo:', error);
    }
  };

  const handleFinishPaseo = async (id) => {
    try {
      await firestore().collection('paseos').doc(id).update({
        estado: 'finalizado', // Cambiar estado a "finalizado" al finalizar el paseo
      });
      const updatedPaseos = paseos.map(paseo => {
        if (paseo.id === id) {
          return { ...paseo, estado: 'finalizado' };
        }
        return paseo;
      });
      setPaseos(updatedPaseos);
    } catch (error) {
      console.error('Error finishing paseo:', error);
    }
  };

  const renderPaseoItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardDetails}>
        <Text style={styles.cardText}>Fecha: {item.fechas.join(', ')}</Text>
        <Text style={styles.cardText}>Hora: {item.hora}</Text>
        <Text style={styles.cardText}>Mascotas: {item.mascotas.join(', ')}</Text>
        <Text style={styles.cardText}>Observaciones: {item.observaciones}</Text>
        <Text style={styles.cardText}>Paquete: {item.paquete}</Text>
        <Text style={styles.cardText}>Nombre: {item.nombre}</Text>
        <Text style={styles.cardText}>Teléfono: {item.telefono}</Text>
        <Text style={styles.cardText}>Dirección: {item.direccion}</Text>
      </View>
      <View style={styles.swipeButtonContainer}>
        {item.estado === 'pendiente' && (
          <SwipeButton
            containerStyles={styles.swipeButton}
            thumbIconComponent={<Icon name="directions-walk" size={24} color="#fff" />}
            railBackgroundColor="#dc3545"
            thumbIconBackgroundColor="#dc3545"
            title="Iniciar Paseo"
            onSwipeSuccess={() => handleStartPaseo(item.id)}
          />
        )}
        {item.estado === 'en_curso' && (
          <SwipeButton
            containerStyles={styles.swipeButton}
            thumbIconComponent={<Icon name="check-circle" size={24} color="#fff" />}
            railBackgroundColor="#28a745"
            thumbIconBackgroundColor="#28a745"
            title="Finalizar Paseo"
            onSwipeSuccess={() => handleFinishPaseo(item.id)}
          />
        )}
      </View>
    </View>
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Paseos Solicitados</Text>
        <FlatList
          data={paseos}
          renderItem={renderPaseoItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo semi-transparente para mantener legibilidad
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  listContainer: {
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardDetails: {
    flex: 1,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  swipeButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeButton: {
    width: 120,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
  },
});

export default Paseosadmin;
