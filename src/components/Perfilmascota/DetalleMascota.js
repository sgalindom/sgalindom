import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const DetalleMascota = ({ route, navigation }) => {
  const { mascota } = route.params;

  // Verificar si la descripción está presente y no es null ni undefined
  const descripcionMascota = mascota.descripcion ? mascota.descripcion : 'Sin descripción';

  const eliminarMascota = async () => {
    try {
      const user = auth().currentUser;
      const userEmail = user ? user.email : '';
      
      const mascotasRef = firestore().collection(`usuarios/${userEmail}/mascotas`);
      
      await mascotasRef.doc(mascota.id.toString()).delete();
      
      Alert.alert('Mascota eliminada', 'La mascota ha sido eliminada correctamente.');
      
      navigation.navigate('MisMascotas');
    } catch (error) {
      console.error('Error al eliminar la mascota: ', error);
      Alert.alert('Error', 'Se produjo un error al intentar eliminar la mascota. Por favor, inténtalo nuevamente.');
    }
  };

  return (
    <ImageBackground
      source={require('../imagenes/DetalleMascota.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.detailContainer}>
          <Text style={styles.title}>{mascota.nombre}</Text>
          <View style={styles.detailItem}>
            <Icon name="paw" size={20} color="black" style={styles.icon} />
            <Text style={styles.detailText}>Raza: {mascota.raza}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={20} color="black" style={styles.icon} />
            <Text style={styles.detailText}>Edad: {mascota.edad}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="balance-scale" size={20} color="black" style={styles.icon} />
            <Text style={styles.detailText}>Peso: {mascota.peso} Kg</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="comment" size={20} color="black" style={styles.icon} />
            <Text style={styles.detailText}>Descripción: {descripcionMascota}</Text>
          </View>
          {/* Botón de eliminar mascota */}
          <TouchableOpacity style={styles.eliminarButton} onPress={eliminarMascota}>
            <Text style={styles.eliminarButtonText}>Eliminar Mascota</Text>
          </TouchableOpacity>
          {/* Otros detalles que quieras mostrar */}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  detailContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fondo semitransparente blanco
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black', // Texto en color negro
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 18,
    color: 'black', // Texto en color negro
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  eliminarButton: {
    backgroundColor: '#FF6347', // Color rojo
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  eliminarButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default DetalleMascota;
