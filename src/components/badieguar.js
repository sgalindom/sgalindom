import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ImageBackground, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment-timezone';

const Badiegard = () => {
  const navigation = useNavigation();
  const fondoVeterinariasImage = require('./imagenes/fondoveterinarias.jpg');

  const [veterinarias, setVeterinarias] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBarrio, setSelectedBarrio] = useState(null);
  const [barriosUnicos, setBarriosUnicos] = useState([]);

  useEffect(() => {
    const obtenerVeterinarias = async () => {
      try {
        let query = firestore().collection('Guarderiasyadiestramiento');

        
        if (selectedBarrio) {
          query = query.where('Barrio', '==', selectedBarrio);
        }

        const snapshot = await query.get();

        if (!snapshot.empty) {
          const datosVeterinarias = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          console.log('Datos de las veterinarias:', datosVeterinarias);
          setVeterinarias(datosVeterinarias);

        
          const uniqueBarrios = new Set(datosVeterinarias.map(veterinaria => veterinaria.Barrio));
          setBarriosUnicos(Array.from(uniqueBarrios));
        } else {
          console.log(`No se encontraron veterinarias${selectedBarrio ? ` en el barrio: ${selectedBarrio}` : ''}`);
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    obtenerVeterinarias();
  }, [selectedBarrio]);

  const handleExplorarPress = (veterinariaId) => {
    navigation.navigate(`Adieguar${veterinariaId}`);
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
              {barriosUnicos.map((barrio, index) => (
                <Pressable
                  key={index}
                  style={styles.modalButton}
                  onPress={() => handleBarrioSelect(barrio)}
                >
                  <Text style={styles.modalButtonText}>{barrio}</Text>
                </Pressable>
              ))}
              <Pressable style={styles.modalCloseButton} onPress={closeModal}>
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Text style={styles.title}>Explorar Veterinarias:</Text>
        <TouchableOpacity style={styles.filterButton} onPress={openModal}>
          <Text style={styles.filterButtonText}>Filtrar por Barrio</Text>
        </TouchableOpacity>
        {selectedBarrio && (
          <TouchableOpacity style={styles.removeFilterButton} onPress={handleRemoveFilter}>
            <Text style={styles.removeFilterButtonText}>Eliminar Filtro</Text>
          </TouchableOpacity>
        )}

        {veterinarias.map((veterinaria, index) => (
          <TouchableOpacity
            key={index}
            style={styles.servicioCard}
            onPress={() => handleExplorarPress(veterinaria.id)}
          >
            <View style={styles.imageContainer}>
              {veterinaria.Foto && <Image source={{ uri: veterinaria.Foto }} style={styles.servicioImage} />}
            </View>
            <Text style={styles.servicioTitle}>{veterinaria.Nombre}</Text>
            <Text style={styles.servicioDescription}>{veterinaria.Barrio}</Text>
            <Text style={styles.servicioDescription}>{veterinaria.Direccion}</Text>
            <Text style={styles.servicioDescription}>{veterinaria.Descripcion}</Text>
            <Text style={[styles.servicioDescription, isAbierto(veterinaria.Horario) ? styles.abiertoText : styles.cerradoText]}>
              {isAbierto(veterinaria.Horario) ? 'Abierto' : 'Cerrado'}
            </Text>
            <TouchableOpacity style={styles.explorarButtonStyle} onPress={() => handleExplorarPress(veterinaria.id)}>
              <Text style={styles.explorarButtonText}>Explorar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: 'white',
  },
  filterButton: {
    backgroundColor: '#2AC9FA',
    padding: 10,
    borderRadius: 4,
    marginVertical: 8,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  servicioCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    overflow: 'hidden',
    margin: 8,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    overflow: 'hidden',
  },
  servicioImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  servicioTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    marginLeft: 8,
    marginRight: 8,
    textAlign: 'center',
    color: 'black', // Letra en negro
  },
  servicioDescription: {
    fontSize: 16,
    marginVertical: 8,
    marginLeft: 8,
    marginRight: 8,
    color: 'black', // Letra en negro
  },
  abiertoText: {
    color: 'green',
  },
  cerradoText: {
    color: 'red',
  },
  explorarButtonStyle: {
    backgroundColor: '#2AC9FA',
    padding: 10,
    borderRadius: 4,
    width: '100%',
    marginTop: 8,
  },
  explorarButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#2AC9FA',
    padding: 10,
    borderRadius: 4,
    marginVertical: 8,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#FF5050',
    padding: 10,
    borderRadius: 4,
    marginVertical: 8,
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  removeFilterButton: {
    backgroundColor: '#FF5050',
    padding: 10,
    borderRadius: 4,
    marginVertical: 8,
  },
  removeFilterButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Badiegard;
