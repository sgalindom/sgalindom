import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, TextInput, Button, Alert, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Productos = () => {
  const [loading, setLoading] = useState(true);
  const [productosData, setProductosData] = useState(null);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedNombre, setEditedNombre] = useState('');
  const [editedDescripcion, setEditedDescripcion] = useState('');
  const [editedPrecio, setEditedPrecio] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    const fetchProductosData = async () => {
      try {
        const productosRef = await firestore()
          .collection('Veterinarias')
          .doc('1')
          .collection('Productos')
          .get();
        const productos = productosRef.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductosData(productos);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos de productos:', error);
        setLoading(false);
      }
    };

    fetchProductosData();
  }, []);

  const handleEditProducto = (producto) => {
    setSelectedProducto(producto);
    setEditedNombre(producto.Nombre);
    setEditedDescripcion(producto.Descripcion);
    setEditedPrecio(producto.Precio);
    setModalVisible(true);
  };

  const handleDeleteProducto = async () => {
    try {
      await firestore()
        .collection('Veterinarias')
        .doc('1')
        .collection('Productos')
        .doc(selectedProducto.id)
        .delete();
      setDeleteModalVisible(false);
      // Actualizar la lista de productos después de eliminar
      setProductosData(prevProductos =>
        prevProductos.filter(producto => producto.id !== selectedProducto.id)
      );
      Alert.alert('Eliminación exitosa', 'El producto ha sido eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar el producto. Por favor, intenta de nuevo.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      await firestore()
        .collection('Veterinarias')
        .doc('1')
        .collection('Productos')
        .doc(selectedProducto.id)
        .update({
          Nombre: editedNombre,
          Descripcion: editedDescripcion,
          Precio: editedPrecio,
        });
      setModalVisible(false);
      // Actualizar la lista de productos después de editar
      setProductosData(prevProductos =>
        prevProductos.map(producto =>
          producto.id === selectedProducto.id ? { ...producto, Nombre: editedNombre, Descripcion: editedDescripcion, Precio: editedPrecio } : producto
        )
      );
      Alert.alert('Edición exitosa', 'Los cambios se han guardado correctamente.');
    } catch (error) {
      console.error('Error al editar producto:', error);
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
    <ImageBackground source={require('../imagenes/fondoadminpanel.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {productosData && productosData.length > 0 ? (
          productosData.map(producto => (
            <View key={producto.id} style={styles.card}>
              <Text style={styles.title}>Producto</Text>
              <Text style={styles.productoText}>Nombre: {producto.Nombre}</Text>
              <Text style={styles.productoText}>Descripción: {producto.Descripcion}</Text>
              <Text style={styles.productoText}>Precio: {producto.Precio}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditProducto(producto)}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => {setSelectedProducto(producto); setDeleteModalVisible(true);}}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.errorText}>No se encontraron datos de productos.</Text>
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
              <Text style={styles.modalTitle}>Editar Producto</Text>
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
                <Button title="Eliminar" color="#FF0000" onPress={handleDeleteProducto} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo semitransparente blanco
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Color de la letra
  },
  productoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555', // Color de la letra
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
    color: '#FF0000', // Color de la letra
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
    color: '#333', // Color de la letra
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#555', // Color de la letra
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

export default Productos;
