import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const VerProductos = ({ route }) => {
  const { tipoColeccion, tipoAlimento } = route.params;
  const [productos, setProductos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        let productosSnapshot;

        switch (tipoColeccion) {
          case 'Alimento':
            productosSnapshot = await firestore()
              .collection('Petshop')
              .doc('Gato')
              .collection('Alimento')
              .doc(tipoAlimento)
              .collection('gato')
              .get();
            break;
          case 'Snacks':
            productosSnapshot = await firestore()
              .collection('Petshop')
              .doc('Gato')
              .collection('Snacks')
              .doc(tipoAlimento)
              .collection('gato')
              .get();
            break;
          case 'Juguetes':
            productosSnapshot = await firestore()
              .collection('Petshop')
              .doc('Gato')
              .collection('Juguetes')
              .doc(tipoAlimento)
              .collection('gato')
              .get();
            break;
          case 'Higiene':
            productosSnapshot = await firestore()
              .collection('Petshop')
              .doc('Gato')
              .collection('Higiene')
              .doc(tipoAlimento)
              .collection('gato')
              .get();
            break;
          case 'Arena':
            productosSnapshot = await firestore()
              .collection('Petshop')
              .doc('Gato')
              .collection('Arena')
              .doc(tipoAlimento)
              .collection('gato')
              .get();
            break;
          case 'Accesorios':
            productosSnapshot = await firestore()
              .collection('Petshop')
              .doc('Gato')
              .collection('Accesorios')
              .doc(tipoAlimento)
              .collection('gato')
              .get();
            break;
          default:
            console.error('Colección no reconocida');
            return;
        }

        const productosArray = [];

        productosSnapshot.forEach((doc) => {
          productosArray.push(doc.data());
        });

        setProductos(productosArray);
      } catch (error) {
        console.error('Error fetching productos:', error);
        Alert.alert('Error', 'Ocurrió un error al obtener los productos');
      }
    };

    obtenerProductos();
  }, [tipoColeccion, tipoAlimento]);

  const verDetalle = (producto) => {
    navigation.navigate('detalles', { producto });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../imagenes/fondoperfil.jpg')}
        style={styles.headerImage}
      />
      <Text style={styles.title}>Productos de {tipoAlimento}</Text>
      <View style={styles.productosContainer}>
        {productos.map((producto, index) => (
          <TouchableOpacity
            key={index}
            style={styles.productoCard}
            onPress={() => verDetalle(producto)}
          >
            <Image
              source={{ uri: producto.Foto }}
              style={styles.productoImagen}
              resizeMode="cover"
            />
            <View style={styles.productoInfo}>
              <Text style={styles.productoNombre}>{producto.Nombre}</Text>
              <Text style={styles.productoDescripcion}>{producto.Descripcion}</Text>
              <Text style={styles.precio}>Precio: {producto.Precio}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productosContainer: {
    paddingHorizontal: 10,
  },
  productoCard: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productoImagen: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  productoInfo: {
    flex: 1,
    padding: 10,
    color: '#000',
    
  },
  productoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  productoPrecio: {
    fontSize: 16,
    marginTop: 5,
    color: '#000',
  },
  precioKg: {
    fontSize: 14,
    color: '#666',
    
  },
});

export default VerProductos;
