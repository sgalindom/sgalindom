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
          const productosJuguetesSnapshot = await firestore()
            .collection('usuarios')
            .doc(usuarioAutenticado.email)
            .collection('pedidos')
            .doc('default')
            .collection('productos')
            .get();

          const productosComidaSnapshot = await firestore()
            .collection('usuarios')
            .doc(usuarioAutenticado.email)
            .collection('pedidos')
            .doc('default')
            .collection('productosComida')
            .get();

          const productosAccesoriosSnapshot = await firestore()
            .collection('usuarios')
            .doc(usuarioAutenticado.email)
            .collection('pedidos')
            .doc('default')
            .collection('Accesorios')
            .get();

          const productosJuguetesData = productosJuguetesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            esComida: false,
            esAccesorio: false,
          }));

          const productosComidaData = productosComidaSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            esComida: true,
            esAccesorio: false,
          }));

          const productosAccesoriosData = productosAccesoriosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            esComida: false,
            esAccesorio: true,
          }));

          const pedidosData = [...productosJuguetesData, ...productosComidaData, ...productosAccesoriosData];
          setPedidos(pedidosData);

          const sumaTotal = pedidosData.reduce((total, producto) => {
            const precioUnitario = parseFloat(producto.precioUnitario.replace(/[^0-9.]/g, ''));
            const totalProducto = precioUnitario * producto.cantidad || 0;
            return total + totalProducto;
          }, 0);

          setTotalPagar(sumaTotal.toFixed(3));
        }
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      }
    };

    obtenerPedidos();
  }, []);

  const handleHacerPedido = async () => {
    try {
      const usuarioAutenticado = auth().currentUser;
  
      if (usuarioAutenticado) {
        const usuarioEmail = usuarioAutenticado.email;
        const usuarioRef = firestore().collection('usuarios').doc(usuarioEmail);
        const datosSnapshot = await usuarioRef.collection('datos').get();
        
        if (!datosSnapshot.empty) {
          const primerDocumento = datosSnapshot.docs[0];
          const { nombreCompleto, telefono } = primerDocumento.data();
  
          const pedidoRef = usuarioRef.collection('pedidos').doc(); // Generar un ID único para el pedido
          const productosRef = pedidoRef.collection('productos');
  
          // Obtener productos desde el estado local
          const productosData = pedidos.map((producto) => ({
            nombre: producto.nombre,
            cantidad: producto.cantidad,
            precioUnitario: producto.precioUnitario,
          }));
  
          await pedidoRef.set({
            nombreCompleto: nombreCompleto,
            telefono: telefono,
            total: parseFloat(totalPagar),
          });
  
          // Guardar productos en el pedido del usuario
          productosData.forEach(async (producto) => {
            await productosRef.add(producto);
          });
  
          // Guardar pedido también en la ruta de la veterinaria
          const domicilioRef = firestore().collection('Administradores').doc('animalzone@gmail.com').collection('pedidospetshop').doc(pedidoRef.id);
          await domicilioRef.set({
            usuario: usuarioEmail,
            nombreCompleto: nombreCompleto,
            telefono: telefono,
            productos: productosData,
            total: parseFloat(totalPagar),
          });
  
          await limpiarProductos();
  
          navigation.navigate('vet1');
          Alert.alert(
            'Pedido realizado',
            'Gracias por tu pedido. Se ha procesado correctamente. Serás contactado vía WhatsApp para confirmar tu pedido.'
          );
          Alert.alert('Error', 'No se encontraron datos de usuario. Por favor, actualiza tu información de contacto antes de realizar el pedido.');
        }
      }
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
    }
  };

  const limpiarProductos = async () => {
    const usuarioAutenticado = auth().currentUser;

    if (usuarioAutenticado) {
      const usuarioRef = firestore().collection('usuarios').doc(usuarioAutenticado.email);
      const pedidoRef = usuarioRef.collection('pedidos').doc('default');
      const productosRef = pedidoRef.collection('productos');
      const productosComidaRef = pedidoRef.collection('productosComida');
      const productosAccesoriosRef = pedidoRef.collection('Accesorios');

      await limpiarColeccion(productosRef);
      await limpiarColeccion(productosComidaRef);
      await limpiarColeccion(productosAccesoriosRef);
    }
  };

  const limpiarColeccion = async (coleccionRef) => {
    const querySnapshot = await coleccionRef.get();
    querySnapshot.forEach((doc) => {
      doc.ref.delete();
    });
  };

  const obtenerNumeroSecuencial = async () => {
    try {
      const numeroSecuencialRef = firestore().collection('Administradores').doc('animalzone@gmail.com').collection('secuenciapepetshop').doc('Secuencial');
      const numeroSecuencialDoc = await numeroSecuencialRef.get();

      if (numeroSecuencialDoc.exists) {
        const nuevoNumeroSecuencial = numeroSecuencialDoc.data().numero + 1;
        await numeroSecuencialRef.update({ numero: nuevoNumeroSecuencial });
        return nuevoNumeroSecuencial.toString();
      } else {
        await numeroSecuencialRef.set({ numero: 1 });
        return '1';
      }
    } catch (error) {
      console.error('Error al obtener el número secuencial:', error);
      return null;
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.texto}>Nombre del Producto: {item.nombre}</Text>
      {item.precioUnitario && typeof item.precioUnitario === 'number' && (
        <Text style={styles.texto}>Precio por unidad: {item.precioUnitario}</Text>
      )}
      <Text style={styles.texto}>Cantidad: {item.cantidad}</Text>
      <TouchableOpacity
        onPress={() => confirmarEliminarProducto(item.id, item.precioUnitario, item.cantidad, item.esComida, item.esAccesorio)}
        style={styles.botonEliminar}
      >
        <Icon name="trash-outline" size={20} color="white" />
        <Text style={styles.textoBotonEliminar}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  const confirmarEliminarProducto = (id, precioUnitario, cantidad, esComida, esAccesorio) => {
    Alert.alert(
      'Eliminar producto',
      '¿Estás seguro que deseas eliminar este producto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => handleEliminarProducto(id, precioUnitario, cantidad, esComida, esAccesorio),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const handleEliminarProducto = async (id, precioUnitario, cantidad, esComida, esAccesorio) => {
    try {
      const usuarioAutenticado = auth().currentUser;

      if (usuarioAutenticado) {
        const usuarioRef = firestore().collection('usuarios').doc(usuarioAutenticado.email);
        const pedidoRef = usuarioRef.collection('pedidos').doc('default');
        const productosRef = esComida
          ? pedidoRef.collection('productosComida')
          : esAccesorio
          ? pedidoRef.collection('Accesorios')
          : pedidoRef.collection('productos');

        await productosRef.doc(id).delete();

        const nuevosPedidos = pedidos.filter((producto) => producto.id !== id);
        setPedidos(nuevosPedidos);

        const sumaTotal = nuevosPedidos.reduce((total, producto) => {
          const precio = parseFloat(producto.precioUnitario.replace(/[^0-9.]/g, ''));
          const totalProducto = precio * producto.cantidad || 0;
          return total + totalProducto;
        }, 0);

        setTotalPagar(sumaTotal.toFixed(3));
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

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
    color: '#000', // Letra en negro
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco semitransparente
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
    color: '#000', // Letra en negro
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
    marginLeft: 5,
  },
  texto: {
    color: '#000', // Letra en negro
  },
});

export default Pago;
