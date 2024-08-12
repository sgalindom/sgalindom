import React from 'react';
import { View, Text, ScrollView, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const PetShopScreen = () => {
  const productos = [
    {
      nombre: 'Juguete para perros',
      descripcion: 'Juguete resistente para perros, ideal para juegos interactivos.',
      icono: 'basketball-outline', // Cambiado a un hueso de perro
      ruta: 'vet1juguetes',
    },
    {
      nombre: 'Comida balanceada',
      descripcion: 'Alimento completo y balanceado para perros de todas las edades y razas.',
      icono: 'paw-sharp', // Cambiado a un icono de comida
      ruta: 'vet1comida',
    },
    {
      nombre: 'Más Accesorios',
      descripcion: 'Collar y correa ajustables para pasear a tu mascota con estilo y seguridad.',
      icono: 'paw-sharp',
      ruta: 'vet1accesorios',
    },
    // Agrega más productos según sea necesario
  ];

  const navigation = useNavigation();

  const goTo = (ruta) => {
    navigation.navigate(ruta);
  };

  return (
    <ImageBackground
      source={require('../../imagenes/fondomain.jpg')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Pet Shop</Text>
        {productos.map((producto, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => goTo(producto.ruta)}>
            <View style={styles.iconContainer}>
              <Icon name={producto.icono} size={40} color="white" />
            </View>
            <Text style={styles.productName}>{producto.nombre}</Text>
            <Text style={styles.productDescription}>{producto.descripcion}</Text>
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
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: '#2F9FFA',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 16,
    color: 'black',
  },
  productDescription: {
    fontSize: 16,
    flex: 1,
    marginLeft: 16,
    color: 'black',
  },
});

export default PetShopScreen;
