import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ScrollView, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient'; // Importa LinearGradient

const VerveterinariasScreen = ({ route, navigation }) => {
  const { veterinariaId } = route.params || {};
  const [veterinaria, setVeterinaria] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0)); 

  useEffect(() => {
    if (veterinariaId) {
      const obtenerDatosVeterinaria = async () => {
        try {
          const snapshot = await firestore().collection('Veterinarias').doc(veterinariaId).get();

          if (snapshot.exists) {
            setVeterinaria(snapshot.data());
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }).start(); 
          } else {
            console.log('No se encontró la veterinaria con el ID proporcionado.');
          }
        } catch (error) {
          console.error('Error al obtener datos de la veterinaria:', error);
        }
      };

      obtenerDatosVeterinaria();
    } else {
      console.log('No se ha proporcionado un ID válido.');
    }
  }, [veterinariaId]);

  if (!veterinaria) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <LinearGradient 
          colors={['#E0F2F7', '#BBDEFB']} // Degradado azul pastel
          style={styles.cardContainer}
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: veterinaria.Foto }}
              style={styles.image}
            />
          </View>

          <Text style={styles.title}>{veterinaria.Nombre}</Text>

          <View style={styles.infoContainer}>
            <Icon name="location" size={20} color="#000" style={styles.icon} />
            <Text style={styles.infoText}>{veterinaria.Direccion}, {veterinaria.Barrio}</Text>
          </View>

          <View style={styles.descriptionCard}>
            <Text style={styles.description}>{veterinaria.Descripcion}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Servicios</Text>
            {veterinaria.Servicios && veterinaria.Servicios.split('-').map((servicio, index) => (
              <Text key={index} style={styles.service}>{servicio.trim()}</Text>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(`tel:${veterinaria.Telefono}`)}>
            <Text style={styles.buttonText}>
              <Icon name="call" size={20} color="#FFF" style={styles.icon} /> Llamar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonOutline} onPress={() => Linking.openURL(veterinaria.Maps)}>
            <Text style={styles.buttonOutlineText}>
              <Icon name="map" size={20} color="#FFF" style={styles.icon} /> Abrir Mapa
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFF', // Fondo blanco
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  cardContainer: {
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, 
    shadowRadius: 12, 
    elevation: 8, 
    width: '100%',
  },
  imageWrapper: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 20,
    alignItems: 'center', // Centra la imagen horizontalmente
    justifyContent: 'center', // Centra la imagen verticalmente
  },
  image: {
    width: '100%',
    height: undefined, // Permite que la altura se ajuste automáticamente
    aspectRatio: 1, // Mantén la relación de aspecto 1:1 (ajusta si es necesario)
    resizeMode: 'contain', 
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2196F3', // Color azul llamativo
    marginBottom: 15,
    textAlign: 'center', 
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  icon: {
    marginRight: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#000', // Texto negro
  },
  descriptionCard: {
    backgroundColor: '#FFF', 
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  description: {
    fontSize: 16,
    color: '#000', // Texto negro
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#FFF', 
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2196F3', // Color azul llamativo
    marginBottom: 10,
  },
  service: {
    fontSize: 16,
    color: '#000', // Texto negro
    marginBottom: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3', // Color azul principal
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25, // Bordes redondeados
    marginVertical: 10,
    width: '100%',
    shadowColor: '#2196F3', 
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonOutline: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2196F3', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25, // Bordes redondeados
    marginVertical: 10,
    width: '100%',
  },
  buttonOutlineText: {
    color: '#FFF', 
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: '#333',
  },
});

export default VerveterinariasScreen;