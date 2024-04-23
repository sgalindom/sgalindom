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

const Vet5Screen = () => {
  const handleLocationPress = () => {
    Linking.openURL('https://www.google.com/maps/place/CONSULTORIO+VETERINARIO+ANIMAL+LIFE/@7.1148435,-73.1082411,15z/data=!4m2!3m1!1s0x0:0x1f9c0647df18fb63?sa=X&ved=2ahUKEwjrzJTAsKaEAxVMRjABHUjmB0EQ_BJ6BAhBEAA');
  };

  const handleWhatsAppPress = () => {
    Linking.openURL('https://api.whatsapp.com/send?phone=573178870731');
  };

  const handleCallPress = () => {
    Linking.openURL('tel:+573178870731');
  };

  const handleLinkPress = () => {
    Linking.openURL('https://www.facebook.com/animallifebucaramanga/?locale=es_LA');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={require('../../imagenes/fondovet4.jpg')}
        style={styles.imageBackground}
      >
        <View style={styles.content}>
          {/* Imagen del logo de la veterinaria */}
          <Image
            source={require('../../imagenes/animallife.jpg')}
            style={styles.image}
          />
          <Text style={styles.title}>Consultorio Vet Animal Life</Text>
          <Text style={styles.subtitle}>Somos un equipo veterinario experto en el cuidado de su mascota, teniendo conocimiento de varios ambitos medicos veterinarios. </Text>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>SERVICIOS</Text>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Consulta Veterinaria🐩🐈</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Hospitalización 🏥</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Laboratorio 🔬</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Ecografía💻</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Peluquería ✂🐩</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Petshop 🐕</Text>
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

export default Vet5Screen;
