import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const VerCupones = () => {
  const [cupones, setCupones] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCupones = async () => {
      try {
        const cuponesSnapshot = await firestore().collection('Cupones').get();
        const cuponesData = cuponesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCupones(cuponesData);
      } catch (error) {
        console.error('Error al obtener la lista de cupones:', error);
      }
    };

    fetchCupones();
  }, []);

  const navigateToCuponqr = (cuponId) => {
    navigation.navigate('Cuponqr1', { cuponId });
  };

  const renderCupon = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToCuponqr(item.id)}>
      <View style={styles.cuponCard}>
        <Text style={styles.cuponTitle}>{item.Veterinaria}</Text>
        <Text style={styles.cuponSubtitle}>Nombre: {item.Nombre}</Text>
        <Text style={styles.cuponSubtitle}>Descuento: {item.Descuento}</Text>
        <Text style={styles.cuponSubtitle}>Precio: {item.Precio}</Text>
        <Text style={styles.cuponSubtitle}>Precio Total: {item.Preciototal}</Text>
        <TouchableOpacity style={styles.detailsButton} onPress={() => navigateToCuponqr(item.id)}>
          <Icon name="information-circle" size={20} color="white" />
          <Text style={styles.detailsButtonText}>Ver Detalles y Generar QR</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('../imagenes/fondomain.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.listTitle}>Lista de Cupones:</Text>
        {cupones.map((cupon, index) => (
          <View key={index}>
            {renderCupon({ item: cupon })}
          </View>
        ))}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  cuponCard: {
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  cuponTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cuponSubtitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2F9FFA',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '70%',
    alignSelf: 'center',
  },
  detailsButtonText: {
    color: 'white',
    marginLeft: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default VerCupones;
