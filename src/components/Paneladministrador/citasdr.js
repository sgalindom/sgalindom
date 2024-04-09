import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const CitasDrPanel = () => {
  const [citas, setCitas] = useState([]);
  const [usuarioEmail, setUsuarioEmail] = useState('');

  const obtenerUsuarioAutenticado = async () => {
    const usuarioAutenticado = auth().currentUser;
    if (usuarioAutenticado) {
      setUsuarioEmail(usuarioAutenticado.email);
    }
  };

  const obtenerCitas = async () => {
    try {
      if (usuarioEmail) {
        const vetNameSnapshot = await firestore()
          .collection('Administradores')
          .doc(usuarioEmail)
          .get();

        if (vetNameSnapshot.exists) {
          const vetNameData = vetNameSnapshot.data().Nombre;

          const citasSnapshot = await firestore()
            .collection(`Administradores/${usuarioEmail}/citasdr`)
            .where(firestore.FieldPath.documentId(), 'not-in', ['contadorId'])
            .get();

          const citasData = citasSnapshot.docs.map((doc) => ({
            id: doc.id,
            informacion: doc.data().informacion,
          }));

          setCitas(citasData);
        } else {
          console.warn('El usuario no es un administrador.');
        }
      }
    } catch (error) {
      console.error('Error al obtener citas:', error);
    }
  };

  useEffect(() => {
    obtenerUsuarioAutenticado();
  }, []);

  useEffect(() => {
    obtenerCitas();
  }, [usuarioEmail]);

  const confirmarCitaAtendida = (citaId, citaInfo) => {
    Alert.alert(
      'Confirmar cita atendida',
      '¿Estás seguro de que la cita ha sido atendida?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => atenderCita(citaId, citaInfo),
        },
      ]
    );
  };

  const atenderCita = async (citaId, citaInfo) => {
    try {
      const vetNameSnapshot = await firestore()
        .collection('Administradores')
        .doc(usuarioEmail)
        .get();

      if (vetNameSnapshot.exists) {
        const vetNameData = vetNameSnapshot.data().Nombre;

        const citaRef = firestore()
          .collection(`Administradores/${usuarioEmail}/citasdr`)
          .doc(citaId);

        const citaData = await citaRef.get();

        if (citaData.exists) {
          // Obtén los datos de la cita
          const citaInfo = citaData.data();

          // Elimina la cita de la colección actual
          await citaRef.delete();

          // Añade la cita a la colección de Citas Dr Atendidas
          await firestore()
            .collection(`Administradores/${usuarioEmail}/citasdratendidas`)
            .doc(citaId)
            .set(citaInfo);

          Alert.alert('Cita atendida', 'La cita ha sido atendida correctamente.');

          // Usamos la función obtenerCitas después de atender la cita para actualizar la lista
          obtenerCitas();
        } else {
          Alert.alert('Error', 'La cita no se encuentra en la colección actual. Por favor, inténtelo nuevamente.');
        }
      } else {
        console.warn('El usuario no es un administrador.');
      }
    } catch (error) {
      console.error('Error al atender la cita:', error);
      Alert.alert('Error', 'Hubo un error al atender la cita. Por favor, inténtelo nuevamente.');
    }
  };

  const renderCita = (cita) => (
    <View style={styles.card}>
      {/* Renderiza los datos según la estructura de tu informacion */}
      <Text style={styles.citaText}>ID: {cita.id}</Text>
      <Text style={styles.citaText}>Nombre: {cita.informacion?.fullName || ''}</Text>
      <Text style={styles.citaText}>Fecha: {cita.informacion?.date || ''}</Text>
      <Text style={styles.citaText}>Hora: {cita.informacion?.hour || ''}</Text>
      <Text style={styles.citaText}>Descripción: {cita.informacion?.description || ''}</Text>
      <Text style={styles.citaText}>Género: {cita.informacion?.petGender || ''}</Text>
      <Text style={styles.citaText}>Tipo de mascota: {cita.informacion?.petType || ''}</Text>
      <Text style={styles.citaText}>Número de teléfono: {cita.informacion?.phoneNumber || ''}</Text>

      <TouchableOpacity
        style={styles.citaAtendidaButton}
        onPress={() => confirmarCitaAtendida(cita.id, cita.informacion)}
      >
        <Text style={styles.citaAtendidaButtonText}>Cita Atendida</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground source={require('../imagenes/fondoadminpanel.jpg')} style={styles.background}>
      <View style={styles.container}>
        {citas.length === 0 ? (
          <Text style={styles.noCitasText}>No hay citas disponibles</Text>
        ) : (
          <FlatList
            data={citas}
            renderItem={({ item }) => renderCita(item)}
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
    color: '#000', // Color de texto negro
  },
  citaAtendidaButton: {
    backgroundColor: '#599B85',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  citaAtendidaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noCitasText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CitasDrPanel;
