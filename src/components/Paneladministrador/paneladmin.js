import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

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

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <ImageBackground source={require('../imagenes/fondomain.jpg')} style={styles.container}>
      <Text style={styles.title}>Panel de Administrador</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigateTo('pepetshop')}>
          <Icon name="shopping-cart" size={30} color="#2F9FFA" />
          <Text style={styles.cardText}>Pedidos Pet Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigateTo('despapetshop')}>
          <Icon name="truck" size={30} color="#2F9FFA" />
          <Text style={styles.cardText}>Pedidos Despachados</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigateTo('citasbaños')}>
          <Icon name="bathtub" size={30} color="#2F9FFA" />
          <Text style={styles.cardText}>Citas Baño</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigateTo('citasbañoatendidas')}>
          <Icon name="check-circle" size={30} color="#2F9FFA" />
          <Text style={styles.cardText}>Citas Baño Atendidas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigateTo('citasdr')}>
          <Icon name="user-md" size={30} color="#2F9FFA" />
          <Text style={styles.cardText}>Citas Dr</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigateTo('citasdratendidas')}>
          <Icon name="check-circle" size={30} color="#2F9FFA" />
          <Text style={styles.cardText}>Citas Dr Atendidas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigateTo('proximamente')}>
          <Icon name="qrcode" size={30} color="#2F9FFA" />
          <Text style={styles.cardText}>Cupones QR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigateTo('productostiendaañadir')}>
          <Icon name="plus-square" size={30} color="#2F9FFA" />
          <Text style={styles.cardText}>Añadir Productos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigateTo('misproductos')}>
          <Icon name="list-alt" size={30} color="#2F9FFA" />
          <Text style={styles.cardText}>Mis Productos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigateTo('solicitudpaseos')}>
          <Icon name="paw" size={30} color="#2F9FFA" />
          <Text style={styles.cardText}>Paseos</Text>
        </TouchableOpacity>
      </ScrollView>

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
    color: '#000',
  },
  scrollViewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 16,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2F9FFA',
    marginLeft: 20,
  },
  logoutButton: {
    backgroundColor: '#2F9FFA',
    padding: 12,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Paneladmin;
