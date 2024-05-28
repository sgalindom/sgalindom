import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MisMascotas = ({ navigation }) => {
  const [mascotas, setMascotas] = useState([]);
  const user = auth().currentUser;
  const userEmail = user ? user.email : '';

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        if (userEmail) {
          const mascotasRef = firestore().collection(`usuarios/${userEmail}/mascotas`);
          mascotasRef.onSnapshot(querySnapshot => {
            const nuevasMascotas = [];
            querySnapshot.forEach(doc => {
              nuevasMascotas.push({ id: doc.id, ...doc.data() });
            });
            setMascotas(nuevasMascotas);
          });
        }
      } catch (error) {
        console.error('Error al obtener las mascotas: ', error);
      }
    };

    fetchMascotas();

    return () => {
      // Limpiar el listener al desmontar el componente
      if (userEmail) {
        const mascotasRef = firestore().collection(`usuarios/${userEmail}/mascotas`);
        mascotasRef.onSnapshot(() => {}); // Detener el listener
      }
    };
  }, [userEmail]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mascotaCard}
      onPress={() => {
        navigation.navigate('DetalleMascota', { mascota: item });
      }}
    >
      <Text style={styles.mascotaNombre}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../imagenes/fondomain.jpg')}
      style={styles.container}
    >
      <Text style={styles.title}>Mis Mascotas</Text>
      {mascotas.length > 0 ? (
        <FlatList
          data={mascotas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noMascotasText}>No tienes mascotas registradas.</Text>
      )}
      <TouchableOpacity
        style={styles.registrarButton}
        onPress={() => navigation.navigate('AñadirMascota')}
      >
        <Text style={styles.registrarButtonText}>Registrar Mascota</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  mascotaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 15,
    backgroundColor: 'rgba(42, 201, 250, 0.7)',
    borderRadius: 8,
  },
  mascotaNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  noMascotasText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  registrarButton: {
    backgroundColor: '#2AC9FA',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  registrarButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default MisMascotas;
