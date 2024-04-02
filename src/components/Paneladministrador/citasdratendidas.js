import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const CitasDrAtendidas = () => {
  const [citasAtendidas, setCitasAtendidas] = useState([]);
  const [usuarioEmail, setUsuarioEmail] = useState('');

  useEffect(() => {
    obtenerUsuarioAutenticado();
  }, []);

  const obtenerUsuarioAutenticado = async () => {
    const usuarioAutenticado = auth().currentUser;
    if (usuarioAutenticado) {
      setUsuarioEmail(usuarioAutenticado.email);
    }
  };

  useEffect(() => {
    if (usuarioEmail) {
      obtenerCitasAtendidas();
    }
  }, [usuarioEmail]);

  const obtenerCitasAtendidas = async () => {
    try {
      if (!usuarioEmail) {
        return;
      }

      const citasSnapshot = await firestore()
        .collection(`Administradores/${usuarioEmail}/citasdratendidas`)
        .get();

      const citasData = citasSnapshot.docs.map((doc) => ({
        id: doc.id,
        informacion: doc.data().informacion,
      }));

      setCitasAtendidas(citasData);
    } catch (error) {
      console.error('Error al obtener citas atendidas:', error);
    }
  };

  const renderCitaAtendida = (cita) => (
    <View style={styles.card}>
      <Text style={styles.citaText}>ID: {cita.id}</Text>
      <Text style={styles.citaText}>Nombre: {cita.informacion?.fullName || ''}</Text>
      <Text style={styles.citaText}>Género: {cita.informacion?.petGender || ''}</Text>
      <Text style={styles.citaText}>Tipo de mascota: {cita.informacion?.petType || ''}</Text>
      <Text style={styles.citaText}>Número de teléfono: {cita.informacion?.phoneNumber || ''}</Text>
      <Text style={styles.citaText}>Descripción: {cita.informacion?.description || ''}</Text>
      <Text style={styles.citaText}>Fecha: {cita.informacion?.date || ''}</Text>
      <Text style={styles.citaText}>Hora: {cita.informacion?.hour || ''}</Text>
    </View>
  );

  return (
    <ImageBackground source={require('../imagenes/fondoadminpanel.jpg')} style={styles.background}>
      <View style={styles.container}>
        {citasAtendidas.length === 0 ? (
          <Text style={styles.noCitasText}>No hay citas atendidas por el Dr.</Text>
        ) : (
          <FlatList
            data={citasAtendidas}
            renderItem={({ item }) => renderCitaAtendida(item)}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  citaText: {
    fontSize: 14,
    marginBottom: 4,
  },
  noCitasText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CitasDrAtendidas;
