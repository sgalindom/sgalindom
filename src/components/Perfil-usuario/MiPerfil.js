import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome5';

const MiPerfil = ({ navigation }) => {
  const goToMiInformacion = () => {
    navigation.navigate('MiInformacion');
  };

  const goToMisMascotas = () => {
    navigation.navigate('MisMascotas');
  };

  const goToMisPedidos = () => {
    navigation.navigate('mispedidos');
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
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  const renderOption = (iconName, text, onPress) => (
    <TouchableOpacity style={styles.option} onPress={onPress} key={text}>
      <Icon name={iconName} size={24} color="#000000" style={styles.icon} />
      <Text style={styles.optionText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../imagenes/fondomain.jpg')}
        style={styles.backgroundImage}
      >
        <Image source={require('../imagenes/fondomain.jpg')} style={styles.logo} />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Mi Perfil</Text>
            {renderOption('user', 'Mi Información', goToMiInformacion)}
            {renderOption('paw', 'Mis Mascotas', goToMisMascotas)}
            {renderOption('shopping-cart', 'Mis Pedidos', goToMisPedidos)}
            {renderOption('ticket-alt', 'Cupones', goToCupones)}
            {renderOption('bell', 'Notificaciones', goToNotificaciones)}
            {renderOption('file-alt', 'Políticas', goToPolíticas)}
            {renderOption('star', 'Calificanos', goToCalificar)}
            <TouchableOpacity style={styles.logoutButton} onPress={handleCerrarSesion}>
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: 150,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#F3F3F3',
  },
  icon: {
    marginRight: 15,
  },
  optionText: {
    color: 'black',
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MiPerfil;
