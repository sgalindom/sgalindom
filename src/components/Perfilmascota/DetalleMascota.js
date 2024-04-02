import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const DetalleMascota = ({ route }) => {
  const { mascota } = route.params;

  // Verificar si la descripción está presente y no es null ni undefined
  const descripcionMascota = mascota.descripcion ? mascota.descripcion : 'Sin descripción';

  return (
    <ImageBackground
      source={require('../imagenes/DetalleMascota.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.detailContainer}>
          <Text style={styles.title}>{mascota.nombre}</Text>
          <Text style={styles.detailText}>Raza: {mascota.raza}</Text>
          <Text style={styles.detailText}>Edad: {mascota.edad}</Text>
          <Text style={styles.detailText}>Peso: {mascota.peso} Kg</Text>
          <Text style={styles.detailText}>Descripción: {descripcionMascota}</Text>
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
  detailText: {
    fontSize: 18,
    color: 'black', // Texto en color negro
    marginBottom: 10,
  },
});

export default DetalleMascota;
