import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImageCropPicker from 'react-native-image-crop-picker';

const MiInformacion = () => {
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [editableData, setEditableData] = useState({
    direccion: '',
    telefono: '',
  });
  const [editingField, setEditingField] = useState(null);
  const [editAddressModalVisible, setEditAddressModalVisible] = useState(false);
  const [newDireccion, setNewDireccion] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userEmail = user.email;
          setUserEmail(userEmail);

          const userDocs = await firestore()
            .collection('usuarios')
            .doc(userEmail)
            .collection('datos')
            .get();

          if (!userDocs.empty) {
            const docId = userDocs.docs[0].id;
            const userDoc = await firestore()
              .collection('usuarios')
              .doc(userEmail)
              .collection('datos')
              .doc(docId)
              .get();

            if (userDoc.exists) {
              const userData = userDoc.data();
              setUserData(userData);
              if (userData.perfilImagen) {
                setProfileImage(userData.perfilImagen);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario', error);
      }
    };

    fetchUserData();
  }, []);

  const takePhoto = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        cropping: true,
        width: 300,
        height: 300,
        mediaType: 'photo',
      });
      if (!image) return;
      uploadImage(image.path);
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
      if (!image) return;
      uploadImage(image.path);
    } catch (error) {
      console.error('Error al seleccionar la imagen: ', error);
    }
  };

  const removePhoto = async () => {
    try {
      const user = auth().currentUser;
      const userEmail = user.email;
      const userDocs = await firestore()
        .collection('usuarios')
        .doc(userEmail)
        .collection('datos')
        .get();

      if (!userDocs.empty) {
        const docId = userDocs.docs[0].id;
        await firestore()
          .collection('usuarios')
          .doc(userEmail)
          .collection('datos')
          .doc(docId)
          .set({ perfilImagen: null }, { merge: true });
        setProfileImage(null);
        setModalVisible(false);
      } else {
        console.log('No se encontraron documentos en la colección "datos".');
      }
    } catch (error) {
      console.error('Error al eliminar la imagen de perfil: ', error);
    }
  };

  const uploadImage = async (imagePath) => {
    const user = auth().currentUser;
    const userEmail = user.email;
    try {
      const storageRef = storage().ref(`perfil/${userEmail}/profileImage.jpg`);
      await storageRef.putFile(imagePath);
      const url = await storageRef.getDownloadURL();

      const userDocs = await firestore()
        .collection('usuarios')
        .doc(userEmail)
        .collection('datos')
        .get();

      if (!userDocs.empty) {
        const docId = userDocs.docs[0].id;
        await firestore()
          .collection('usuarios')
          .doc(userEmail)
          .collection('datos')
          .doc(docId)
          .set({ perfilImagen: url }, { merge: true });
        setProfileImage(url);
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error al subir la imagen a Firebase Storage: ', error);
    }
  };

  const handleEdit = (field) => {
    setEditingField(field);
    setEditableData({
      direccion: userData.direccion,
      telefono: userData.telefono,
    });
  };

  const handleSave = async () => {
    const user = auth().currentUser;
    const userEmail = user.email;
    try {
      const userDocs = await firestore()
        .collection('usuarios')
        .doc(userEmail)
        .collection('datos')
        .get();

      if (!userDocs.empty) {
        const docId = userDocs.docs[0].id;
        await firestore()
          .collection('usuarios')
          .doc(userEmail)
          .collection('datos')
          .doc(docId)
          .set({
            direccion: editableData.direccion,
          }, { merge: true });
        setUserData({ ...userData, direccion: editableData.direccion });
        setEditingField(null);
      }
    } catch (error) {
      console.error('Error al guardar los cambios: ', error);
    }
  };

  const handleSaveAddress = async () => {
    const user = auth().currentUser;
    const userEmail = user.email;
    try {
      const userDocs = await firestore()
        .collection('usuarios')
        .doc(userEmail)
        .collection('datos')
        .get();

      if (!userDocs.empty) {
        const docId = userDocs.docs[0].id;
        await firestore()
          .collection('usuarios')
          .doc(userEmail)
          .collection('datos')
          .doc(docId)
          .set({ direccion: newDireccion }, { merge: true });
        setUserData({ ...userData, direccion: newDireccion });
        setEditAddressModalVisible(false);
      }
    } catch (error) {
      console.error('Error al actualizar la dirección: ', error);
    }
  };

  return (
    <ImageBackground source={require('../imagenes/fondomain.jpg')} style={styles.backgroundImage}>
      <View style={styles.centeredContainer}>
        <View style={styles.cardWrapper}>
          <View style={styles.profileSection}>
            <View style={styles.imageContainer}>
              <TouchableOpacity style={styles.profileImageContainer}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Icon name="user-circle" size={100} color="#888" />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraIconContainer} onPress={() => setModalVisible(true)}>
                <Icon name="camera" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.emailText}>{userEmail}</Text>
          </View>

          <View style={styles.cardSection}>
            {userData ? (
              <>
                <View style={styles.card}>
                  <Icon name="user" size={24} color="#3498db" style={styles.cardIcon} />
                  <Text style={styles.cardText}>Nombre: {userData.nombreCompleto}</Text>
                </View>
                <View style={styles.card}>
                  <Icon name="birthday-cake" size={24} color="#3498db" style={styles.cardIcon} />
                  <Text style={styles.cardText}>
                    Fecha de Nacimiento:
                    {userData.fechaNacimiento && userData.fechaNacimiento.seconds
                      ? new Date(userData.fechaNacimiento.seconds * 1000).toLocaleDateString()
                      : 'No disponible'}
                  </Text>
                </View>
                <View style={styles.card}>
                  <Icon name="home" size={24} color="#3498db" style={styles.cardIcon} />
                  <Text style={styles.cardText}>
                    Dirección:
                    {editingField === 'direccion' ?
                      <TextInput
                        style={styles.inputField}
                        value={editableData.direccion}
                        onChangeText={(text) => setEditableData({ ...editableData, direccion: text })}
                      />
                      : userData.direccion
                    }
                  </Text>
                  {editingField !== 'direccion' && (
                    <TouchableOpacity onPress={() => setEditAddressModalVisible(true)}>
                      <Icon name="edit" size={18} color="#3498db" style={styles.editIcon} />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.card}>
                  <Icon name="phone" size={24} color="#3498db" style={styles.cardIcon} />
                  <Text style={styles.cardText}>Teléfono: {userData.telefono}</Text>
                </View>
                <View style={styles.card}> 
                  <Icon name="map-marker-alt" size={24} color="#3498db" style={styles.cardIcon} />
                  <Text style={styles.cardText}>Ciudad: {userData.ciudad}</Text>
                </View>

                {editingField && (
                  <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Text style={styles.infoText}>Cargando...</Text>
            )}
          </View>
        </View>

        {/* Modal para editar la dirección */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={editAddressModalVisible}
          onRequestClose={() => setEditAddressModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.inputField}
                value={newDireccion}
                onChangeText={setNewDireccion}
                placeholder="Ingrese nueva dirección"
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
                <Text style={styles.saveButtonText}>Guardar Dirección</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setEditAddressModalVisible(false)}>
                <Text style={styles.saveButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal con iconos */}
        <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Tomar Foto */}
              <TouchableOpacity style={styles.modalItem} onPress={takePhoto}>
                <Icon name="camera" size={24} color="#3498db" style={styles.modalIcon} />
                <Text style={styles.modalItemText}>Tomar Foto</Text>
              </TouchableOpacity>

              {/* Seleccionar de la Galería */}
              <TouchableOpacity style={styles.modalItem} onPress={pickImage}>
                <Icon name="image" size={24} color="#3498db" style={styles.modalIcon} />
                <Text style={styles.modalItemText}>Seleccionar de la Galería</Text>
              </TouchableOpacity>

              {/* Quitar Foto */}
              <TouchableOpacity style={[styles.modalItem, styles.modalRemove]} onPress={removePhoto}>
                <Icon name="trash-alt" size={24} color="#e74c3c" style={styles.modalIcon} />
                <Text style={[styles.modalItemText, { color: '#e74c3c' }]}>Eliminar Foto</Text>
              </TouchableOpacity>

              {/* Cancelar */}
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.saveButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#3498db',
    padding: 5,
    borderRadius: 20,
  },
  emailText: {
    fontSize: 16,
    color: 'black',
  },
  cardSection: {
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cardIcon: {
    marginRight: 10,
  },
  cardText: {
    fontSize: 16,
    color: 'black',
  },
  saveButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalIcon: {
    marginRight: 10,
  },
  modalItemText: {
    fontSize: 16,
  },
  modalRemove: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  modalCancelButton: {
    marginTop: 20,
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  inputField: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  infoText: {
    fontSize: 18,
    color: '#aaa',
  },
  editIcon: {
    marginLeft: 10,
  },
});

export default MiInformacion;