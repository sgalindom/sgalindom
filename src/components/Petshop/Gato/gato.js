import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const GatoScreen = ({ navigation }) => {
  const tarjetas = [
    { nombre: 'Alimento', rutaImagen: require('../../imagenes/alimentogatos.jpg') },
    { nombre: 'Snacks', rutaImagen: require('../../imagenes/snacksgatos.jpg') },
    { nombre: 'Arena', rutaImagen: require('../../imagenes/arenagatos.jpg') },
    { nombre: 'Juguetes', rutaImagen: require('../../imagenes/juguetesgatos.jpg') },
    { nombre: 'Accesorios', rutaImagen: require('../../imagenes/accesoriosgatos.jpg') },
    { nombre: 'Higiene', rutaImagen: require('../../imagenes/higiene.jpg') },
  ];

  const handleSeleccionarOpcion = (nombre) => {
    navigation.navigate('opciones', { opcionSeleccionada: nombre });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image
          source={require('../../imagenes/fondoperfil.jpg')}
          style={styles.headerImage}
        />
        <Text style={styles.barra}>Dale a tu gato lo que merece</Text>
        <View style={styles.tarjetasContainer}>
          {tarjetas.map((tarjeta, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tarjeta}
              onPress={() => handleSeleccionarOpcion(tarjeta.nombre)}
            >
              <Image
                source={tarjeta.rutaImagen}
                style={styles.tarjetaImage}
              />
              <Text>{tarjeta.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.profileBar}>
        <TouchableOpacity onPress={() => navigation.navigate('MiPerfil')} style={styles.profileButton}>
          <Icon name="person" size={30} color="#000" />
          <Text style={styles.profileButtonText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('pago')} style={styles.profileButton}>
          <Icon name="cart" size={30} color="#000" />
          <Text style={styles.profileButtonText}>Carrito</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Contactanos')} style={styles.profileButton}>
          <Icon name="paw" size={30} color="#000" />
          <Text style={styles.profileButtonText}>Contactanos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerImage: {
    width: '100%',
    height: 150,
  },
  barra: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
  tarjetasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  tarjeta: {
    width: '45%',
    height: 150,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
  },
  tarjetaImage: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
    marginBottom: 5,
  },
  profileBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
  },
  profileButton: {
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 12,
  },
});

export default GatoScreen;
