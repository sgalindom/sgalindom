import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ServicioFuneraria = ({ navigation }) => {
  const goToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Mensaje introductorio */}
      <Text style={styles.messageText}>
        Conmemora a tu compañero de vida con el amor y respeto que merecen. Además, obtendrás beneficios adicionales como descuentos en veterinarias aliadas, kit de cumpleaños y mucho más para celebrar su vida de la mejor manera.
      </Text>

      {/* Tarjeta del Plan Básico Mensual Mascota */}
      <View style={styles.planCard}>
        <Image source={require('../imagenes/Basico.jpg')} style={styles.planImage} />
        <View style={styles.planContent}>
          <Text style={styles.planTitle}>Plan Básico Mensual Mascota</Text>
          <Text style={styles.planDescription}>Elige este plan para disfrutar de los beneficios básicos para tu mascota.</Text>
          <TouchableOpacity style={styles.planButton} onPress={() => goToScreen('Basico')}>
            <Icon name="paw" size={24} color="#fff" style={styles.planButtonIcon} />
            <Text style={styles.buttonText}>Explorar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tarjeta del Plan Premium Mensual Mascota */}
      <View style={styles.planCard}>
        <Image source={require('../imagenes/Basico.jpg')} style={styles.planImage} />
        <View style={styles.planContent}>
          <Text style={styles.planTitle}>Plan Premium Mensual Mascota</Text>
          <Text style={styles.planDescription}>Accede a un plan completo con beneficios exclusivos para tu mascota.</Text>
          <TouchableOpacity style={styles.planButton} onPress={() => goToScreen('Premium')}>
            <Icon name="star" size={24} color="#fff" style={styles.planButtonIcon} />
            <Text style={styles.buttonText}>Explorar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Puedes agregar más tarjetas aquí */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Asegura que el contenido se expanda para permitir el desplazamiento
    backgroundColor: '#f7f7f7', // Fondo gris claro
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50, // Asegura espacio para el final de la página
  },
  messageText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 30,
    lineHeight: 24,
    paddingHorizontal: 25,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  planImage: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  planContent: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 15,
    textAlign: 'center',
  },
  planDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 15,
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50', // Botón verde
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  planButtonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ServicioFuneraria;
