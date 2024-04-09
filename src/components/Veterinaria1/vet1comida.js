import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Vet1Comida = ({ navigation }) => {
  const [productos, setProductos] = useState([]);
  const [nombreVeterinaria, setNombreVeterinaria] = useState('');

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const user = auth().currentUser;

        if (user) {
          // Obtener datos de la veterinaria
          const veterinariaSnapshot = await firestore()
            .collection('Veterinarias')
            .doc('1') // Puedes cambiar '1' por el ID de la veterinaria correspondiente
            .get();

          // Almacenar el nombre de la veterinaria en el estado
          const nombreVeterinaria = veterinariaSnapshot.exists ? veterinariaSnapshot.data().Nombre : '';
          setNombreVeterinaria(nombreVeterinaria);

          // Obtener productos de comida
          const productosSnapshot = await firestore()
            .collection('Veterinarias')
            .doc('1') // Puedes cambiar '1' por el ID de la veterinaria correspondiente
            .collection('Comida') // Cambia a la colección correspondiente para productos de comida
            .get();

          const productosData = productosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            cantidad: 0,
          }));

          setProductos(productosData);
        }
      } catch (error) {
        console.error('Error al obtener productos de comida:', error);
      }
    };

    obtenerProductos();
  }, []);

  const handleAgregarCarrito = async (id, nombre, descripcion, cantidadSeleccionada, precioUnitario) => {
    try {
      if (cantidadSeleccionada > 0) {
        const user = auth().currentUser;

        if (user) {
          const usuarioRef = firestore().collection('usuarios').doc(user.email);
          const pedidoRef = usuarioRef.collection('pedidos').doc('default');
          const productoRef = pedidoRef.collection('productosComida').doc(id); // Cambia a la colección correspondiente para productos de comida

          // Obtener la cantidad actual del producto
          const productoActual = await productoRef.get();
          const cantidadActual = productoActual.exists ? productoActual.data().cantidad : 0;

          // Sumar la cantidad seleccionada a la cantidad actual
          const nuevaCantidad = cantidadActual + cantidadSeleccionada;

          // Calcular el precio total del producto
          const precioTotal = precioUnitario * nuevaCantidad;

          // Actualizar la cantidad y precio en Firestore
          await productoRef.set({
            nombre: nombre || '',
            descripcion: descripcion || '',
            cantidad: nuevaCantidad,
            precioUnitario,
            precioTotal,
          });

          // Reiniciar el contador a cero
          setProductos((prevProductos) =>
            prevProductos.map((producto) =>
              producto.id === id ? { ...producto, cantidad: 0 } : producto
            )
          );
        }
      } else {
        Alert.alert('Error', 'Seleccione una cantidad mayor que 0');
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

  const handleIncrementarCantidad = (id) => {
    setProductos((prevProductos) =>
      prevProductos.map((producto) =>
        producto.id === id ? { ...producto, cantidad: producto.cantidad + 1 } : producto
      )
    );
  };

  const handleDecrementarCantidad = (id) => {
    setProductos((prevProductos) =>
      prevProductos.map((producto) =>
        producto.id === id ? { ...producto, cantidad: Math.max(0, producto.cantidad - 1) } : producto
      )
    );
  };

  const handleNavegarPago = () => {
    navigation.navigate('pago'); // Asegúrate de que 'pago' coincida con el nombre de tu pantalla de pago en la configuración de navegación
  };

  const renderItem = ({ item }) => (
    <View style={styles.tarjeta}>
      <Image source={{ uri: item.Foto }} style={styles.imagen} />
      <View style={styles.overlay}>
        <Text style={styles.nombreProducto}>{item.Nombre}</Text>
        <Text style={styles.descripcionProducto}>{item.Descripcion}</Text>
        <Text style={styles.precioProducto}>Precio: {item.Precio}</Text>
        <View style={styles.botonesContainer}>
          <View style={styles.contadorContainer}>
            <TouchableOpacity onPress={() => handleDecrementarCantidad(item.id)} style={styles.botonMasMenos}>
              <Text style={styles.menosMasText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.cantidadText}>{item.cantidad}</Text>
            <TouchableOpacity onPress={() => handleIncrementarCantidad(item.id)} style={styles.botonMasMenos}>
              <Text style={styles.menosMasText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() =>
              handleAgregarCarrito(
                item.id,
                item.Nombre,
                item.Descripcion,
                item.cantidad,
                item.Precio
              )
            }
            style={styles.botonAgregar}
          >
            <Text style={styles.textoBotonAgregar}>Añadir al carrito</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  
  useEffect(() => {
    navigation.setOptions({ title: `Productos (${nombreVeterinaria})` });
  }, [nombreVeterinaria, navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={productos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity onPress={handleNavegarPago} style={styles.botonMisCompras}>
        <Text>Mis Pedidos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tarjeta: {
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden', // Para recortar la imagen dentro de la tarjeta
  },
  imagen: {
    width: '100%',
    height: 300, // Altura ajustable según tus necesidades
    marginBottom: 8,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  nombreProducto: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  descripcionProducto: {
    color: 'white',
    marginBottom: 8,
  },
  precioProducto: {
    color: 'white',
    marginBottom: 8,
  },
  botonesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  cantidadText: {
    fontSize: 20,
    paddingHorizontal: 16,
    color: 'black',
  },
  menosMasText: {
    fontSize: 20,
    paddingHorizontal: 16,
    color: '#599B85',
  },
  botonMasMenos: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  botonAgregar: {
    backgroundColor: '#2F9FFA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  textoBotonAgregar: {
    color: 'white',
    fontWeight: 'bold',
  },
  botonMisCompras: {
    backgroundColor: '#2F9FFA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
});

export default Vet1Comida;
