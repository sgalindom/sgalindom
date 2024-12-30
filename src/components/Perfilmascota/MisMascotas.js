import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList } from 'react-native';
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
      <View style={styles.cardContent}>
        <Icon name="paw" size={40} color="#007BFF" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.mascotaNombre}>{item.nombre}</Text>
          <Text style={styles.mascotaDetalles}>Detalles de la mascota...</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../imagenes/fondomain.jpg')}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Mis Mascotas</Text>
        {mascotas.length > 0 ? (
          <FlatList
            data={mascotas}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContainer}
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
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  flatListContainer: {
    paddingBottom: 20,
    width: '100%',
  },
  mascotaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  mascotaNombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  mascotaDetalles: {
    fontSize: 16,
    color: '#888',
  },
  noMascotasText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
    marginTop: 20,
  },
  registrarButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 12,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  registrarButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default MisMascotas;
