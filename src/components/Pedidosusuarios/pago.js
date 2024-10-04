import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, Animated, Easing, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Pago = ({ navigation }) => {
  const [pedidos, setPedidos] = useState([]);
  const [totalPagar, setTotalPagar] = useState('0');
  const [elevationAnim] = useState(new Animated.Value(0)); // Animación de elevación
  const [modalVisible, setModalVisible] = useState(false); // Estado para el modal
  const [datosUsuario, setDatosUsuario] = useState(null); // Información del usuario

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const usuarioAutenticado = auth().currentUser;
        if (usuarioAutenticado) {
          const usuarioRef = firestore().collection('usuarios').doc(usuarioAutenticado.email);
          const datosSnapshot = await usuarioRef.collection('datos').get();
          if (!datosSnapshot.empty) {
            const datos = datosSnapshot.docs[0].data(); // Obtener los datos del primer documento
            setDatosUsuario({
              nombreCompleto: datos.nombreCompleto || 'Usuario',
              correo: usuarioAutenticado.email,
              telefono: datos.telefono || 'Teléfono no disponible',
            });
          }
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    };

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

    obtenerDatosUsuario();
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
    Alert.alert('Confirmación', '¿Deseas realizar este pedido?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar', onPress: async () => {
          try {
            // Mostrar modal
            setModalVisible(true);
  
            // Obtener el usuario actual
            const usuarioAutenticado = auth().currentUser;
  
            if (usuarioAutenticado && datosUsuario) {
              // Crear un nuevo pedido en la colección global `mispedidos`
              const misPedidosRef = firestore().collection('mispedidos');
  
              // Crear un documento con un ID único generado automáticamente
              const nuevoPedidoRef = await misPedidosRef.add({
                usuario: {
                  email: datosUsuario.correo,
                  nombre: datosUsuario.nombreCompleto,
                  telefono: datosUsuario.telefono,
                },
                pedido: pedidos, // Información de los productos
                total: totalPagar,
                fecha: new Date().toLocaleString(),
              });
  
              // Obtener el ID del nuevo documento generado
              const nuevoPedidoId = nuevoPedidoRef.id;
  
              // Crear un nuevo pedido en la colección `usuarios/{email}/mispedidos`
              const usuarioMisPedidosRef = firestore()
                .collection('usuarios')
                .doc(usuarioAutenticado.email)
                .collection('mispedidos');
  
              await usuarioMisPedidosRef.doc(nuevoPedidoId).set({
                pedido: pedidos,
                total: totalPagar,
                fecha: new Date().toLocaleString(),
              });
  
              // Limpiar el carrito en `usuarios/{email}/pedidos`
              const pedidosRef = firestore()
                .collection('usuarios')
                .doc(usuarioAutenticado.email)
                .collection('pedidos');
              const pedidosDocs = await pedidosRef.get();
  
              // Eliminar cada documento en la colección de pedidos
              pedidosDocs.forEach(async (doc) => {
                await doc.ref.delete();
              });
  
              // Vaciar el estado de pedidos después de eliminarlos
              setPedidos([]);
            }
          } catch (error) {
            console.error('Error al realizar el pedido:', error);
            Alert.alert('Error', 'Hubo un problema al procesar el pedido. Por favor, inténtelo de nuevo más tarde.');
            setModalVisible(false);
          }
        }
      }
    ]);
  };
  
  

  const handleEliminarPedido = async (id) => {
    Alert.alert('Confirmación', '¿Deseas eliminar este producto del carrito?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', onPress: async () => {
          try {
            const usuarioAutenticado = auth().currentUser;

            if (usuarioAutenticado) {
              const pedidosRef = firestore()
                .collection('usuarios')
                .doc(usuarioAutenticado.email)
                .collection('pedidos')
                .doc(id);

              await pedidosRef.delete();

              // Actualiza el estado para eliminar el pedido visualmente
              setPedidos((prevPedidos) => prevPedidos.filter(pedido => pedido.id !== id));

              Alert.alert('Éxito', 'Producto eliminado del carrito.');
            }
          } catch (error) {
            console.error('Error al eliminar el pedido:', error);
            Alert.alert('Error', 'No se pudo eliminar el producto. Por favor, inténtelo de nuevo.');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <Animated.View style={[styles.itemContainer, { transform: [{ scale: elevationAnim }] }]}>
      <View style={styles.cardContent}>
        <Image source={{ uri: item.foto }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productTitle}>{item.nombre}</Text>
          <Text style={styles.productPrice}>Precio: ${item.precio}</Text>
          <Text style={styles.productQuantity}>Cantidad: {item.cantidad}</Text>
          <TouchableOpacity
            onPress={() => handleEliminarPedido(item.id)}
            style={styles.botonEliminar}
          >
            <Icon name="trash-outline" size={20} color="white" />
            <Text style={styles.textoBotonEliminar}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {pedidos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="cart-outline" size={80} color="#D3D3D3" />
          <Text style={styles.emptyText}>No hay pedidos</Text>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.goBackButtonText}>Regresar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Carrito de compras</Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View style={styles.footer}>
              <View style={styles.subtotalContainer}>
                <Text style={styles.subtotalText}>Subtotal</Text>
                <Text style={styles.subtotalAmount}>${totalPagar}</Text>
              </View>
              <TouchableOpacity
                onPress={pedidos.length > 0 ? handleHacerPedido : null}
                style={[styles.botonHacerPedido, pedidos.length === 0 && styles.botonDeshabilitado]}
                disabled={pedidos.length === 0}
              >
                <Text style={styles.textoBoton}>Iniciar compra</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Modal de confirmación de pedido */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon name="checkmark-circle-outline" size={80} color="green" />
            <Text style={styles.modalText}>¡Pedido realizado con éxito!</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('MainPanel'); // Navegar a MainPanel
              }}
            >
              <Text style={styles.modalButtonText}>Aceptar</Text>
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
    backgroundColor: '#F7F7F7',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D3D3D3',
    marginVertical: 20,
  },
  goBackButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  goBackButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  itemContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  productQuantity: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  botonEliminar: {
    backgroundColor: '#FF4757',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoBotonEliminar: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  subtotalText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  subtotalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  botonHacerPedido: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonDeshabilitado: {
    backgroundColor: '#D3D3D3',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#6A0DAD',
    padding: 15,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Pago;
