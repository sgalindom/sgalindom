import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

const Detalle = ({ route }) => {
  const { producto } = route.params;
  const [cantidad, setCantidad] = useState(1);
  const [usuario, setUsuario] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth().currentUser;
      setUsuario(currentUser);
    };

    fetchUser();
  }, []);

  const handleChangeCantidad = (value) => {
    setCantidad(value);
  };

  const agregarAlCarrito = async (producto) => {
    try {
      if (!usuario) {
        Alert.alert('Error', 'Debe iniciar sesión para agregar productos al carrito.');
        return;
      }

      const usuarioId = usuario.email;
      const pedidosRef = firestore().collection(`usuarios/${usuarioId}/pedidos`);

      // Verificar si el producto está definido
      if (!producto || !producto.Nombre || !producto.Descripcion || !producto.Precio) {
        throw new Error('El producto es inválido');
      }

      // Obtener la hora actual
      const horaActual = new Date().toLocaleTimeString();

      // Agregar los detalles del producto al pedido, incluyendo la hora actual
      await pedidosRef.add({
        nombre: producto.Nombre,
        descripcion: producto.Descripcion,
        precio: producto.Precio,
        cantidad: cantidad,
        hora: horaActual, // Agregar la hora al pedido
      });

      Alert.alert('Éxito', 'Producto añadido al carrito exitosamente.', [
        { text: 'OK', onPress: () => navigation.navigate('gato') }
      ]);
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      Alert.alert('Error', 'Hubo un problema al agregar el producto al carrito. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: producto.Foto }}
        style={styles.productoImagen}
      >
        {/* Contenido adicional del fondo de la imagen */}
      </ImageBackground>
      <View style={styles.infoContainer}>
        <Text style={styles.nombre}>{producto.Nombre}</Text>
        <Text style={styles.subtitulo}>Descripción:</Text>
        <Text style={styles.descripcion}>{producto.Descripcion}</Text>
        <Text style={styles.subtitulo}>Precio:</Text>
        <Text style={styles.precio}>{producto.Precio}</Text>
        <Text style={styles.subtitulo}>Cantidad:</Text>
        <TouchableOpacity style={styles.cantidadContainer}>
          <Icon name="remove-circle" size={30} onPress={() => handleChangeCantidad(cantidad - 1)} />
          <Text style={styles.cantidad}>{cantidad}</Text>
          <Icon name="add-circle" size={30} onPress={() => handleChangeCantidad(cantidad + 1)} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonCarrito} onPress={() => agregarAlCarrito(producto)}>
          <Text style={styles.textoBotonCarrito}>Añadir al carrito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  productoImagen: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoContainer: {
    padding: 20,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  descripcion: {
    fontSize: 16,
    marginBottom: 20,
  },
  precio: {
    fontSize: 16,
    marginBottom: 20,
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cantidad: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  botonCarrito: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotonCarrito: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Detalle;
