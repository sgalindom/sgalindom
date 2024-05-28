import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, TextInput, Button, Alert, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Accesorios = () => {
  const [loading, setLoading] = useState(true);
  const [accesoriosData, setAccesoriosData] = useState(null);
  const [selectedAccesorio, setSelectedAccesorio] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editedNombre, setEditedNombre] = useState('');
  const [editedDescripcion, setEditedDescripcion] = useState('');
  const [editedPrecio, setEditedPrecio] = useState('');

  useEffect(() => {
    const fetchAccesoriosData = async () => {
      try {
        const accesoriosRef = await firestore()
          .collection('Veterinarias')
          .doc('1')
          .collection('Accesorios')
          .get();
        const accesorios = accesoriosRef.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAccesoriosData(accesorios);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos de accesorios:', error);
        setLoading(false);
      }
    };

    fetchAccesoriosData();
  }, []);

  const handleEditAccesorio = (accesorio) => {
    setSelectedAccesorio(accesorio);
    setEditedNombre(accesorio.Nombre);
    setEditedDescripcion(accesorio.Descripcion);
    setEditedPrecio(accesorio.Precio);
    setModalVisible(true);
  };

  const handleDeleteAccesorio = async () => {
    try {
      await firestore()
        .collection('Veterinarias')
        .doc('1')
        .collection('Accesorios')
        .doc(selectedAccesorio.id)
        .delete();
      setDeleteModalVisible(false);
      // Actualizar la lista de accesorios después de eliminar
      setAccesoriosData(prevAccesorios =>
        prevAccesorios.filter(accesorio => accesorio.id !== selectedAccesorio.id)
      );
      Alert.alert('Eliminación exitosa', 'El accesorio ha sido eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar accesorio:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar el accesorio. Por favor, intenta de nuevo.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      await firestore()
        .collection('Veterinarias')
        .doc('1')
        .collection('Accesorios')
        .doc(selectedAccesorio.id)
        .update({
          Nombre: editedNombre,
          Descripcion: editedDescripcion,
          Precio: editedPrecio,
        });
      setModalVisible(false);
      // Actualizar la lista de accesorios después de editar
      setAccesoriosData(prevAccesorios =>
        prevAccesorios.map(accesorio =>
          accesorio.id === selectedAccesorio.id ? { ...accesorio, Nombre: editedNombre, Descripcion: editedDescripcion, Precio: editedPrecio } : accesorio
        )
      );
      Alert.alert('Edición exitosa', 'Los cambios se han guardado correctamente.');
    } catch (error) {
      console.error('Error al editar accesorio:', error);
      Alert.alert('Error', 'Hubo un problema al guardar los cambios. Por favor, intenta de nuevo.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#2F9FFA" />
      </View>
    );
  }

  return (
    <ImageBackground source={require('../imagenes/fondomain.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {accesoriosData && accesoriosData.length > 0 ? (
          accesoriosData.map(accesorio => (
            <View key={accesorio.id} style={styles.card}>
              <Text style={styles.title}>Accesorio</Text>
              <Text style={styles.accesorioText}>Nombre: {accesorio.Nombre}</Text>
              <Text style={styles.accesorioText}>Descripción: {accesorio.Descripcion}</Text>
              <Text style={styles.accesorioText}>Precio: {accesorio.Precio}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditAccesorio(accesorio)}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => {setSelectedAccesorio(accesorio); setDeleteModalVisible(true);}}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.errorText}>No se encontraron datos de accesorios.</Text>
        )}

        {/* Modal de edición */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Accesorio</Text>
              <TextInput
                style={styles.input}
                value={editedNombre}
                onChangeText={text => setEditedNombre(text)}
                placeholder="Nombre"
              />
              <TextInput
                style={styles.input}
                value={editedDescripcion}
                onChangeText={text => setEditedDescripcion(text)}
                placeholder="Descripción"
              />
              <TextInput
                style={styles.input}
                value={editedPrecio}
                onChangeText={text => setEditedPrecio(text)}
                placeholder="Precio"
                keyboardType="numeric"
              />
              <View style={styles.modalButtons}>
                <Button title="Guardar Cambios" onPress={handleSaveChanges} />
                <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de confirmación de eliminación */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={deleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmar Eliminación</Text>
              <Text style={styles.confirmationText}>¿Estás seguro de que deseas eliminar este accesorio?</Text>
              <View style={styles.modalButtons}>
                <Button title="Eliminar" color="#FF0000" onPress={handleDeleteAccesorio} />
                <Button title="Cancelar" onPress={() => setDeleteModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white', 
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000', // Color negro
  },
  accesorioText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000', // Color negro
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#2F9FFA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000', // Color negro
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#000', // Color negro
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default Accesorios;
