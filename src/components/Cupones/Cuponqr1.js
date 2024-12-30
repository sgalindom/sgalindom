import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import QRCode from 'react-native-qrcode-svg';

const Cuponqr1 = ({ route }) => {
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
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando detalles del cupón...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            <Icon name="paw" size={28} color="#FF6F61" /> ¡Cupón Especial!
          </Text>

          {/* Tarjeta de Detalles */}
          <View style={styles.couponDetailsContainer}>
            <View>
              <Text style={styles.sectionTitle}>
                <Icon name="hospital" size={20} color="#FF6F61" /> Veterinaria:
              </Text>
              <Text style={styles.description}>{cuponData.Veterinaria}</Text>
            </View>

            <View style={styles.separator} />

            <View>
              <Text style={styles.sectionTitle}>
                <Icon name="account" size={20} color="#FF6F61" /> Nombre:
              </Text>
              <Text style={styles.description}>{cuponData.Nombre}</Text>
            </View>

            <View style={styles.separator} />

            <View>
              <Text style={styles.sectionTitle}>
                <Icon name="tag-heart" size={20} color="#FF6F61" /> Descuento:
              </Text>
              <Text style={styles.description}>{cuponData.Descuento}%</Text>
            </View>

            <View style={styles.separator} />

            <View>
              <Text style={styles.sectionTitle}>
                <Icon name="currency-usd" size={20} color="#FF6F61" /> Precio Total:
              </Text>
              <Text style={[styles.description, { color: 'black', fontWeight: 'bold', fontSize: 18 }]}>
                ${cuponData.Preciototal}
              </Text>
            </View>
          </View>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <View style={styles.qrCard}>
              <QRCode
                value={`Veterinaria: ${cuponData.Veterinaria}\nNombre: ${cuponData.Nombre}\nDescuento: ${cuponData.Descuento}\nPrecio Total: ${cuponData.Preciototal}`}
                size={200}
              />
              <Text style={styles.qrText}>
                <Icon name="qrcode-scan" size={20} color="#6C63FF" /> Presenta este QR en tu tienda
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FDFDFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FDFDFF',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF6F61',
    marginBottom: 20,
  },
  couponDetailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F61',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: 'black',
    marginBottom: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 10,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrCard: {
    backgroundColor: '#F8E1F4',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  qrText: {
    fontSize: 16,
    color: '#6C63FF',
    marginTop: 10,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FF6F61',
  },
});

export default Cuponqr1;
