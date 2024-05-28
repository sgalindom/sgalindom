import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, TextInput, Button, Alert, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Comida = () => {
  const [loading, setLoading] = useState(true);
  const [comidaData, setComidaData] = useState(null);
  const [selectedComida, setSelectedComida] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedNombre, setEditedNombre] = useState('');
  const [editedDescripcion, setEditedDescripcion] = useState('');
  const [editedPrecio, setEditedPrecio] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    const fetchComidaData = async () => {
      try {
        const comidaRef = await firestore()
          .collection('Veterinarias')
          .doc('1')
          .collection('Comida')
          .get();
        const comida = comidaRef.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComidaData(comida);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos de comida:', error);
        setLoading(false);
      }
    };

    fetchComidaData();
  }, []);

  const handleEditComida = (comida) => {
    setSelectedComida(comida);
    setEditedNombre(comida.Nombre);
    setEditedDescripcion(comida.Descripcion);
    setEditedPrecio(comida.Precio);
    setModalVisible(true);
  };

  const handleDeleteComida = async () => {
    try {
      await firestore()
        .collection('Veterinarias')
        .doc('1')
        .collection('Comida')
        .doc(selectedComida.id)
        .delete();
      setDeleteModalVisible(false);
      // Actualizar la lista de comida después de eliminar
      setComidaData(prevComida =>
        prevComida.filter(comida => comida.id !== selectedComida.id)
      );
      Alert.alert('Eliminación exitosa', 'El producto ha sido eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar comida:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar el producto. Por favor, intenta de nuevo.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      await firestore()
        .collection('Veterinarias')
        .doc('1')
        .collection('Comida')
        .doc(selectedComida.id)
        .update({
          Nombre: editedNombre,
          Descripcion: editedDescripcion,
          Precio: editedPrecio,
        });
      setModalVisible(false);
      // Actualizar la lista de comida después de editar
      setComidaData(prevComida =>
        prevComida.map(comida =>
          comida.id === selectedComida.id ? { ...comida, Nombre: editedNombre, Descripcion: editedDescripcion, Precio: editedPrecio } : comida
        )
      );
      Alert.alert('Edición exitosa', 'Los cambios se han guardado correctamente.');
    } catch (error) {
      console.error('Error al editar comida:', error);
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
        {comidaData && comidaData.length > 0 ? (
          comidaData.map(comida => (
            <View key={comida.id} style={styles.card}>
              <Text style={styles.title}>Comida</Text>
              <Text style={styles.comidaText}>Nombre: {comida.Nombre}</Text>
              <Text style={styles.comidaText}>Descripción: {comida.Descripcion}</Text>
              <Text style={styles.comidaText}>Precio: {comida.Precio}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditComida(comida)}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => {setSelectedComida(comida); setDeleteModalVisible(true);}}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.errorText}>No se encontraron datos de comida.</Text>
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
              <Text style={styles.modalTitle}>Editar Comida</Text>
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
              <Text style={styles.confirmationText}>¿Estás seguro de que deseas eliminar este producto?</Text>
              <View style={styles.modalButtons}>
                <Button title="Eliminar" color="#FF0000" onPress={handleDeleteComida} />
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
    color: '#000000', // Color del texto del título
  },
  comidaText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000000', // Color del texto de la comida
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
    color: '#FF0000', // Color del texto de error
  },
  // Estilos del modal
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
    color: '#000000', // Color del texto del título del modal
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#000000', // Color del texto de confirmación del modal
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

export default Comida;
