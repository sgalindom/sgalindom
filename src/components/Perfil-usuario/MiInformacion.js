import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImageCropPicker from 'react-native-image-crop-picker';

const MiInformacion = () => {
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userEmail = user.email;

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
            } else {
              console.log('No se encontró el documento con el ID:', docId);
            }
          } else {
            console.log('No se encontraron documentos en la colección "datos".');
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
      if (!image) {
        return;
      }
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
      if (!image) {
        return;
      }
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
      } else {
        console.log('No se encontraron documentos en la colección "datos".');
      }
    } catch (error) {
      console.error('Error al subir la imagen a Firebase Storage: ', error);
    }
  };

  return (
    <ImageBackground
      source={require('../imagenes/MiInformacion.jpg')}
      style={styles.container}
    >
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.profileImageContainer} onPress={() => setModalVisible(true)}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>+</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.userDataContainer}>
            {userData ? (
              <View>
                <Text style={styles.title}>Mi Información</Text>
                <Text style={styles.userInfo}><Text style={styles.bold}>Nombre Completo:</Text> {userData.nombreCompleto}</Text>
                <Text style={styles.userInfo}><Text style={styles.bold}>Edad:</Text> {userData.edad}</Text>
                <Text style={styles.userInfo}><Text style={styles.bold}>Dirección:</Text> {userData.direccion}</Text>
                <Text style={styles.userInfo}><Text style={styles.bold}>Teléfono:</Text> {userData.telefono}</Text>
                <Text style={styles.userInfo}><Text style={styles.bold}></Text> {userData.barrio}</Text>
              </View>
            ) : (
              <Text style={styles.infoText}>Cargando...</Text>
            )}
          </View>
        </ScrollView>
      </View>
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#fffFFF', // Color de fondo azul pastel
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingBottom: 20,
  },
  userDataContainer: {
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
  },
  userInfo: {
    fontSize: 18,
    marginVertical: 5,
    color: 'black',
  },
  bold: {
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  profileImageContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 150, // Aumentando el tamaño del círculo de la imagen de perfil
    height: 150, // Aumentando el tamaño del círculo de la imagen de perfil
    borderRadius: 75, // Aumentando el tamaño del círculo de la imagen de perfil
    marginVertical: 10,
  },
  profileImagePlaceholder: {
    width: 150, // Aumentando el tamaño del círculo de la imagen de perfil
    height: 150, // Aumentando el tamaño del círculo de la imagen de perfil
    borderRadius: 75, // Aumentando el tamaño del círculo de la imagen de perfil
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImageText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
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
    color: 'black', // Cambio del color del texto a negro
  },
});

export default MiInformacion;
