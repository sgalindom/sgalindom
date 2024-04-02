import React from 'react';
import { View, Text, Button, Linking, ScrollView, ImageBackground, StyleSheet, Image, TouchableOpacity } from 'react-native';

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

const Vet4Screen = () => {
  const handleLocationPress = () => {
    Linking.openURL('https://www.google.com/maps/place/Veterinaria+Mascotas+Gold+Palmas/@7.119392,-73.1120545,15z/data=!4m6!3m5!1s0x8e683f53146aa403:0xb99b81f8a334828d!8m2!3d7.119392!4d-73.1120545!16s%2Fg%2F11js9plw6y?entry=ttu');
  };

  const handleWhatsAppPress = () => {
    Linking.openURL('https://api.whatsapp.com/send?phone=573187070209');
  };

  const handleCallPress = () => {
    Linking.openURL('tel:+573187070209');
  };

  const handleLinkPress = () => {
    Linking.openURL('https://veterinariamascotasgold.com/');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={require('../imagenes/fondovet4.jpg')}
        style={styles.imageBackground}
      >
        <View style={styles.content}>
          {/* Imagen del logo de la veterinaria */}
          <Image
            source={require('../imagenes/mascotasgold.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Mascotas Gold</Text>
          <Text style={styles.subtitle}>Los amamos tanto como tú, por eso te brindamos un servicio profesional, transparente, ágil y confiable con equipos de alta tecnología. </Text>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>SERVICIOS</Text>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Consulta Veterinaria</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Vacunación</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Cirugía</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Desparasitación</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Rayos X Digital</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Transporte De Mascotas</Text>
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

export default Vet4Screen;
