import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
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
        const usuarioRef = firestore().collection('usuarios').doc(usuarioAutenticado.email);
        const pedidoRef = usuarioRef.collection('pedidos').doc('default');
        const productosRef = pedidoRef.collection('productos');
        const productosComidaRef = pedidoRef.collection('productosComida');
        const productosAccesoriosRef = pedidoRef.collection('Accesorios');

        const productosJuguetesSnapshot = await productosRef.get();
        const productosComidaSnapshot = await productosComidaRef.get();
        const productosAccesoriosSnapshot = await productosAccesoriosRef.get();

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

        const productosData = [...productosJuguetesData, ...productosComidaData, ...productosAccesoriosData];

        const numeroSecuencial = await obtenerNumeroSecuencial();
        const nuevoPedidoId = `000${numeroSecuencial}`.slice(-4);

        const domicilioRef = firestore().collection('Administradores').doc('animalzone@gmail.com').collection('pedidospetshop').doc(nuevoPedidoId);

        await domicilioRef.set({
          usuario: usuarioAutenticado.email,
          productos: productosData,
          total: parseFloat(totalPagar),
        });

        await limpiarProductos();

        navigation.navigate('vet1');
        Alert.alert(
          'Pedido realizado',
          'Gracias por tu pedido. Se ha procesado correctamente. Serás contactado vía WhatsApp para confirmar tu pedido.'
        );
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

  const handleEliminarProducto = async (id, precioUnitario, cantidad, esComida, esAccesorio) => {
    try {
      const usuarioAutenticado = auth().currentUser;

      if (usuarioAutenticado) {
        const usuarioRef = firestore().collection('usuarios').doc(usuarioAutenticado.email);
        const pedidoRef = usuarioRef.collection('pedidos').doc('default');
        const productosRef = esComida
          ? pedidoRef.collection('productosComida').doc(id)
          : esAccesorio
            ? pedidoRef.collection('Accesorios').doc(id)
            : pedidoRef.collection('productos').doc(id);

        await productosRef.delete();

        setPedidos((prevPedidos) =>
          prevPedidos.filter((producto) => producto.id !== id)
        );

        setTotalPagar((prevTotal) => {
          const precioTotalProducto = parseFloat(precioUnitario.replace(/[^0-9.]/g, '')) * cantidad;
          return (prevTotal - precioTotalProducto).toFixed(3);
        });

        Alert.alert('Éxito', 'Producto eliminado correctamente');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
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
      <Text>Nombre del Producto: {item.nombre}</Text>
      {item.precioUnitario && typeof item.precioUnitario === 'number' && (
        <Text>Precio por unidad: {item.precioUnitario}</Text>
      )}
      <Text>Cantidad: {item.cantidad}</Text>
      <TouchableOpacity
        onPress={() => handleEliminarProducto(item.id, item.precioUnitario, item.cantidad, item.esComida, item.esAccesorio)}
        style={styles.botonEliminar}
      >
        <Text style={styles.textoBotonEliminar}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
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
              <Text style={styles.textoBoton}>HACER PEDIDO</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  encabezado: {
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
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
  },
  botonHacerPedido: {
    backgroundColor: '#599B85',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
  },
  botonEliminar: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotonEliminar: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Pago;
