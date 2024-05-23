import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

const Vet1Accesorios = ({ navigation }) => {
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

          // Obtener productos de accesorios
          const productosSnapshot = await firestore()
            .collection('Veterinarias')
            .doc('1') // Puedes cambiar '1' por el ID de la veterinaria correspondiente
            .collection('Accesorios') // Cambia a la colección correspondiente para productos de accesorios
            .get();

          const productosData = productosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            cantidad: 0,
          }));

          setProductos(productosData);
        }
      } catch (error) {
        console.error('Error al obtener productos de accesorios:', error);
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
          const productoRef = pedidoRef.collection('Accesorios').doc(id); // Cambia a la colección correspondiente para productos de accesorios

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

          // Mostrar alerta de producto agregado
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
    navigation.navigate('pago'); // Asegúrate de que 'pago' coincida con el nombre de tu pantalla de pago en la configuración de navegación
  };

  const renderItem = ({ item }) => (
    <View style={styles.tarjeta}>
      <ImageBackground source={{ uri: item.Foto }} style={styles.imagen}>
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
          <Icon name="cart" size={24} color="white" />
          <Text style={styles.textoBotonAgregar}>Añadir</Text>
        </TouchableOpacity>
      </ImageBackground>
      <View style={styles.overlay}>
        <Text style={styles.nombreProducto}>{item.Nombre}</Text>
        <Text style={styles.descripcionProducto}>{item.Descripcion}</Text>
        <Text style={styles.precioProducto}>Precio: {item.Precio}</Text>
        <View style={styles.botonesContainer}>
          <TouchableOpacity onPress={() => handleDecrementarCantidad(item.id)} style={styles.botonMasMenos}>
            <Icon name="remove" size={20} color="#599B85" />
          </TouchableOpacity>
          <Text style={styles.cantidadText}>{item.cantidad}</Text>
          <TouchableOpacity onPress={() => handleIncrementarCantidad(item.id)} style={styles.botonMasMenos}>
            <Icon name="add" size={20} color="#599B85" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  useEffect(() => {navigation.setOptions({ title: `Productos Accesorios (${nombreVeterinaria})` });
}, [nombreVeterinaria, navigation]);

return (
  <ImageBackground source={require('../../imagenes/fondomain.jpg')} style={styles.container}>
    <FlatList
      data={productos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
    <TouchableOpacity onPress={handleNavegarPago} style={styles.botonMisCompras}>
      <Icon name="cart" size={24} color="white" />
      <Text style={styles.textoBotonMisCompras}>Mis Pedidos</Text>
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
tarjeta: {
  borderRadius: 8,
  marginBottom: 16,
  overflow: 'hidden',
},
imagen: {
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
  justifyContent: 'flex-end',
},
cantidadText: {
  fontSize: 20,
  paddingHorizontal: 16,
  color: 'white',
},
botonMasMenos: {
  backgroundColor: 'transparent',
  paddingHorizontal: 8,
},
botonAgregar: {
  backgroundColor: '#2F9FFA',
  padding: 8,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row', // Alinear icono y texto horizontalmente
},
textoBotonAgregar: {
  color: 'white',
  fontWeight: 'bold',
  marginLeft: 4, // Espacio entre el icono y el texto
},
botonMisCompras: {
  backgroundColor: '#2F9FFA',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 16,
  flexDirection: 'row',
  justifyContent: 'center',
},
textoBotonMisCompras: {
  color: 'white',
  fontWeight: 'bold',
  marginLeft: 8,
},

});
export default Vet1Accesorios;
   
