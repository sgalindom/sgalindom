import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

const Vet1Comida = () => {
  const navigation = useNavigation();
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState('Perro');
  const [tipo, setTipo] = useState('Seca');

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const user = auth().currentUser;

        if (user) {
          const productosSnapshot = await firestore()
            .collection('Veterinarias')
            .doc('1')
            .collection('Comida')
            .where('Categoria', '==', categoria)
            .where('Tipo', '==', tipo)
            .get();

          if (productosSnapshot.empty) {
            setProductos([]);
          } else {
            const productosData = productosSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setProductos(productosData);
          }
        }
      } catch (error) {
        console.error('Error al obtener productos de comida:', error);
      }
    };

    obtenerProductos();
  }, [categoria, tipo]);

  const handleVerProducto = (producto) => {
    navigation.navigate('verproductocomida', { producto });
  };

  const handleMisPedidos = () => {
    navigation.navigate('pago');
  };

  const renderProducto = ({ item }) => (
    <TouchableOpacity onPress={() => handleVerProducto(item)} style={styles.productoContainer}>
      <View style={styles.card}>
        <ImageBackground source={{ uri: item.Foto }} style={styles.image}>
          <View style={styles.overlay}>
            <Text style={styles.productName}>{item.Nombre}</Text>
            <Text style={styles.productPrice}>Precio: {item.Precio}</Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('../../imagenes/fondomain.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <View style={styles.pickerContainer}>
            <Icon name="paw" size={20} color="#2F9FFA" style={styles.icon} />
            <Picker
              selectedValue={categoria}
              style={styles.picker}
              onValueChange={(itemValue) => setCategoria(itemValue)}
            >
              <Picker.Item label="Perro" value="Perro" />
              <Picker.Item label="Gato" value="Gato" />
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Icon name="fast-food" size={20} color="#2F9FFA" style={styles.icon} />
            <Picker
              selectedValue={tipo}
              style={styles.picker}
              onValueChange={(itemValue) => setTipo(itemValue)}
            >
              <Picker.Item label="Seca" value="Seca" />
              <Picker.Item label="Húmeda" value="Húmeda" />
              <Picker.Item label="Snacks" value="Snacks" />
            </Picker>
          </View>
        </View>
        <FlatList
          data={productos}
          renderItem={renderProducto}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.flatlistContainer}
        />
        <TouchableOpacity onPress={handleMisPedidos} style={styles.cartButton}>
          <Icon name="cart" size={24} color="white" />
          <Text style={styles.cartButtonText}>Mis Pedidos</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const windowWidth = Dimensions.get('window').width;
const cardWidth = (windowWidth - 32 - 16) / 2;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    paddingHorizontal: 8,
  },
  picker: {
    height:50,
    width: 120,
    color: '#333',
  },
  icon: {
    marginRight: 5,
  },
  flatlistContainer: {
    flexGrow: 1,
  },
  productoContainer: {
    width: '50%',
    padding: 8,
  },
  card: {
    width: cardWidth,
    height: cardWidth * 1.25,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    width: '100%',
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'white',
    marginBottom: 4,
  },
  productPrice: {
    color: 'white',
    fontSize: 12,
  },
  cartButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#2F9FFA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
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
