import React from 'react';
import { View, Text, Linking, ScrollView, ImageBackground, StyleSheet, Image, TouchableOpacity } from 'react-native';

// Componente de botón genérico
const CustomButton = ({ title, onPress }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const Vet3Screen = () => {
  const handleLocationPress = () => {
    Linking.openURL('https://www.google.com/maps/place/Veterinaria+TU+MASCOTA+SPA/@7.1124864,-73.1079304,15z/data=!4m2!3m1!1s0x0:0x8e4e471f0d26a4db?sa=X&ved=2ahUKEwie_8P6g5eEAxV5RDABHQMXCvUQ_BJ6BAgKEAA');
  };

  const handleWhatsAppPress = () => {
    Linking.openURL('https://api.whatsapp.com/send?phone=573215576418');
  };

  const handleCallPress = () => {
    Linking.openURL('tel:+573215576418');
  };

  const handleLinkPress = () => {
    Linking.openURL('https://linkr.bio/Tumascotaspa.co');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={require('../imagenes/fondovet4.jpg')}
        style={styles.imageBackground}
      >
        <View style={styles.content}>
          <Image
            source={require('../imagenes/tumascotaspa.png')}
            style={styles.image}
          />
          <Text style={styles.title}>TU MASCOTA SPA</Text>
          <Text style={styles.subtitle}>¡Tú dales amor, nosotros nos encargamos del resto! 🌟</Text>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>SERVICIOS</Text>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>PET SHOP</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>BAÑO Y PELUQUERÍA</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>VETERINARÍA</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Accesorios para todos los peludos</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Envíos a todo el país 🇨🇴</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Cra. 36 # 52-135, Bucaramanga, Santander 680003</Text>
            </View>
          </View>
          {/* Botones separados */}
          <CustomButton title="Ubicación" onPress={handleLocationPress} />
          <CustomButton title="Contactar por WhatsApp" onPress={handleWhatsAppPress} />
          <CustomButton title="Llamar" onPress={handleCallPress} />
          <CustomButton title="Visita nuestra página WEB" onPress={handleLinkPress} />
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center"
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  content: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'gray', // Cambiado a gris
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: 'gray', // Cambiado a gris
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bullet: {
    fontSize: 16,
    marginRight: 5,
    color: 'black',
  },
  listItemText: {
    fontSize: 16,
    color: 'black',
  },
  address: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 10,
    borderRadius: 20, // Esquinas curvas para los botones
    overflow: 'hidden', // Para que las esquinas curvas funcionen correctamente
  },
  button: {
    backgroundColor: '#007AFF', // Color de fondo del botón
    height: 40, // Altura fija para todos los botones
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20, // Esquinas curvas para los botones
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white', // Color del texto del botón
    fontSize: 16,
  },
});

export default Vet3Screen;
