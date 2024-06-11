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

  const handleExplorarPress = (veterinariaId) => {
    navigation.navigate('verveterinarias', { veterinariaId });
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
        onPress={() => handleExplorarPress(veterinaria.id)}
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
              <Text style={styles.modalTitle}>Filtrar por Barrio</Text>
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
          <Text style={styles.title}>Filtrar por barrio</Text>
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
          <ActivityIndicator size="large" color="#2AC9FA" />
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 'auto',
  },
  filterButton: {
    backgroundColor: '#2AC9FA',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeFilterButton: {
    backgroundColor: '#FF5050',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeFilterButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  servicioCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 10,
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
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  servicioTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  servicioDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  abiertoText: {
    color: 'green',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cerradoText: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
  },
  explorarButtonStyle: {
    backgroundColor: '#2AC9FA',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  barriosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  barrioButton: {
    backgroundColor: '#2AC9FA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
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
    backgroundColor: '#FF5050',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
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
  