import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

const VerProductoComida = ({ route }) => {
  const navigation = useNavigation();
  const { producto } = route.params;
  const [cantidad, setCantidad] = useState(1);

  // Verificar si producto está definido antes de intentar acceder a sus propiedades
  const fotoProducto = producto?.Foto;
  const nombreProducto = producto?.Nombre;
  const descripcionProducto = producto?.Descripcion;
  const precioProducto = producto?.Precio;

  const agregarAlCarrito = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'Debe iniciar sesión para agregar productos al carrito.');
        return;
      }
  
      const usuarioRef = firestore().collection('usuarios').doc(user.email);
      const pedidosRef = usuarioRef.collection('pedidos');
  
      // Obtener el siguiente ID de pedido
      const snapshot = await pedidosRef.get();
      const numPedidos = snapshot.docs.length;
      const siguientePedidoId = numPedidos + 1;
  
      // Crear el documento para el nuevo pedido
      const nuevoPedidoRef = pedidosRef.doc(siguientePedidoId.toString());
  
      // Agregar los detalles del producto al pedido
      await nuevoPedidoRef.set({
        productoId: siguientePedidoId,
        cantidad: cantidad,
        nombre: nombreProducto,
        descripcion: descripcionProducto,
        precio: precioProducto,
      });
  
      Alert.alert('Éxito', 'Producto añadido al carrito exitosamente.', [
        { text: 'OK', onPress: () => navigation.navigate('vet1comida') }
      ]);
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      Alert.alert('Error', 'Hubo un problema al agregar el producto al carrito. Por favor, inténtelo de nuevo más tarde.');
    }
  };
  

  const verCarrito = () => {
    navigation.navigate('pago');
  };

  return (
    <ImageBackground source={require('../../imagenes/fondomain.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.productInfo}>
          <ImageBackground source={fotoProducto ? { uri: fotoProducto } : null} style={styles.productImage}>
            <View style={styles.imageOverlay}>
              <Text style={styles.productName}>{nombreProducto}</Text>
            </View>
          </ImageBackground>
          <Text style={styles.productDescription}>{descripcionProducto}</Text>
          <Text style={styles.productPrice}>Precio: ${precioProducto}</Text>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={() => setCantidad(cantidad > 1 ? cantidad - 1 : 1)}>
            <Icon name="remove" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{cantidad}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={() => setCantidad(cantidad + 1)}>
            <Icon name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={agregarAlCarrito}>
          <Icon name="cart" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.addToCartButtonText}>Añadir al carrito</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewCartButton} onPress={verCarrito}>
          <Icon name="cart" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.viewCartButtonText}>Ver mi carrito</Text>
        </TouchableOpacity>
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
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  productInfo: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  productImage: {
    width: 250,
    height: 250,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  quantityButton: {
    backgroundColor: '#3498db',
    borderRadius: 20,
    padding: 12,
    marginHorizontal: 8,
    elevation: 5,
  },
  quantity: {
    fontSize: 20,
    color: 'white',
  },
  addToCartButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 5,
  },
  addToCartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  viewCartButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 5,
  },
  viewCartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default VerProductoComida;
