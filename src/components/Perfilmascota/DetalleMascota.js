import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';

const DetalleMascota = ({ route, navigation }) => {
  const { mascota } = route.params;

  const [isModalVisible, setModalVisible] = useState(false); // Estado para el modal

  const descripcionMascota = mascota.descripcion ? mascota.descripcion : 'Sin descripción';

  const eliminarMascota = async () => {
    try {
      const user = auth().currentUser;
      const userEmail = user ? user.email : '';
      
      const mascotasRef = firestore().collection(`usuarios/${userEmail}/mascotas`);
      
      await mascotasRef.doc(mascota.id.toString()).delete();
      
      Alert.alert('Mascota eliminada', 'La mascota ha sido eliminada correctamente.');
      
      navigation.navigate('MisMascotas');
    } catch (error) {
      console.error('Error al eliminar la mascota: ', error);
      Alert.alert('Error', 'Se produjo un error al intentar eliminar la mascota. Por favor, inténtalo nuevamente.');
    }
  };

  const fechaNacimiento = moment(mascota.fechaNacimiento.seconds * 1000).format('DD/MM/YYYY');
  const edad = mascota.edad || 0; // Asegúrate de manejar el caso donde la edad no esté definida

  const handleEliminarPress = () => {
    setModalVisible(true); // Mostrar modal cuando se presiona el botón de eliminar
  };

  const handleConfirmDelete = () => {
    setModalVisible(false);
    eliminarMascota(); // Ejecutar la eliminación cuando se confirme
  };

  return (
    <ImageBackground
      source={require('../imagenes/fondomain.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.detailContainer}>
          <Text style={styles.title}>{mascota.nombre}</Text>
          <View style={styles.detailItem}>
            <Icon name="paw" size={20} color="black" style={styles.icon} />
            <Text style={styles.detailText}>Raza: {mascota.raza}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={20} color="black" style={styles.icon} />
            <Text style={styles.detailText}>Fecha de Nacimiento: {fechaNacimiento}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={20} color="black" style={styles.icon} />
            <Text style={styles.detailText}>Edad: {edad} años</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="balance-scale" size={20} color="black" style={styles.icon} />
            <Text style={styles.detailText}>Peso: {mascota.peso} Kg</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="comment" size={20} color="black" style={styles.icon} />
            <Text style={styles.detailText}>Descripción: {descripcionMascota}</Text>
          </View>

          {/* Botón de eliminar mascota */}
          <TouchableOpacity style={styles.eliminarButton} onPress={handleEliminarPress}>
            <Text style={styles.eliminarButtonText}>Eliminar Perfil</Text>
          </TouchableOpacity>

          {/* Modal de confirmación */}
          <Modal
            transparent={true}
            visible={isModalVisible}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Icon name="exclamation-circle" size={60} color="#FF6347" />
                <Text style={styles.modalText}>¿Estás seguro de que deseas borrar el perfil?</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmDelete}>
                    <Text style={styles.confirmButtonText}>Sí, eliminar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  detailContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 15,
  },
  icon: {
    marginRight: 10,
    color: '#007BFF',
  },
  eliminarButton: {
    backgroundColor: '#007BFF',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 5,
  },
  eliminarButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#6c757d',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default DetalleMascota;
