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
    // Agrega el estilo para el ScrollView
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Image source={FondoImage} style={styles.backgroundImage} resizeMode="cover" />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Detalles del Cupón</Text>
          

          {/* Recuadro para los detalles del cupón */}
          <ScrollView style={styles.couponDetailsContainer}>
            <Text style={styles.sectionTitle}>Veterinaria:</Text>
            <Text style={styles.description}>{cuponData.Veterinaria}</Text>

            <Text style={styles.sectionTitle}>Nombre:</Text>
            <Text style={styles.description}>{cuponData.Nombre}</Text>

            <Text style={styles.sectionTitle}>Descuento:</Text>
            <Text style={styles.description}>{cuponData.Descuento}</Text>

            <Text style={styles.sectionTitle}>Precio:</Text>
            <Text style={styles.description}>{cuponData.Precio}</Text>

            <Text style={styles.sectionTitle}>Precio Total:</Text>
            <Text style={[styles.description, { marginBottom: 20 }]}>{cuponData.Preciototal}</Text>

          </ScrollView>
        </View>

        {/* Muestra el código QR con la información correspondiente */}
        <View style={styles.qrContainer}>
          <View style={styles.qrCard}>
            <ScrollView>
              <QRCode
                value={`Veterinaria: ${cuponData.Veterinaria}\nNombre: ${cuponData.Nombre}\nDescuento: ${cuponData.Descuento}\nPrecio: ${cuponData.Precio}\nPrecio Total: ${cuponData.Preciototal}`}
                size={200}
              />
            </ScrollView>
            <Text style={styles.qrText}>Presenta este QR para reclamar tu descuento</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: 'black',
  },
  description: {
    fontSize: 18,
    marginBottom: 5,
    color: 'black',
  },
  loadingText: {
    fontSize: 18,
    color: 'black',
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
    marginHorizontal: 20,
    marginBottom: 10,
    width: '90%',
    maxHeight: '50%',
  },
  // Estilo para el contenedor del código QR
  qrContainer: {
    alignItems: 'center',
    marginTop: -50, // Ajusta este valor según sea necesario
  },
  // Estilo para la tarjeta del código QR
  qrCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  // Estilo para el texto dentro de la tarjeta del QR
  qrText: {
    fontSize: 16,
    marginTop: 10,
    color: 'black',
  },
});

export default Cuponqr1;
