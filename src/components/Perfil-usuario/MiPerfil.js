import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import auth from '@react-native-firebase/auth';

const MiPerfil = ({ navigation }) => {
  const goToMiInformacion = () => {
    navigation.navigate('MiInformacion');
  };

  const goToMisMascotas = () => {
    navigation.navigate('MisMascotas');
  };

  const goToPolíticas = () => {
    navigation.navigate('politica');
  };

  const goToNotificaciones = () => {
    navigation.navigate('notificaciones');
  };

  const goToCupones = () => {
    navigation.navigate('vercupones');
  };

  const goToCalificar = () => {
    navigation.navigate('calificacion');
  };

  const handleCerrarSesion = async () => {
    try {
      await auth().signOut();
      // Navega a la pantalla de inicio de sesión después de cerrar sesión
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  const renderOption = (imageSource, text, onPress) => (
    <TouchableOpacity style={styles.option} onPress={onPress} key={text}>
      <View style={styles.rowContainer}>
        <Image source={imageSource} style={styles.icon} />
        <Text style={styles.optionText}>{text}</Text>
      </View>
      <View style={styles.separator}></View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../imagenes/fondoadminpanel.jpg')} // Fondo de pantalla
      style={styles.backgroundImage}
    >
      <Image source={require('../imagenes/fondoperfil.jpg')} style={styles.headerImage} />

      <ScrollView contentContainerStyle={styles.container}>
        {renderOption(require('../imagenes/informacion.png'), 'Mi Perfil', goToMiInformacion)}
        {renderOption(require('../imagenes/mascotas.png'), 'Mis Mascotas', goToMisMascotas)}
        {renderOption(require('../imagenes/cupones.png'), 'Cupones', goToCupones)}
        {renderOption(require('../imagenes/notificaciones.png'), 'Notificaciones', goToNotificaciones)}
        {renderOption(require('../imagenes/politicas.png'), 'Políticas', goToPolíticas)}
        {renderOption(require('../imagenes/calificar.png'), 'Calificanos', goToCalificar)}
        
        {/* Botón de cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleCerrarSesion}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  headerImage: {
    width: '100%',
    height: 150, // Ajusta la altura según tus preferencias
  },
  option: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    width: '80%', // O ajusta según tus preferencias
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  optionText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '400',
    textAlignVertical: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
    width: '80%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#2F9FFA',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MiPerfil;
