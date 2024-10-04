import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const DespachadosPetShopPanel = () => {
  const [pedidosDespachados, setPedidosDespachados] = useState([]);

  useEffect(() => {
    const obtenerPedidosDespachados = async () => {
      try {
        const despachadosSnapshot = await firestore()
          .collection('pedidosdespachados')
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

    obtenerPedidosDespachados();
  }, []);

  const renderProducto = (producto) => (
    <View style={styles.productoCard}>
      <Text style={styles.productoText}>Nombre: {producto.nombre}</Text>
      <Text style={styles.productoText}>Descripción: {producto.descripcion}</Text>
      <Text style={styles.productoText}>Cantidad: {producto.cantidad}</Text>
      <Text style={styles.productoText}>Precio Unitario: ${producto.precio}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Pedido ID: {item.id}</Text>
      <Text style={styles.cardText}>Usuario: {item.usuario.nombre}</Text>
      <Text style={styles.cardText}>Email: {item.usuario.email}</Text>
      <Text style={styles.cardText}>Teléfono: {item.usuario.telefono}</Text>
      <Text style={styles.cardText}>Total: ${item.total}</Text>
      <Text style={styles.cardText}>Fecha de Despacho: {new Date(item.fechaDespacho).toLocaleString()}</Text>
      
      <Text style={styles.subTitle}>Productos:</Text>
      <FlatList
        data={item.pedido}
        renderItem={({ item }) => renderProducto(item)}
        keyExtractor={(producto) => producto.id}
      />
    </View>
  );

  return (
    <ImageBackground source={require('../imagenes/fondomain.jpg')} style={styles.background}>
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
    color: 'black', // Color de texto negro
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
    color: 'black', // Color de texto negro
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    color: 'black', // Color de texto negro
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
    color: 'black', // Color de texto negro
  },
  noPedidosText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'black', // Color de texto negro
  },
});

export default DespachadosPetShopPanel;
