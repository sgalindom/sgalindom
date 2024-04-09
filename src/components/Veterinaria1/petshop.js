import React from 'react';
import { View, Text, ScrollView, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PetShopScreen = () => {
  const productos = [
    {
      nombre: 'Juguete para perros',
      descripcion: 'Juguete resistente para perros, ideal para juegos interactivos.',
      ruta: 'vet1juguetes', // Nueva propiedad para la ruta de navegación
    },
    {
      nombre: 'Comida balanceada',
      descripcion: 'Alimento completo y balanceado para perros de todas las edades y razas.',
      ruta: 'vet1comida', // Nueva propiedad para la ruta de navegación
    },
    {
      nombre: 'Mas Accesorios',
      descripcion: 'Collar y correa ajustables para pasear a tu mascota con estilo y seguridad.',
      ruta: 'vet1accesorios', // Nueva propiedad para la ruta de navegación
    },
    // Agrega más productos según sea necesario
  ];

  const navigation = useNavigation();

  const goTo = (ruta) => {
    navigation.navigate(ruta); // Navega a la ruta específica al hacer clic
  };

  return (
    <ImageBackground
      source={require('../imagenes/petshopfondo.jpg')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Pet Shop</Text>
        {productos.map((producto, index) => (
          <TouchableOpacity key={index} style={styles.tarjetaProducto} onPress={() => goTo(producto.ruta)}>
            {/* Agrega la imagen del producto aquí */}
            {/* <Image source={producto.imagen} style={styles.productoImage} /> */}
            <Text style={styles.productoNombre}>{producto.nombre}</Text>
            <Text style={styles.productoDescripcion}>{producto.descripcion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: 'white',
  },
  tarjetaProducto: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  productoImage: {
    width: 290,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },
  productoNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black', // Letra en negro
  },
  productoDescripcion: {
    fontSize: 16,
    marginTop: 8,
    color: 'black', // Letra en negro
  },
});

export default PetShopScreen;
