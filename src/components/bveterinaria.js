import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ImageBackground, Modal, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment-timezone';
import Icon from 'react-native-vector-icons/Ionicons';

const VeterinariaScreen = () => {
  const navigation = useNavigation();
  const fondoVeterinariasImage = require('./imagenes/fondomain.jpg');

  const [veterinarias, setVeterinarias] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBarrio, setSelectedBarrio] = useState(null);
  const [barriosUnicos, setBarriosUnicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerVeterinarias = async () => {
      setLoading(true);
      try {
        let query = firestore().collection('Veterinarias');

        if (selectedBarrio) {
          query = query.where('Barrio', '==', selectedBarrio);
        }

        const snapshot = await query.get();

        if (!snapshot.empty) {
          const datosVeterinarias = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setVeterinarias(datosVeterinarias);

          const uniqueBarrios = new Set(datosVeterinarias.map(veterinaria => veterinaria.Barrio));
          setBarriosUnicos(Array.from(uniqueBarrios));
        } else {
          console.log(`No se encontraron veterinarias${selectedBarrio ? ` en el barrio: ${selectedBarrio}` : ''}`);
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
      setLoading(false);
    };

    obtenerVeterinarias();
  }, [selectedBarrio]);

  // Aseguramos que la primera veterinaria navegue a 'vet1.js'
  const handleExplorarPress = (veterinariaId) => {
    if (veterinariaId === veterinarias[0].id) {
      navigation.navigate('vet1'); // Navegar a la pantalla VET1.js para la primera veterinaria
    } else {
      navigation.navigate('verveterinarias', { veterinariaId });
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleBarrioSelect = (barrio) => {
    setSelectedBarrio(barrio);
    closeModal();
  };

  const handleRemoveFilter = () => {
    setSelectedBarrio(null);
  };

  const isAbierto = (horario) => {
    if (horario && horario.apertura && horario.cierre) {
      const now = moment();
      const horaActual = now.format('HH:mm');
      return horaActual >= horario.apertura && horaActual <= horario.cierre;
    } else {
      return false;
    }
  };

  const renderedVeterinarias = useMemo(() => {
    return veterinarias.map((veterinaria, index) => (
      <TouchableOpacity
        key={index}
        style={styles.servicioCard}
        onPress={() => handleExplorarPress(veterinaria.id)} // Navegación correcta para la primera veterinaria
      >
        <View style={styles.imageContainer}>
          {veterinaria.Foto && <Image source={{ uri: veterinaria.Foto }} style={styles.servicioImage} />}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.servicioTitle}>{veterinaria.Nombre}</Text>
          <Text style={styles.servicioDescription}>{veterinaria.Barrio}</Text>
          <Text style={styles.servicioDescription}>{veterinaria.Direccion}</Text>
          <Text style={[styles.servicioDescription, isAbierto(veterinaria.Horario) ? styles.abiertoText : styles.cerradoText]}>
            {isAbierto(veterinaria.Horario) ? 'Abierto' : 'Cerrado'}
          </Text>
          <TouchableOpacity style={styles.explorarButtonStyle} onPress={() => handleExplorarPress(veterinaria.id)}>
            <Icon name="search" size={20} color="white" />
            <Text style={styles.explorarButtonText}>Explorar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    ));
  }, [veterinarias]);

  return (
    <ImageBackground source={fondoVeterinariasImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecciona un Barrio</Text>
              <ScrollView contentContainerStyle={styles.barriosContainer}>
                {barriosUnicos.map((barrio, index) => (
                  <Pressable
                    key={index}
                    style={styles.barrioButton}
                    onPress={() => handleBarrioSelect(barrio)}
                  >
                    <Icon name="location" size={20} color="#ffffff" style={styles.icon} />
                    <Text style={styles.barrioButtonText}>{barrio}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Pressable style={styles.modalCloseButton} onPress={closeModal}>
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Veterinarias</Text>
          <TouchableOpacity style={styles.filterButton} onPress={openModal}>
            <Icon name="filter" size={20} color="white" />
          </TouchableOpacity>
          {selectedBarrio && (
            <TouchableOpacity style={styles.removeFilterButton} onPress={handleRemoveFilter}>
              <Text style={styles.removeFilterButtonText}>Eliminar Filtro</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#00A7E1" />
        ) : (
          renderedVeterinarias
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
    width: '90%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E1E2D',
  },
  filterButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  removeFilterButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeFilterButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  servicioCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 10,
  },
  servicioImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  servicioTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E2D',
    marginBottom: 5,
  },
  servicioDescription: {
    fontSize: 16,
    color: '#707070',
    marginBottom: 5,
  },
  abiertoText: {
    color: '#34C759',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cerradoText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: 'bold',
  },
  explorarButtonStyle: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  explorarButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1E1E2D',
  },
  barriosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  barrioButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  barrioButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default VeterinariaScreen;
