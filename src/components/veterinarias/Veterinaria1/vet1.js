import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut, BounceIn } from 'react-native-reanimated';

const PerfilImage = () => (
  <ImageBackground source={require('../../imagenes/fondoperfil.jpg')} style={styles.perfilImageContainer} resizeMode="cover" />
);

const TextoBienvenida = () => (
  <View style={styles.textContainer}>
    <Text style={styles.title}>¡Bienvenido a Pet Shop!</Text>
    <Text style={styles.subtitle}>Encuentra todo para consentir a tu mascota</Text>
  </View>
);

const BotonCategoria = ({ onPress, iconName, label }) => (
  <Animated.View entering={ZoomIn} exiting={ZoomOut}>
    <TouchableOpacity style={styles.button} onPress={onPress} accessibilityLabel={label} accessibilityRole="button">
      <Icon name={iconName} size={30} color="white" />
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  </Animated.View>
);

const Vet1Screen = () => {
  const navigation = useNavigation();
  const backgroundImage = require('../../imagenes/fondomain.jpg');

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.animatedContainer}>
          <PerfilImage />
          <TextoBienvenida />
          <View style={styles.buttonsContainer}>
            <BotonCategoria onPress={() => navigation.navigate('vet1comida')} iconName="paw-outline" label="Comida para Mascotas" />
            <BotonCategoria onPress={() => navigation.navigate('vet1juguetes')} iconName="paw-outline" label="Juguetes Divertidos" />
            <BotonCategoria onPress={() => navigation.navigate('vet1accesorios')} iconName="ribbon-outline" label="Accesorios de Estilo" />
          </View>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
  },
  perfilImageContainer: {
    width: '110%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2AC9FA',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonsContainer: {
    alignItems: 'center',
    width: '100%',
  },
  animatedContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2AC9FA',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 15,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginLeft: 10,
  },
});

export default Vet1Screen;
