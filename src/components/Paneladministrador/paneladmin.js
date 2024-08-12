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
        <View style={styles.cardsContainer}>
          {[
            { screen: 'pepetshop', icon: 'shopping-cart', label: 'Pedidos Pet Shop' },
            { screen: 'despapetshop', icon: 'truck', label: 'Pedidos Despachados' },
            { screen: 'citasbaños', icon: 'bathtub', label: 'Citas Baño' },
            { screen: 'citasbañoatendidas', icon: 'check-circle', label: 'Citas Baño Atendidas' },
            { screen: 'citasdr', icon: 'user-md', label: 'Citas Dr' },
            { screen: 'citasdratendidas', icon: 'check-circle', label: 'Citas Dr Atendidas' },
            { screen: 'proximamente', icon: 'qrcode', label: 'Cupones QR' },
            { screen: 'productostiendaañadir', icon: 'plus-square', label: 'Añadir Productos' },
            { screen: 'misproductos', icon: 'list-alt', label: 'Mis Productos' },
            { screen: 'solicitudpaseos', icon: 'paw', label: 'Paseos' }
          ].map(({ screen, icon, label }) => (
            <TouchableOpacity key={screen} style={styles.card} onPress={() => navigateTo(screen)}>
              <Icon name={icon} size={30} color="#ffffff" />
              <Text style={styles.cardText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#FFFFFF',
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  cardsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  logoutButton: {
    backgroundColor: '#FF4D4D',
    padding: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Paneladmin;
