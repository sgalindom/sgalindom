import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import storage from '@react-native-firebase/storage';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const PerroScreen = ({ navigation }) => {
  const [tarjetas, setTarjetas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const nombresTarjetas = [
          { nombre: 'Alimento', ruta: 'perro/comida.jpg' },
          { nombre: 'Snacks', ruta: 'gato/snacksgatos.jpg' },
          { nombre: 'Arena', ruta: 'gato/arenagatos.jpg' },
          { nombre: 'Juguetes', ruta: 'gato/juguetesgatos.jpg' },
          { nombre: 'Accesorios', ruta: 'gato/accesoriosgatos.jpg' },
          { nombre: 'Higiene', ruta: 'gato/higiene.jpg' },
        ];

        const tarjetasConUrls = await Promise.all(
          nombresTarjetas.map(async (tarjeta) => {
            const url = await storage().ref(tarjeta.ruta).getDownloadURL();
            return { ...tarjeta, rutaImagen: url };
          })
        );

        setTarjetas(tarjetasConUrls);
      } catch (error) {
        console.error('Error al cargar las imágenes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleSeleccionarOpcion = (nombre) => {
    navigation.navigate('opcionesp', { opcionSeleccionada: nombre });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image
          source={require('../../imagenes/fondoperfil.jpg')} // Puedes cambiar esta imagen a una de Firebase si también está en Storage
          style={styles.headerImage}
        />
        <Text style={styles.barra}>Dale a tu Perro lo que merece</Text>
        <View style={styles.tarjetasContainer}>
          {tarjetas.map((tarjeta, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tarjeta}
              onPress={() => handleSeleccionarOpcion(tarjeta.nombre)}
            >
              <Image
                source={{ uri: tarjeta.rutaImagen }}
                style={styles.tarjetaImage}
              />
              <Text style={styles.tarjetaText} numberOfLines={2}>{tarjeta.nombre}</Text>
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
        <TouchableOpacity onPress={() => navigation.navigate('vercupones')} style={styles.profileButton}>
          <Icon name="paw" size={30} color="#000" />
          <Text style={styles.profileButtonText}>Cupones</Text>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: '#000',
  },
  headerImage: {
    width: '100%',
    height: 150,
  },
  barra: {
    fontSize: 22,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'Roboto',
    textAlign: 'center',
    paddingHorizontal: 20,
    color: '#000',
  },
  tarjetasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  tarjeta: {
    width: (width / 2) - 20,
    height: 150,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  tarjetaImage: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
    marginBottom: 5,
  },
  tarjetaText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#000',
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
    color: '#000',
  },
});

export default PerroScreen;
