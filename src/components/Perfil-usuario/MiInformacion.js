import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
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
                  <Text style={styles.cardText}>Edad: {userData.edad}</Text>
                </View>
                <View style={styles.card}>
                  <Icon name="home" size={24} color="#3498db" style={styles.cardIcon} />
                  <Text style={styles.cardText}>Dirección: {userData.direccion}</Text>
                </View>
                <View style={styles.card}>
                  <Icon name="phone" size={24} color="#3498db" style={styles.cardIcon} />
                  <Text style={styles.cardText}>Teléfono: {userData.telefono}</Text>
                </View>
              </>
            ) : (
              <Text style={styles.infoText}>Cargando...</Text>
            )}
          </View>
        </View>

        <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
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
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    width: '90%',
    marginBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    position: 'relative', // Necessary for absolute positioning of the camera icon
  },
  profileImageContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 100,
    padding: 5,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  profileImagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#3498db',
    borderRadius: 15,
    padding: 5,
    elevation: 5,
  },
  emailText: {
    fontSize: 18,
    color: '#3498db',
    fontWeight: 'bold',
  },
  cardSection: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  cardIcon: {
    marginRight: 20,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
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
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#3498db',
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    marginTop: 20,
  },
});

export default MiInformacion;
