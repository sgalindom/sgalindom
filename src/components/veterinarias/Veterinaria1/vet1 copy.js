import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation

export default function Vet1Screen() {
  const navigation = useNavigation(); // Inicializar la navegación

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Fondo y encabezado */}
      <Image source={require('../../imagenes/dogshouse.png')} style={styles.banner} />

      <Text style={styles.title}>Welcome to Dog´s House!</Text>

      {/* Grid de productos */}
      <View style={styles.grid}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('ProductsForDogs')} // Navegar a ProductsForDogs
        >
          <Image source={require('../../imagenes/fondomain.jpg')} style={styles.image} />
          <Text style={styles.cardText}>Products for Dogs</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('ProductsForCats')} // Navegar a ProductsForCats
        >
          <Image source={require('../../imagenes/fondomain.jpg')} style={styles.image} />
          <Text style={styles.cardText}>Products for Cats</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('PetSpa')} // Navegar a PetSpa
        >
          <Image source={require('../../imagenes/fondomain.jpg')} style={styles.image} />
          <Text style={styles.cardText}>Pet Spa</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('SpecialOffers')} // Navegar a SpecialOffers
        >
          <Image source={require('../../imagenes/fondomain.jpg')} style={styles.image} />
          <Text style={styles.cardText}>Special Offers</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Permitir que el contenedor crezca
    backgroundColor: '#f2f2f2',
    alignItems: 'center', // Centrar los elementos horizontalmente
    paddingBottom: 30, // Espacio inferior
  },
  banner: {
    width: '70%',
    height: 200,
    resizeMode: 'contain', // Cambiar a 'contain' para que la imagen se ajuste bien
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 0,
    marginBottom: 20,
    alignSelf: 'center', // Centrar la imagen en el contenedor
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginVertical: 20,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%', // Asegurar que la cuadrícula ocupe el ancho completo
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    width: '40%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
});
