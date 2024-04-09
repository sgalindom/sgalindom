import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Paneladmin = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  const handleOrdersClick = () => {
    navigation.navigate('pepetshop');
  };

  const handleDeliveredClick = () => {
    navigation.navigate('despapetshop');
  };

  const handleAppointmentsBathClick = () => {
    navigation.navigate('citasbaños');
  };

  const handleAppointmentsBathAttendedClick = () => {
    navigation.navigate('citasbañoatendidas');
  };

  const handleAppointmentsDoctorClick = () => {
    navigation.navigate('citasdr');
  };

  const handleAppointmentsDrAttendedClick = () => {
    navigation.navigate('citasdratendidas');
  };

  const handleCuponesQRClick = () => {
    navigation.navigate('CuponesQR');
  };

  const handleProductosTiendaClick = () => {
    navigation.navigate('productostiendaañadir');
  };

  const handleMisProductosClick = () => {
    navigation.navigate('misproductos');
  };

  return (
    <ImageBackground source={require('../imagenes/fondoadminpanel.jpg')} style={styles.container} imageStyle={{ opacity: 1 }}>
      <Text style={styles.title}>Panel de Administrador</Text>

      <TouchableOpacity style={styles.card} onPress={handleOrdersClick}>
        <Text style={styles.cardText}>Pedidos Pet Shop</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handleDeliveredClick}>
        <Text style={styles.cardText}>Pedidos Despachados</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handleAppointmentsBathClick}>
        <Text style={styles.cardText}>Citas Baño</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handleAppointmentsBathAttendedClick}>
        <Text style={styles.cardText}>Citas Baño Atendidas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handleAppointmentsDoctorClick}>
        <Text style={styles.cardText}>Citas Dr</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handleAppointmentsDrAttendedClick}>
        <Text style={styles.cardText}>Citas Dr Atendidas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handleCuponesQRClick}>
        <Text style={styles.cardText}>Cupones QR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handleProductosTiendaClick}>
        <Text style={styles.cardText}>Añadir Productos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handleMisProductosClick}>
        <Text style={styles.cardText}>Mis Productos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#000', // Color negro
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', // Color negro
  },
  logoutButton: {
    backgroundColor: '#2F9FFA',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Paneladmin;
