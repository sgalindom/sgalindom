import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ImageBackground, Image } from 'react-native';
import PushNotification from 'react-native-push-notification';

// Importa la imagen de fondo
import FondoImage from '../imagenes/fondomain.jpg';
// Importa el logo
import LogoImage from '../imagenes/logo_2.png';

const Notificaciones = () => {
  const [notificacionesActivas, setNotificacionesActivas] = useState(false);

  const toggleSwitch = () => {
    setNotificacionesActivas(prevState => !prevState);

    try {
      if (!notificacionesActivas) {
        // Código para activar las notificaciones
        PushNotification.presentLocalNotification({
          title: 'Notificaciones Activadas',
          message: 'Ahora recibirás notificaciones de la aplicación.',
        });
      } else {
        // Código para desactivar las notificaciones
        PushNotification.presentLocalNotification({
          title: 'Notificaciones Desactivadas',
          message: 'Ya no recibirás notificaciones de la aplicación.',
        });
      }
    } catch (error) {
      console.error('Error al manejar notificaciones:', error);
    }
  };

  return (
    // Utiliza ImageBackground para agregar una imagen de fondo
    <ImageBackground source={FondoImage} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.container}>
        {/* Agrega el logo en la parte superior central */}
        <Image source={LogoImage} style={styles.logo} />

        <Text style={styles.title}>Configuración de Notificaciones</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Activar Notificaciones</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notificacionesActivas ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={notificacionesActivas}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24, // Aumenta el tamaño de la fuente
    fontWeight: 'bold',
    marginBottom: 10, // Reduce el espacio inferior
    color: 'black',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 18, // Aumenta el tamaño de la fuente
    color: 'black',
    fontWeight: 'bold',
  },
  // Agrega un estilo para la imagen de fondo
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Agrega estilos para el logo
  logo: {
    width: 200, // Aumenta el tamaño del logo
    height: 200, // Aumenta el tamaño del logo
    resizeMode: 'contain',
    position: 'absolute',
    top: 0, // Ajusta según tu preferencia
  },
});

export default Notificaciones;
