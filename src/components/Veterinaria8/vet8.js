import React from 'react';
import { View, Text, Button, Linking, ImageBackground, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const CustomButton = ({ title, onPress }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const Vet8Screen = () => {
  const handleLocationPress = () => {
    Linking.openURL('https://www.google.com/maps/place/Cl%C3%ADnica+Veterinaria+Los+Perritos/@7.0724443,-73.1014452,15z/data=!4m2!3m1!1s0x0:0xc603e2c56dfcbc5c?sa=X&ved=2ahUKEwic9rDJtaaEAxWCTjABHXw_CTAQ_BJ6BAgPEAA');
  };

  const handleWhatsAppPress = () => {
    Linking.openURL('https://api.whatsapp.com/send?phone=573014695827');
  };

  const handleCallPress = () => {
    Linking.openURL('tel:+573014695827');
  };

  const handleLinkPress = () => {
    Linking.openURL('https://www.facebook.com/vetlosperritos/');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground
        source={require('../imagenes/fondovet4.jpg')}
        style={styles.container}
      >
        <View style={styles.content}>
          
          <Image
            source={require('../imagenes/losperritos.jpg')}
            style={styles.image}
          />
          <Text style={styles.title}>Veterinaria Los Perritos </Text>
          <Text style={styles.subtitle}>Somos una empresa con más de 20 años de experiencia en el cuidado y salud de tu mascota.</Text>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>SERVICIOS</Text>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Vacunas</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Medicamentos</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Accesorios</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Concentrados</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Alimentos</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>Petshop </Text>
            </View>
          </View>
          
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
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
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
    color: 'gray', 
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: 'gray', 
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
    borderRadius: 20, 
    overflow: 'hidden', 
  },
  button: {
    backgroundColor: '#007AFF', 
    height: 40, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20, 
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
    color: 'white', 
    fontSize: 16,
  },
});

export default Vet8Screen;
