import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const PedidosPetShopPanel = () => {
  const [pedidos, setPedidos] = useState([]);
  const [usuarioEmail, setUsuarioEmail] = useState('');

  const obtenerUsuarioAutenticado = async () => {
    const usuarioAutenticado = auth().currentUser;
    if (usuarioAutenticado) {
      setUsuarioEmail(usuarioAutenticado.email);
    }
  };

  const obtenerPedidos = async () => {
    try {
      if (usuarioEmail) {
        const pedidosSnapshot = await firestore()
          .collection('Administradores')
          .doc(usuarioEmail)
          .collection('pedidospetshop')
          .get();

        const pedidosData = pedidosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPedidos(pedidosData);
      }
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  };

  useEffect(() => {
    obtenerUsuarioAutenticado();
  }, []);

  useEffect(() => {
    obtenerPedidos();
  }, [usuarioEmail]);

  const confirmarDespacho = (pedidoId, pedidoInfo) => {
    Alert.alert(
      'Confirmar despacho',
      '¿Estás seguro de que el pedido ha sido despachado?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => despacharPedido(pedidoId, pedidoInfo),
        },
      ]
    );
  };

  const despacharPedido = async (pedidoId, pedidoInfo) => {
    try {
      const pedidoRef = firestore()
        .collection('Administradores')
        .doc(usuarioEmail)
        .collection('pedidospetshop')
        .doc(pedidoId);

      const pedidoDoc = await pedidoRef.get();
      const pedidoData = pedidoDoc.data();

      await pedidoRef.delete();

      await firestore()
        .collection('Administradores')
        .doc(usuarioEmail)
        .collection('Despachados')
        .doc(pedidoId)
        .set(pedidoData);

      Alert.alert('Despacho confirmado', 'El pedido ha sido despachado correctamente.');

      // Usamos la función obtenerPedidos después de despachar para actualizar la lista
      obtenerPedidos();
    } catch (error) {
      console.error('Error al despachar pedido:', error);
      Alert.alert('Error', 'Hubo un error al despachar el pedido. Por favor, inténtelo nuevamente.');
    }
  };

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
        keyExtractor={(producto) => producto.id}
      />

      <TouchableOpacity
        style={styles.despachadoButton}
        onPress={() => confirmarDespacho(item.id, item)}
      >
        <Text style={styles.despachadoButtonText}>Despachado</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Pedidos</Text>
      {pedidos.length === 0 ? (
        <Text style={styles.noPedidosText}>No hay pedidos para despachar</Text>
      ) : (
        <FlatList
          data={pedidos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
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
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
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
  },
  despachadoButton: {
    backgroundColor: '#599B85',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  despachadoButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noPedidosText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PedidosPetShopPanel;
