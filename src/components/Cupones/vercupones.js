import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

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
        <Button title="Ver Detalles y Generar QR" onPress={() => navigateToCuponqr(item.id)} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('../imagenes/fondocalificaranimalzone.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.listTitle}>Lista de Cupones:</Text>
        <FlatList
          data={cupones}
          keyExtractor={(item) => item.id}
          renderItem={renderCupon}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default VerCupones;
