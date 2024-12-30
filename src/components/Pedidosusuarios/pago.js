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
  const [modalDatosBancariosVisible, setModalDatosBancariosVisible] = useState(false); // Modal para datos bancarios
  const [datosUsuario, setDatosUsuario] = useState(null); // Información del usuario
  const [metodoPago, setMetodoPago] = useState('');

  const metodosDePago = [
    { id: 'transferencia', label: 'Transferencia' },
    { id: 'nequi', label: 'Nequi' },
    { id: 'efectivo', label: 'Efectivo' },
    { id: 'contraentrega', label: 'Contraentrega' },
  ];

  const renderMetodoPago = (metodo) => (
    <TouchableOpacity
      key={metodo.id}
      style={styles.metodoPagoItem}
      onPress={() => setMetodoPago(metodo.id)}
    >
      <View style={[styles.circle, metodoPago === metodo.id && styles.circleSelected]} />
      <Text style={styles.metodoPagoText}>{metodo.label}</Text>
    </TouchableOpacity>
  );

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
              direccion: datos.direccion || 'Dirección no disponible',
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
            if (metodoPago === 'nequi' || metodoPago === 'transferencia') {
              setModalDatosBancariosVisible(true);
            } else {
              setModalVisible(true);
            }

            const usuarioAutenticado = auth().currentUser;

            if (usuarioAutenticado && datosUsuario) {
              const misPedidosRef = firestore().collection('mispedidos');
              const nuevoPedidoRef = await misPedidosRef.add({
                usuario: {
                  email: datosUsuario.correo,
                  nombre: datosUsuario.nombreCompleto,
                  telefono: datosUsuario.telefono,
                  direccion: datosUsuario.direccion,
                },
                pedido: pedidos,
                total: totalPagar,
                metodoPago,
                fecha: new Date().toLocaleString(),
              });

              const nuevoPedidoId = nuevoPedidoRef.id;

              const usuarioMisPedidosRef = firestore()
                .collection('usuarios')
                .doc(usuarioAutenticado.email)
                .collection('mispedidos');

              await usuarioMisPedidosRef.doc(nuevoPedidoId).set({
                pedido: pedidos,
                total: totalPagar,
                metodoPago,
                fecha: new Date().toLocaleString(),
              });

              const pedidosRef = firestore()
                .collection('usuarios')
                .doc(usuarioAutenticado.email)
                .collection('pedidos');
              const pedidosDocs = await pedidosRef.get();

              pedidosDocs.forEach(async (doc) => {
                await doc.ref.delete();
              });

              setPedidos([]);
            }
          } catch (error) {
            console.error('Error al realizar el pedido:', error);
            Alert.alert('Error', 'Hubo un problema al procesar el pedido. Por favor, inténtelo de nuevo más tarde.');
            setModalVisible(false);
          }
        },
      },
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
    <Animated.View style={[styles.itemContainer, { transform: [{ scale: elevationAnim }] }]} >
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
              <View style={styles.metodosPagoContainer}>
                <Text style={styles.metodoPagoTitulo}>Selecciona un método de pago:</Text>
                {metodosDePago.map(renderMetodoPago)}
              </View>
              <View style={styles.subtotalContainer}>
                <Text style={styles.subtotalText}>Subtotal</Text>
                <Text style={styles.subtotalAmount}>${totalPagar}</Text>
              </View>
              <TouchableOpacity
                onPress={pedidos.length > 0 ? handleHacerPedido : null}
                style={[styles.botonHacerPedido, pedidos.length === 0 && styles.botonDeshabilitado]}
                disabled={pedidos.length === 0 || !metodoPago}
              >
                <Text style={styles.textoBoton}>Iniciar compra</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      {/* Modal para datos bancarios */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDatosBancariosVisible}
        onRequestClose={() => setModalDatosBancariosVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Por favor enviar comprobante</Text>
            <Text style={styles.modalText}>Datos Bancarios:</Text>
            <Text style={styles.modalText}>Banco: XYZ</Text>
            <Text style={styles.modalText}>Cuenta: 123456789</Text>
            <Text style={styles.modalText}>Nequi: 987654321</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalDatosBancariosVisible(false);
                navigation.navigate('MainPanel'); // Navegar a MainPanel
              }}
            >
              <Text style={styles.modalButtonText}>Finalizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    
 

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
    color: '#333', // Cambiado a negro
    marginVertical: 20,
  },
  goBackButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  goBackButtonText: {
    color: 'white', // Cambiado a negro
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000', // Cambiado a negro
  },
  itemContainer: {
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', // Cambiado a negro
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#000', // Cambiado a negro
  },
  productQuantity: {
    fontSize: 14,
    color: '#000', // Cambiado a negro
  },
  botonEliminar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9534F',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  textoBotonEliminar: {
    color: '#FFF',
    marginLeft: 5,
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  metodosPagoContainer: {
    marginBottom: 20,
  },
  metodoPagoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // Cambiado a negro
    marginBottom: 10,
  },
  metodoPagoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000', // Cambiado a negro
    marginRight: 10,
  },
  circleSelected: {
    backgroundColor: '#3498db',
  },
  metodoPagoText: {
    fontSize: 16,
    color: '#000', // Cambiado a negro
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  subtotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // Cambiado a negro
  },
  subtotalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // Cambiado a negro
  },
  botonHacerPedido: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonDeshabilitado: {
    backgroundColor: '#D3D3D3',
  },
  textoBoton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 20,
  },
  modalButton: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    fontSize: 18,
    color: '#FFF',
  },
});

export default Pago;