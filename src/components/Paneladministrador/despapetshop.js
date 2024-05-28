import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const DespachadosPetShopPanel = () => {
  const [pedidosDespachados, setPedidosDespachados] = useState([]);
  const [usuarioEmail, setUsuarioEmail] = useState('');

  useEffect(() => {
    const obtenerUsuarioAutenticado = async () => {
      const usuarioAutenticado = auth().currentUser;
      if (usuarioAutenticado) {
        setUsuarioEmail(usuarioAutenticado.email);
      }
    };

    obtenerUsuarioAutenticado();
  }, []);

  const obtenerPedidosDespachados = async () => {
    try {
      const despachadosSnapshot = await firestore()
        .collection('Administradores')
        .doc(usuarioEmail)
        .collection('Despachados')
        .get();

      const despachadosData = despachadosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPedidosDespachados(despachadosData);
    } catch (error) {
      console.error('Error al obtener pedidos despachados:', error);
    }
  };

  useEffect(() => {
    if (usuarioEmail) {
      obtenerPedidosDespachados();
    }
  }, [usuarioEmail]);

  const renderProducto = (producto) => (
    <View style={styles.productoCard}>
      <Text style={styles.productoText}>Nombre: {producto.nombre}</Text>
      <Text style={styles.productoText}>Descripción: {producto.descripcion}</Text>
      <Text style={styles.productoText}>Cantidad: {producto.cantidad}</Text>
      <Text style={styles.productoText}>Precio Unitario: ${producto.precioUnitario}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Pedido ID: {item.id}</Text>
      <Text style={styles.cardText}>Usuario: {item.usuario}</Text>
      <Text style={styles.cardText}>Total: ${item.total}</Text>

      <Text style={styles.subTitle}>Productos:</Text>
      <FlatList
          data={item.productos}
          renderItem={({ item: producto }) => renderProducto(producto)}
          keyExtractor={(producto, index) => index.toString()} // Usando el índice como key
        />

    </View>
  );

  return (
    <ImageBackground source={require('../imagenes/fondoadminpanel.jpg')} style={styles.background}>
      <View style={styles.container}>
        {pedidosDespachados.length === 0 ? (
          <Text style={styles.noPedidosText}>No hay pedidos despachados</Text>
        ) : (
          <FlatList
            data={pedidosDespachados}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black', // Aquí cambiamos el color del texto a negro
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
    color: 'black', // Aquí cambiamos el color del texto a negro
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    color: 'black', // Aquí cambiamos el color del texto a negro
  },
  productoCard: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  productoText: {
    fontSize: 14,
    marginBottom: 4,
    color: 'black', // Aquí cambiamos el color del texto a negro
  },
  noPedidosText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'black', // Aquí cambiamos el color del texto a negro
  },
});

export default DespachadosPetShopPanel;
