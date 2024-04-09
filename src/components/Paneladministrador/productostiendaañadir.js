import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Modal, ImageBackground } from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const ProductosPanel = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [foto, setFoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoria, setCategoria] = useState('Accesorios');

  const takePhoto = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        cropping: true,
        width: 300,
        height: 300,
        mediaType: 'photo',
      });
      if (!image) {
        return;
      }
      setFoto(image.path);
      setModalVisible(false);
    } catch (error) {
      console.error('Error al tomar la foto: ', error);
    }
  };

  const pickImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        cropping: true,
        width: 300,
        height: 300,
        mediaType: 'photo',
      });
      if (!image) {
        return;
      }
      setFoto(image.path);
      setModalVisible(false);
    } catch (error) {
      console.error('Error al seleccionar la imagen: ', error);
    }
  };

  const removePhoto = () => {
    setFoto(null);
  };

  const handleAddProducto = async () => {
    try {
      const reference = storage().ref(`images/${Date.now()}`);
      await reference.putFile(foto);
      const fotoURL = await reference.getDownloadURL();

      await firestore().collection('Veterinarias').doc('1').collection(categoria).add({
        Nombre: nombre,
        Descripcion: descripcion,
        Precio: precio,
        Foto: fotoURL,
      });

      setNombre('');
      setDescripcion('');
      setPrecio('');
      setFoto(null);

      alert('Producto añadido exitosamente');
    } catch (error) {
      console.error('Error al añadir producto:', error);
      alert('Error al añadir producto. Por favor, intenta de nuevo.');
    }
  };

  return (
    <ImageBackground source={require('../imagenes/fondoadminpanel.jpg')} style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>AÑADIR PRODUCTOS</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>CATEGORIA</Text>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={() => setCategoria('Accesorios')} style={[styles.checkbox, { backgroundColor: categoria === 'Accesorios' ? '#2F9FFA' : '#000000' }]}>
              <Text style={[styles.checkboxText, { color: categoria === 'Accesorios' ? '#FFFFFF' : '#FFFFFF' }]}>Accesorios</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCategoria('Comida')} style={[styles.checkbox, { backgroundColor: categoria === 'Comida' ? '#2F9FFA' : '#000000' }]}>
              <Text style={[styles.checkboxText, { color: categoria === 'Comida' ? '#FFFFFF' : '#FFFFFF' }]}>Comida</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCategoria('Productos')} style={[styles.checkbox, { backgroundColor: categoria === 'Productos' ? '#2F9FFA' : '#000000' }]}>
              <Text style={[styles.checkboxText, { color: categoria === 'Productos' ? '#FFFFFF' : '#FFFFFF' }]}>Productos</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={text => setNombre(text)}
            placeholder="Nombre"
          />
          <TextInput
            style={styles.input}
            value={descripcion}
            onChangeText={text => setDescripcion(text)}
            placeholder="Descripción"
            multiline={true}
          />
          <TextInput
            style={styles.input}
            value={precio}
            onChangeText={text => setPrecio(text)}
            placeholder="Precio"
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.selectPhotoButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.selectPhotoButtonText}>Seleccionar foto</Text>
          </TouchableOpacity>

          {foto && <Image source={{ uri: foto }} style={styles.previewImage} />}

          <Button title="Añadir Producto" onPress={handleAddProducto} />

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.modalItem} onPress={takePhoto}>
                  <Text style={styles.modalItemText}>Tomar Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalItem} onPress={pickImage}>
                  <Text style={styles.modalItemText}>Seleccionar de la Galería</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalItem} onPress={removePhoto}>
                  <Text style={styles.modalItemText}>Quitar Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalItem} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalItemText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  selectPhotoButton: {
    backgroundColor: '#2F9FFA',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectPhotoButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
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
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  modalItemText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  checkbox: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  checkboxText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default ProductosPanel;
