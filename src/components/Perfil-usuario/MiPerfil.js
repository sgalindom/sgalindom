import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome5';

const MiPerfil = ({ navigation }) => {
  const goToMiInformacion = () => {
    navigation.navigate('MiInformacion'); // PascalCase
  };

  const goToMisMascotas = () => {
    navigation.navigate('MisMascotas'); // PascalCase
  };

  const goToMisPedidos = () => {
    navigation.navigate('MisPedidos'); // PascalCase
  };

  const goToPoliticas = () => {
    navigation.navigate('politica'); // PascalCase
  };

  const goToNotificaciones = () => {
    navigation.navigate('notificaciones'); // PascalCase
  };

  const goToCupones = () => {
    navigation.navigate('vercupones'); // PascalCase
  };

  const goToCalificar = () => {
    navigation.navigate('calificacion'); // PascalCase
  };

  const handleCerrarSesion = async () => {
    try {
      const currentUser = auth().currentUser;
  
      if (currentUser) {
        await auth().signOut();
        
        // Restablecer el stack de navegación y navegar explícitamente al Login
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }], // Asegura que se limpie el stack y se redirige al Login
        });
      } else {
        Alert.alert('Atención', 'No hay un usuario actualmente autenticado.');
      }
    } catch (error) {
      console.error('Error al cerrar sesión', error);
      Alert.alert('Error', 'No se pudo cerrar sesión. Inténtalo de nuevo.');
    }
  };
  

  const renderOption = (iconName, text, onPress, uniqueKey) => (
    <TouchableOpacity style={styles.option} onPress={onPress} key={uniqueKey}>
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
        <Image source={require('../imagenes/fondoperfil.jpg')} style={styles.logo} />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Mi Perfil</Text>
            {renderOption('user', 'Mi Información', goToMiInformacion, 'miInformacion')}
            {renderOption('paw', 'Mis Mascotas', goToMisMascotas, 'misMascotas')}
            {renderOption('shopping-cart', 'Mis Pedidos', goToMisPedidos, 'misPedidos')}
            {renderOption('ticket-alt', 'Cupones', goToCupones, 'verCupones')}
            {renderOption('bell', 'Notificaciones', goToNotificaciones, 'notificaciones')}
            {renderOption('file-alt', 'Políticas', goToPoliticas, 'politicas')}
            {renderOption('star', 'Calificanos', goToCalificar, 'calificacion')}
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
