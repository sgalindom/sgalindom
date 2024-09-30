import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

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

          const pedidosData = pedidosSnapshot.docs.map((pedidoDoc) => {
            const data = pedidoDoc.data();
            return {
              id: pedidoDoc.id,
              pedido: data.pedido, // Este es el arreglo de productos
              total: data.total,
              fecha: data.fecha,
            };
          });

          setPedidos(pedidosData);
          setLoading(false); // Actualizamos el estado de carga cuando se obtienen los pedidos
        }
      } catch (error) {
        console.error('Error al obtener mis pedidos:', error);
        setLoading(false); // Asegurarse de que loading se setea a false incluso si hay un error
      }
    };

    obtenerMisPedidos();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Icon name="shopping-cart" size={24} color="#2F9FFA" style={styles.icono} />
      <View style={styles.textoContainer}>
        <Text style={styles.fecha}>Fecha: {item.fecha}</Text>
        {item.pedido.map((producto, index) => (
          <View key={index} style={styles.productoContainer}>
            <Text style={styles.nombreProducto}>{producto.nombre}</Text>
            <Text style={styles.precio}>Precio: ${producto.precio}</Text>
            <Text style={styles.cantidad}>Cantidad: {producto.cantidad}</Text>
          </View>
        ))}
        <Text style={styles.total}>Total: ${item.total}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <ImageBackground source={require('../imagenes/fondomain.jpg')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <Text style={styles.emptyMessage}>Cargando...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (pedidos.length === 0) {
    return (
      <ImageBackground source={require('../imagenes/fondomain.jpg')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <Text style={styles.emptyMessage}>No hay pedidos</Text>
        </View>
      </ImageBackground>
    );
  }

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
  productoContainer: {
    marginBottom: 8,
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
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F9FFA',
  },
  fecha: {
    fontSize: 14,
    color: '#777',
  },
  emptyMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#555',
  },
});

export default MisPedidos;
