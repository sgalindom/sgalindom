import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native'; // Elimina ImageBackground

const ProximamentePanel = () => {
  return (
    <View style={styles.container}> 
      <View style={styles.content}>
        <Image
          source={require('./imagenes/logo_2.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Próximamente</Text>
        <Text style={styles.subtitle}>Estamos trabajando para ti</Text>
      </View>
    </View> 
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0' // Color de fondo sólido 
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

export default ProximamentePanel;