import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';
import FastImage from 'react-native-fast-image'; // Asegúrate de importar FastImage correctamente

const { width } = Dimensions.get('window');

const GatoScreen = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga

  const tarjetas = [
    { nombre: 'Alimento', rutaImagen: 'gato/alimentogatos.jpg' },
    { nombre: 'Snacks', rutaImagen: 'gato/snacksgatos.jpg' },
    { nombre: 'Arena', rutaImagen: 'gato/arenagatos.jpg' },
    { nombre: 'Juguetes', rutaImagen: 'gato/juguetesgatos.jpg' },
    { nombre: 'Accesorios', rutaImagen: 'gato/accesoriosgatos.jpg' },
    { nombre: 'Higiene', rutaImagen: 'gato/higiene.jpg' },
  ];

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageUrls = await Promise.all(
          tarjetas.map(async (tarjeta) => {
            const url = await storage().ref(tarjeta.rutaImagen).getDownloadURL();
            return { ...tarjeta, url };
          })
        );
        setImages(imageUrls);
        setLoading(false); // Cuando las imágenes están listas, se cambia el estado de carga
      } catch (error) {
        console.error('Error fetching images from Firebase:', error);
        setLoading(false);
      }
    };

    loadImages();
  }, []);

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
        {loading ? (
          <ActivityIndicator size="large" color="#000" style={styles.loadingIndicator} />
        ) : (
          <View style={styles.tarjetasContainer}>
            {images.map((tarjeta, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tarjeta}
                onPress={() => handleSeleccionarOpcion(tarjeta.nombre)}
              >
                {/* Usamos FastImage solo si está disponible, de lo contrario utilizamos Image */}
                {FastImage ? (
                  <FastImage
                    source={{ uri: tarjeta.url }}
                    style={styles.tarjetaImage}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <Image
                    source={{ uri: tarjeta.url }}
                    style={styles.tarjetaImage}
                  />
                )}
                <Text style={styles.tarjetaText} numberOfLines={2}>{tarjeta.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  loadingIndicator: {
    marginTop: 20,
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

export default GatoScreen;
