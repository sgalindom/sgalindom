import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const obtenerMisPedidos = async () => {
      try {
        const usuarioAutenticado = auth().currentUser;

        if (usuarioAutenticado) {
          const pedidosSnapshot = await firestore()
            .collection('usuarios')
            .doc(usuarioAutenticado.email)
            .collection('mispedidos')
            .get();

          const pedidosData = [];

          // Iterar sobre los pedidos
          pedidosSnapshot.forEach((pedidoDoc) => {
            const productosRef = pedidoDoc.ref.collection('productos');

            // Obtener productos de cada pedido
            productosRef.get().then((productosSnapshot) => {
              productosSnapshot.forEach((productoDoc) => {
                // Construir objeto de pedido
                const pedido = {
                  id: productoDoc.id,
                  cantidad: productoDoc.data().cantidad,
                  nombre: productoDoc.data().nombre,
                  precio: productoDoc.data().precio,
                };

                pedidosData.push(pedido);
              });

              setPedidos(pedidosData);
            });
          });
        }
      } catch (error) {
        console.error('Error al obtener mis pedidos:', error);
      }
    };

    obtenerMisPedidos();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Icon name="shopping-cart" size={24} color="#2F9FFA" style={styles.icono} />
      <View style={styles.textoContainer}>
        <Text style={styles.nombreProducto}>{item.nombre}</Text>
        <Text style={styles.precio}>Precio: ${item.precio}</Text>
        <Text style={styles.cantidad}>Cantidad: {item.cantidad}</Text>
        {/* Otros detalles del pedido... */}
      </View>
    </View>
  );

  return (
    <ImageBackground source={require('../imagenes/fondomain.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <FlatList
          data={pedidos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  icono: {
    marginRight: 16,
  },
  textoContainer: {
    flex: 1,
  },
  nombreProducto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  precio: {
    fontSize: 16,
    color: '#555',
  },
  cantidad: {
    fontSize: 16,
    color: '#555',
  },
});

export default MisPedidos;
