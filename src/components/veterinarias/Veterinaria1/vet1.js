
  import React from 'react';
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native';

const Vet1Screen = () => {
  return (
    <ImageBackground
      source={require('../../imagenes/fondomain.jpg')}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={require('../../imagenes/dogshouse.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Próximamente</Text>
        <Text style={styles.subtitle}>Estamos trabajando para ti</Text>
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
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
  },
});

export default Vet1Screen;
