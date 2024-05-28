import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MisProductos = () => {
  const navigation = useNavigation();

  const handleAccesoriosClick = () => {
    navigation.navigate('accesorios');
  };

  const handleComidaClick = () => {
    navigation.navigate('comida');
  };

  const handleProductosClick = () => {
    navigation.navigate('productos');
  };

  return (
    <ImageBackground source={require('../imagenes/fondomain.jpg')} style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAccesoriosClick}>
          <Text style={styles.buttonText}>Accesorios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleComidaClick}>
          <Text style={styles.buttonText}>Comida</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleProductosClick}>
          <Text style={styles.buttonText}>Juguetes</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2F9FFA',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MisProductos;
