import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Alert, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Pago = ({ navigation }) => {
  const [pedidos, setPedidos] = useState([]);
  const [totalPagar, setTotalPagar] = useState('0');
  const [elevationAnim] = useState(new Animated.Value(0)); // Animación de elevación

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const usuarioAutenticado = auth().currentUser;

        if (usuarioAutenticado) {
          const pedidosSnapshot = await firestore()
            .collection('usuarios')
            .doc(usuarioAutenticado.email)
            .collection('pedidos')
            .get();

          const pedidosData = pedidosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setPedidos(pedidosData);

          // Iniciar la animación de elevación cuando se carguen los pedidos
          Animated.timing(elevationAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }).start();
        }
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      }
    };

    obtenerPedidos();
  }, []);

  useEffect(() => {
    const sumaTotal = pedidos.reduce((total, pedido) => {
      const precioTotalPedido = parseFloat(pedido.precio) * parseInt(pedido.cantidad);
      return total + precioTotalPedido;
    }, 0);

    setTotalPagar(sumaTotal.toFixed(3));
  }, [pedidos]);

  const handleHacerPedido = async () => {
    // Código de confirmación de pedido (igual que antes)
  };

  const handleEliminarPedido = async (id) => {
    // Código para eliminar un pedido (igual que antes)
  };

  const renderItem = ({ item }) => (
    <Animated.View style={[styles.itemContainer, styles.neumorphicCard, { transform: [{ scale: elevationAnim }] }]}>
      <View style={styles.cardContent}>
        <Text style={styles.texto}>Producto: {item.nombre}</Text>
        <Text style={styles.texto}>Precio: ${item.precio}</Text>
        <Text style={styles.texto}>Cantidad: {item.cantidad}</Text>
        <TouchableOpacity
          onPress={() => handleEliminarPedido(item.id)}
          style={styles.botonEliminar}
        >
          <Icon name="trash-outline" size={20} color="white" />
          <Text style={styles.textoBotonEliminar}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <ImageBackground source={require('../imagenes/fondomain.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <FlatList
          data={pedidos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <View style={styles.encabezado}>
              <Text style={styles.titulo}>Detalle del Pedido</Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View style={styles.pie}>
              <Text style={styles.totalText}>Total a Pagar: ${totalPagar}</Text>
              <TouchableOpacity
                onPress={pedidos.length > 0 ? handleHacerPedido : null}
                style={[styles.botonHacerPedido, pedidos.length === 0 && styles.botonDeshabilitado]}
                disabled={pedidos.length === 0}
              >
                <Icon name="checkmark-circle-outline" size={20} color="white" />
                <Text style={styles.textoBoton}>HACER PEDIDO</Text>
              </TouchableOpacity>
            </View>
          )}
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
  encabezado: {
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 12,
  },
  itemContainer: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#F0F0F3',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardContent: {
    backgroundColor: '#F0F0F3',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#A3B1C6',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  pie: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#A9A9A9',
    paddingTop: 16,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  botonHacerPedido: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  botonDeshabilitado: {
    backgroundColor: '#D3D3D3',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 18,
  },
  botonEliminar: {
    backgroundColor: '#FF4757',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#FF6B81',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  textoBotonEliminar: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 16,
  },
  texto: {
    color: '#2F3542',
    fontSize: 18,
    fontWeight: 'bold',
  },
  neumorphicCard: {
    backgroundColor: '#F0F0F3',
    borderRadius: 20,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default Pago;
