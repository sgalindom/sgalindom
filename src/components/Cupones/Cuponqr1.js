import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';

// Importa la imagen
import FondoImage from '../imagenes/fondoadminpanel.jpg';

const Cuponqr1 = () => {
  const route = useRoute();
  const cuponId = route.params?.cuponId;

  const [cuponData, setCuponData] = useState(null);

  useEffect(() => {
    const fetchCuponData = async () => {
      try {
        const cuponDocument = await firestore().collection('Cupones').doc(cuponId).get();
        if (cuponDocument.exists) {
          setCuponData({ id: cuponDocument.id, ...cuponDocument.data() });
        } else {
          console.warn(`No se encontró el cupón con ID: ${cuponId}`);
        }
      } catch (error) {
        console.error('Error al obtener los detalles del cupón:', error);
      }
    };

    if (cuponId) {
      fetchCuponData();
    }
  }, [cuponId]);

  if (!cuponData) {
    // Mientras se carga la información, puedes mostrar un indicador de carga o un mensaje.
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando detalles del cupón...</Text>
      </View>
    );
  }

  return (
    // Agrega el estilo para la imagen de fondo
    <View style={styles.container}>
      <Image source={FondoImage} style={styles.backgroundImage} resizeMode="cover" />
      <Text style={styles.title}>Detalles del Cupón</Text>
      <Text style={styles.subtitle}>Presenta este QR para reclamar tu descuento</Text>

      {/* Recuadro para los detalles del cupón */}
      <View style={styles.couponDetailsContainer}>
        <ScrollView>
          <Text style={styles.sectionTitle}>Veterinaria:</Text>
          <Text style={styles.description}>{cuponData.Veterinaria}</Text>

          <Text style={styles.sectionTitle}>Nombre:</Text>
          <Text style={styles.description}>{cuponData.Nombre}</Text>

          <Text style={styles.sectionTitle}>Descuento:</Text>
          <Text style={styles.description}>{cuponData.Descuento}</Text>

          <Text style={styles.sectionTitle}>Precio:</Text>
          <Text style={styles.description}>{cuponData.Precio}</Text>

          <Text style={styles.sectionTitle}>Precio Total:</Text>
          <Text style={styles.description}>{cuponData.Preciototal}</Text>
        </ScrollView>
      </View>

      {/* Muestra el código QR con la información correspondiente */}
      <QRCode
        value={`Veterinaria: ${cuponData.Veterinaria}\nNombre: ${cuponData.Nombre}\nDescuento: ${cuponData.Descuento}\nPrecio: ${cuponData.Precio}\nPrecio Total: ${cuponData.Preciototal}`}
        size={300}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black', // Color negro
  },
  subtitle: {
    fontSize: 18,
    color: 'black', // Color negro
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black', // Color negro
  },
  description: {
    fontSize: 18,
    marginBottom: 5,
    color: 'black', // Color negro
  },
  loadingText: {
    fontSize: 18,
    color: 'black', // Color negro
  },
  // Agrega un estilo para la imagen de fondo
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  // Estilo para el recuadro de detalles del cupón
  couponDetailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    width: '80%',
    maxHeight: '60%',
  },
});

export default Cuponqr1;
