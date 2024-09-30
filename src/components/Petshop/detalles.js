import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';
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
    setCantidad(prevCantidad => (value < 1 ? 1 : value));
  };

  const agregarAlCarrito = async (producto) => {
    try {
      if (!usuario) {
        Alert.alert('Error', 'Debe iniciar sesión para agregar productos al carrito.');
        return;
      }
  
      const usuarioId = usuario.email;
      const pedidosRef = firestore().collection(`usuarios/${usuarioId}/pedidos`);
  
      if (!producto || !producto.Nombre || !producto.Descripcion || !producto.Precio || !producto.Foto) {
        throw new Error('El producto es inválido o no tiene una imagen asociada');
      }
  
      const horaActual = new Date().toLocaleTimeString();
  
      await pedidosRef.add({
        nombre: producto.Nombre,
        descripcion: producto.Descripcion,
        precio: producto.Precio,
        foto: producto.Foto,  // Asegúrate de que este campo se está agregando
        cantidad: cantidad,
        hora: horaActual,
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
    <ImageBackground source={require('../imagenes/fondomain.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Imagen del producto */}
          <Image
            source={{ uri: producto.Foto }}
            style={styles.productoImagen}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.nombre}>{producto.Nombre}</Text>
            <Text style={styles.precio}>${producto.Precio}</Text>
          </View>

          <View style={styles.descripcionContainer}>
            <Text style={styles.subtitulo}>Descripción</Text>
            <Text style={styles.descripcion}>{producto.Descripcion}</Text>
          </View>

          {/* Control de cantidad */}
          <View style={styles.cantidadContainer}>
            <Icon name="remove-circle-outline" size={40} color="#ff4757" onPress={() => handleChangeCantidad(cantidad - 1)} />
            <Text style={styles.cantidad}>{cantidad}</Text>
            <Icon name="add-circle-outline" size={40} color="#2ed573" onPress={() => handleChangeCantidad(cantidad + 1)} />
          </View>

          {/* Botón de añadir al carrito */}
          <TouchableOpacity style={styles.botonCarrito} onPress={() => agregarAlCarrito(producto)}>
            <Text style={styles.textoBotonCarrito}>Añadir al carrito</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 10,
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  productoImagen: {
    width: '50%',
    height: 250,
    borderRadius: 20,
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  precio: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff4757',
  },
  descripcionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    color: '#555',
    textAlign: 'justify',
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cantidad: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2f3542',
    marginHorizontal: 20,
  },
  botonCarrito: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    width: '100%',
    elevation: 10,
  },
  textoBotonCarrito: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Detalle;
