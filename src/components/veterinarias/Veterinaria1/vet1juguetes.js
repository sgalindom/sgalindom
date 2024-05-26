import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

const Vet1Juguetes = () => {
  const navigation = useNavigation();
  const [productos, setProductos] = useState([]);
  const [nombreVeterinaria, setNombreVeterinaria] = useState('');

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const user = auth().currentUser;

        if (user) {
          const veterinariaSnapshot = await firestore()
            .collection('Veterinarias')
            .doc('1') // Cambia '1' por el ID de la veterinaria correspondiente
            .get();

          const nombreVeterinaria = veterinariaSnapshot.exists ? veterinariaSnapshot.data().Nombre : '';
          setNombreVeterinaria(nombreVeterinaria);

          const productosSnapshot = await firestore()
            .collection('Veterinarias')
            .doc('1') // Cambia '1' por el ID de la veterinaria correspondiente
            .collection('Productos') // Cambia a la colección correspondiente para productos de juguetes
            .get();

          const productosData = productosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setProductos(productosData);
        }
      } catch (error) {
        console.error('Error al obtener productos de juguetes:', error);
      }
    };

    obtenerProductos();
  }, []);

  const handleVerProducto = (producto) => {
    navigation.navigate('verproductojuguetes', { producto });
  };

  const handleMisPedidos = () => {
    navigation.navigate('pago');
  };

  const renderProducto = ({ item }) => (
    <TouchableOpacity onPress={() => handleVerProducto(item)} style={styles.productoContainer}>
      <View style={styles.card}>
        <ImageBackground source={{ uri: item.Foto }} style={styles.image}>
          <View style={styles.overlay}>
            <Text style={styles.productName}>{item.Nombre}</Text>
            <Text style={styles.productPrice}>Precio: {item.Precio}</Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('../../imagenes/fondomain.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <FlatList
          data={productos}
          renderItem={renderProducto}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.flatlistContainer}
        />
        <TouchableOpacity onPress={handleMisPedidos} style={styles.cartButton}>
          <Icon name="cart" size={24} color="white" />
          <Text style={styles.cartButtonText}>Mis Pedidos</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const windowWidth = Dimensions.get('window').width;
const cardWidth = (windowWidth - 32 - 16) / 2; // 32: padding horizontal del contenedor, 16: margen entre las tarjetas

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  flatlistContainer: {
    flexGrow: 1,
  },
  productoContainer: {
    width: '50%',
    padding: 8,
  },
  card: {
    width: cardWidth,
    height: cardWidth * 1.25, // Proporción 5:4
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    width: '100%',
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  productPrice: {
    color: 'white',
  },
  cartButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#2F9FFA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default Vet1Juguetes;
