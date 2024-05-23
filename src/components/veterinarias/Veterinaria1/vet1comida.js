import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

const Vet1Comida = ({ navigation }) => {
  const [productos, setProductos] = useState([]);
  const [nombreVeterinaria, setNombreVeterinaria] = useState('');

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const user = auth().currentUser;

        if (user) {
          const veterinariaSnapshot = await firestore()
            .collection('Veterinarias')
            .doc('1')
            .get();

          const nombreVeterinaria = veterinariaSnapshot.exists ? veterinariaSnapshot.data().Nombre : '';
          setNombreVeterinaria(nombreVeterinaria);

          const productosSnapshot = await firestore()
            .collection('Veterinarias')
            .doc('1')
            .collection('Comida')
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
          const productoRef = pedidoRef.collection('Comida').doc(id);

          const productoActual = await productoRef.get();
          const cantidadActual = productoActual.exists ? productoActual.data().cantidad : 0;

          const nuevaCantidad = cantidadActual + cantidadSeleccionada;
          const precioTotal = precioUnitario * nuevaCantidad;

          await productoRef.set({
            nombre: nombre || '',
            descripcion: descripcion || '',
            cantidad: nuevaCantidad,
            precioUnitario,
            precioTotal,
          });

          setProductos((prevProductos) =>
            prevProductos.map((producto) =>
              producto.id === id ? { ...producto, cantidad: 0 } : producto
            )
          );

          Alert.alert('Producto Agregado', 'El producto ha sido agregado a tu carrito');
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
    navigation.navigate('pago');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <ImageBackground source={{ uri: item.Foto }} style={styles.image}>
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
          style={styles.addButton}
        >
          <Icon name="cart" size={24} color="white" />
          <Text style={styles.addButtonLabel}>Añadir</Text>
        </TouchableOpacity>
      </ImageBackground>
      <View style={styles.overlay}>
        <Text style={styles.productName}>{item.Nombre}</Text>
        <Text style={styles.productDescription}>{item.Descripcion}</Text>
        <Text style={styles.productPrice}>Precio: {item.Precio}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => handleDecrementarCantidad(item.id)} style={styles.plusMinusButton}>
            <Icon name="remove" size={20} color="#599B85" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.cantidad}</Text>
          <TouchableOpacity onPress={() => handleIncrementarCantidad(item.id)} style={styles.plusMinusButton}>
            <Icon name="add" size={20} color="#599B85" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    navigation.setOptions({ title: `Productos Comida (${nombreVeterinaria})` });
  }, [nombreVeterinaria, navigation]);

  return (
    <ImageBackground source={require('../../imagenes/fondomain.jpg')} style={styles.container}>
      <FlatList
        data={productos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity onPress={handleNavegarPago} style={styles.cartButton}>
        <Icon name="cart" size={24} color="white" />
        <Text style={styles.cartButtonText}>Mis Pedidos</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 8,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  productDescription: {
    color: 'white',
    marginBottom: 8,
  },
  productPrice: {
    color: 'white',
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  quantityText: {
    fontSize: 20,
    paddingHorizontal: 16,
    color: 'white',
  },
  plusMinusButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  addButton: {
    backgroundColor: '#2F9FFA',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  addButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  cartButton: {
    backgroundColor: '#2F9FFA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default Vet1Comida;
   
