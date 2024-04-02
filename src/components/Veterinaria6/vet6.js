import React from 'react';
import { View, Text, Button, Linking, ImageBackground, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

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

const Vet6Screen = () => {
  const handleLocationPress = () => {
    Linking.openURL('https://www.google.com/maps/place/Tienda+de+Mascotas+Mawi/@7.0663759,-73.1682523,15z/data=!4m2!3m1!1s0x0:0x5a38c0903429fe21?sa=X&ved=2ahUKEwj0obmrsqaEAxW7SzABHehIBZ4Q_BJ6BAgREAA');
  };

  const handleWhatsAppPress = () => {
    Linking.openURL('https://api.whatsapp.com/send?phone=573125000627');
  };

  const handleCallPress = () => {
    Linking.openURL('tel:+573125000627');
  };

  const handleLinkPress = () => {
    Linking.openURL('https://tiendademascotasmawi.com/?gad_source=1&gclid=Cj0KCQiAoKeuBhCoARIsAB4WxtfzhGnjew8m7jju3KCJ_qQTm9KPu6pamUlBWTYfxdl712YGmwkl7jkaAnp4EALw_wcB');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground
        source={require('../imagenes/fondovet4.jpg')}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Imagen del logo de la veterinaria */}
          <Image
            source={require('../imagenes/mawi.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Tienda de Mascotas Mawi</Text>
          <Text style={styles.subtitle}>Somos una tienda de servicios y productos veterinarios para tú mascota. Ofrecemos un acompañamiento ético y profesional con sentido humano, calidad y política de precios justos.</Text>
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

export default Vet6Screen;
