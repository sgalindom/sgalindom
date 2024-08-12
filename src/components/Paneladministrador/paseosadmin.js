import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';
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

  const handlePaseoRealizado = async (id) => {
    try {
      // Aquí puedes actualizar el campo 'realizado' en Firestore
      await firestore().collection('paseos').doc(id).update({
        realizado: true,
      });
      // Actualizar localmente el estado de paseos para reflejar el cambio
      const updatedPaseos = paseos.map(paseo => {
        if (paseo.id === id) {
          return { ...paseo, realizado: true };
        }
        return paseo;
      });
      setPaseos(updatedPaseos);
    } catch (error) {
      console.error('Error marking paseo as realizado:', error);
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
      <View style={styles.cardActions}>
        {item.realizado ? (
          <Icon name="check-circle" size={24} color="#28a745" style={styles.statusIcon} />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePaseoRealizado(item.id)}
            disabled={item.realizado}
          >
            <Text style={styles.buttonText}>Paseo Realizado</Text>
          </TouchableOpacity>
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
  cardActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  statusIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Paseosadmin;
