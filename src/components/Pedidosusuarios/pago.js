import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Pago = ({ navigation }) => {
  const [pedidos, setPedidos] = useState([]);
  const [totalPagar, setTotalPagar] = useState('0');

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
    try {
      const usuarioAutenticado = auth().currentUser;
  
      if (usuarioAutenticado) {
        const usuarioEmail = usuarioAutenticado.email;
        const usuarioRef = firestore().collection('usuarios').doc(usuarioEmail);
        const datosSnapshot = await usuarioRef.collection('datos').get();
  
        if (!datosSnapshot.empty) {
          Alert.alert(
            'Confirmar pedido',
            '¿Estás seguro de hacer este pedido?',
            [
              {
                text: 'Cancelar',
                style: 'cancel',
              },
              {
                text: 'Confirmar',
                onPress: async () => {
                  const primerDocumento = datosSnapshot.docs[0];
                  const { nombreCompleto, telefono } = primerDocumento.data();
  
                  const misPedidosRef = usuarioRef.collection('mispedidos').doc(); // Generar un ID único para el pedido
                  const productosRef = misPedidosRef.collection('productos');
  
                  // Obtener productos desde el estado local
                  const productosData = pedidos.map((producto) => ({
                    nombre: producto.nombre,
                    cantidad: producto.cantidad,
                    precio: producto.precio,
                  }));
  
                  await misPedidosRef.set({
                    nombreCompleto,
                    telefono,
                    total: parseFloat(totalPagar),
                    fecha: new Date(),
                  });
  
                  // Guardar productos en el pedido del usuario
                  productosData.forEach(async (producto) => {
                    await productosRef.add(producto);
                  });
  
                  // Guardar pedido también en la ruta de la veterinaria
                  const domicilioRef = firestore().collection('Administradores').doc('animalzone@gmail.com').collection('pedidospetshop').doc(misPedidosRef.id);
                  await domicilioRef.set({
                    usuario: usuarioEmail,
                    nombreCompleto,
                    telefono,
                    productos: productosData,
                    total: parseFloat(totalPagar),
                  });
  
                  await limpiarProductos(usuarioEmail);
  
                  navigation.navigate('MainPanel');
                  Alert.alert(
                    'Pedido realizado',
                    'Gracias por tu pedido. Se ha procesado correctamente. Serás contactado vía WhatsApp para confirmar tu pedido.'
                  );
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert('Error', 'No se encontraron datos de usuario. Por favor, actualiza tu información de contacto antes de realizar el pedido.');
        }
      }
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
    }
  };
  const limpiarProductos = async (usuarioEmail) => {
    const pedidoRef = firestore().collection('usuarios').doc(usuarioEmail).collection('pedidos');
    const productosSnapshot = await pedidoRef.get();
    productosSnapshot.forEach(async (doc) => {
      await doc.ref.delete();
    });
  };

  const handleEliminarPedido = async (id) => {
    try {
      const usuarioAutenticado = auth().currentUser;

      if (usuarioAutenticado) {
        Alert.alert(
          'Eliminar pedido',
          '¿Estás seguro de eliminar este pedido?',
          [
            {
              text: 'Cancelar',
              style: 'cancel',
            },
            {
              text: 'Eliminar',
              onPress: async () => {
                await firestore()
                  .collection('usuarios')
                  .doc(usuarioAutenticado.email)
                  .collection('pedidos')
                  .doc(id)
                  .delete();

                const nuevosPedidos = pedidos.filter((pedido) => pedido.id !== id);
                setPedidos(nuevosPedidos);
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.texto}>Nombre del Producto: {item.nombre}</Text>
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
              <TouchableOpacity onPress={handleHacerPedido} style={styles.botonHacerPedido}>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  pie: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    paddingTop: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  botonHacerPedido: {
    backgroundColor: '#599B85',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  botonEliminar: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  textoBotonEliminar: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5
  },
  texto: {
    color: '#000',
  },
});

export default Pago;
