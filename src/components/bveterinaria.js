import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ImageBackground, Modal, Pressable } from 'react-native';
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

  useEffect(() => {
    const obtenerVeterinarias = async () => {
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
    };

    obtenerVeterinarias();
  }, [selectedBarrio]);

  const handleExplorarPress = (veterinariaId) => {
    navigation.navigate(`vet${veterinariaId}`);
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
                <Icon name="location" size={20} color="#ffffff" style={styles.icon} />
                <Text style={styles.modalButtonText}>{barrio}</Text>
              </Pressable>
            ))}
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

        {veterinarias.map((veterinaria, index) => (
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
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.
    },
    imageContainer: {
      width: 130,
      height: 100,
      borderRadius: 8,
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
    },
    servicioTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
      color: 'black',
    },
    servicioDescription: {
      fontSize: 16,
      color: 'black',
    },
    abiertoText: {
      color: 'green',
      marginTop: 5,
    },
    cerradoText: {
      color: 'red',
      marginTop: 5,
    },
    explorarButtonStyle: {
      flexDirection: 'row',
      backgroundColor: '#2AC9FA',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 4,
      marginTop: 10,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    explorarButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
      marginLeft: 5, // Añadido para separación entre el icono y el texto
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
      width: '80%',
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
    modalButton: {
      backgroundColor: '#2AC9FA',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 6,
      marginBottom: 10,
      alignItems: 'center',
    },
    modalButtonText: {
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
    },
    modalCloseButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
    },
  });
  
  export default VeterinariaScreen;
