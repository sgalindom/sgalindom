// Dentro de PedidosPetShopPanel

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Modal from 'react-native-modal';

const PedidosPetShopPanel = () => {
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Función asincrónica para obtener pedidos de Firestore
    const fetchPedidos = async () => {
      try {
        const pedidosSnapshot = await firestore().collection('mispedidos').get();
        const pedidosList = pedidosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPedidos(pedidosList);
      } catch (error) {
        console.error('Error fetching pedidos:', error);
        Alert.alert('Error', 'Ocurrió un error al obtener los pedidos. Por favor, inténtalo de nuevo más tarde.');
      }
    };

    // Llamar a la función fetchPedidos al montar el componente
    fetchPedidos();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // Función para despachar un pedido seleccionado
  const despacharPedido = async () => {
    try {
      if (!selectedPedido) {
        Alert.alert('Error', 'No hay pedido seleccionado para despachar.');
        return;
      }

      const pedidoId = selectedPedido.id;

      // Obtener referencia del documento a despachar
      const pedidoRef = firestore().collection('mispedidos').doc(pedidoId);

      // Obtener los datos del pedido antes de eliminarlo
      const pedidoData = (await pedidoRef.get()).data();

      // Eliminar el pedido de la colección 'mispedidos'
      await pedidoRef.delete();

      // Agregar el pedido despachado a la colección 'pedidosdespachados'
      await firestore().collection('pedidosdespachados').add({
        ...pedidoData,
        despachado: true, // Asegurarse de que está marcado como despachado
        fechaDespacho: new Date().toISOString(), // Agregar la fecha de despacho (opcional)
      });

      // Actualizar la lista de pedidos localmente eliminando el pedido despachado
      const updatedPedidos = pedidos.filter(pedido => pedido.id !== pedidoId);
      setPedidos(updatedPedidos);

      // Cerrar el modal y limpiar el pedido seleccionado
      setIsModalVisible(false);
      setSelectedPedido(null);

      Alert.alert('Pedido Despachado', 'El pedido ha sido despachado exitosamente.');
    } catch (error) {
      console.error('Error despachando pedido:', error);
      Alert.alert('Error', 'Ocurrió un error al despachar el pedido. Por favor, inténtalo de nuevo.');
    }
  };

  // Función para renderizar cada ítem de la lista de pedidos
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => {
        setSelectedPedido(item);
        setIsModalVisible(true);
      }}>
        {item.pedido.map((producto, index) => (
          <View key={index}>
            <Image source={{ uri: producto.foto }} style={styles.image} />
            <View style={styles.info}>
              <Text style={[styles.title, { color: '#000' }]}>{producto.nombre}</Text>
              <Text style={styles.text}>Cantidad: {producto.cantidad}</Text>
              <Text style={styles.text}>Precio unitario: ${producto.precio}</Text>
              <Text style={styles.text}>Total: ${producto.total}</Text>
              <Text style={styles.text}>Descripción: {producto.descripcion}</Text>
              <Text style={styles.text}>Fecha: {item.fecha}</Text>
              <Text style={styles.text}>Hora: {producto.hora}</Text>
              <Text style={styles.text}>Usuario: {item.usuario.nombre}</Text>
              {/* Método de Pago */}
              <Text style={styles.text}>Método de Pago: {item.metodoPago || 'No especificado'}</Text>
            </View>
          </View>
        ))}
      </TouchableOpacity>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pedidos de PetShop</Text>
      <FlatList
        data={pedidos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      {/* Modal para confirmar el despacho del pedido */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Confirmar Despacho</Text>
          <Text style={styles.modalText}>
            ¿Estás seguro que deseas despachar el pedido de {selectedPedido?.pedido[0].nombre}?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={despacharPedido}>
              <Text style={styles.buttonText}>Despachar Pedido</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#f44336' }]} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  card: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  info: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // Color negro para el texto del nombre
  },
  text: {
    fontSize: 16,
    color: '#000', // Color negro para el resto del texto
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PedidosPetShopPanel;
