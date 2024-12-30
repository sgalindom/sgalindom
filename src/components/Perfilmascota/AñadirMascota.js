import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, ScrollView, Dimensions, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios'; // Usando axios para las solicitudes HTTP
import moment from 'moment'; // Importar moment

const AñadirMascota = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [raza, setRaza] = useState('');
  const [peso, setPeso] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoMascota, setTipoMascota] = useState('perro');
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [razasPerros, setRazasPerros] = useState([]);
  const [razasGatos, setRazasGatos] = useState([]);
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga

  const [successModalVisible, setSuccessModalVisible] = useState(false); // Estado para el modal de éxito
  const [errorModalVisible, setErrorModalVisible] = useState(false); // Estado para el modal de error
  const [errorMessage, setErrorMessage] = useState(''); // Mensaje de error
  const [emptyFieldsModalVisible, setEmptyFieldsModalVisible] = useState(false); // Estado para el modal de campos vacíos

  const user = auth().currentUser;
  const userEmail = user ? user.email : '';

  // Función para obtener razas de perros desde la API
  const fetchDogBreeds = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.thedogapi.com/v1/breeds');
      setRazasPerros(response.data.map((breed) => breed.name)); // Almacenar las razas
    } catch (error) {
      console.error('Error al obtener razas de perros:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener razas de gatos desde la API
  const fetchCatBreeds = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.thecatapi.com/v1/breeds');
      setRazasGatos(response.data.map((breed) => breed.name)); // Almacenar las razas
    } catch (error) {
      console.error('Error al obtener razas de gatos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Llamar las funciones de las APIs cuando se seleccione el tipo de mascota
  useEffect(() => {
    if (tipoMascota === 'perro') {
      fetchDogBreeds();
    } else {
      fetchCatBreeds();
    }
  }, [tipoMascota]);

  // Validar el nombre de la mascota para no permitir números ni caracteres especiales
  const handleNombreChange = (text) => {
    const validName = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); // Solo permite letras y espacios
    setNombre(validName);
  };

  // Validar el peso de la mascota para permitir solo números y punto decimal
  const handlePesoChange = (text) => {
    const validPeso = text.replace(/[^0-9.]/g, ''); // Solo permite números y punto decimal
    setPeso(validPeso);
  };

  const registrarMascota = async () => {
    if (!userEmail || !nombre || !raza || !fechaNacimiento || !peso) {
      setEmptyFieldsModalVisible(true);
      return;
    }

    const mascotasRef = firestore().collection(`usuarios/${userEmail}/mascotas`);

    try {
      const ultimaMascota = await mascotasRef.orderBy('id', 'desc').limit(1).get();
      const ultimoID = ultimaMascota.docs.length > 0 ? ultimaMascota.docs[0].data().id : 0;
      const nuevoID = ultimoID + 1;

      const edad = moment().diff(fechaNacimiento, 'years'); // Calcular la edad en años

      const nuevaMascota = {
        id: nuevoID,
        nombre,
        raza,
        fechaNacimiento,
        peso,
        descripcion,
        tipo: tipoMascota,
        edad, // Almacenar la edad en Firebase
      };

      await mascotasRef.doc(nuevoID.toString()).set(nuevaMascota);
      setSuccessModalVisible(true); // Mostrar modal de éxito
    } catch (error) {
      console.error('Error al registrar la mascota:', error);
      setErrorMessage(error.message);
      setErrorModalVisible(true); // Mostrar modal de error
    }
  };

  return (
    <ImageBackground source={require('../imagenes/fondomain.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Conozcamos a tu mascota</Text>

          <View style={styles.inputContainer}>
            <Icon name="paw" size={20} color="#FF6F61" style={styles.icon} />
            <Picker
              selectedValue={tipoMascota}
              onValueChange={(itemValue) => {
                setTipoMascota(itemValue);
                setRaza(''); // Reinicia la raza cuando cambia el tipo de mascota
              }}
              style={styles.input}
            >
              <Picker.Item label="Perro" value="perro" />
              <Picker.Item label="Gato" value="gato" />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="#FF6F61" style={styles.icon} />
            <TextInput
              placeholder="Nombre de la mascota"
              value={nombre}
              onChangeText={handleNombreChange}
              style={styles.input}
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="book" size={20} color="#FF6F61" style={styles.icon} />
            <Picker
              selectedValue={raza}
              onValueChange={(itemValue) => setRaza(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="Seleccionar raza" value="" />
              {loading ? (
                <Picker.Item label="Cargando razas..." value="" />
              ) : (
                (tipoMascota === 'perro' ? razasPerros : razasGatos).map((raza) => (
                  <Picker.Item key={raza} label={raza} value={raza} />
                ))
              )}
              <Picker.Item label="Otra / Criollo" value="Otra" />
            </Picker>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha de nacimiento de la mascota</Text>
            <View style={styles.inputContainer}>
              <Icon name="calendar" size={20} color="#007BFF" style={styles.icon} />
              <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
                <TextInput
                  style={styles.input}
                  placeholder="Seleccionar fecha de nacimiento"
                  value={fechaNacimiento ? moment(fechaNacimiento).format('DD/MM/YYYY') : ''}
                  editable={false}
                  placeholderTextColor="#888"
                />
              </TouchableOpacity>
            </View>
          </View>

          <DatePicker
            modal
            open={openDatePicker}
            date={fechaNacimiento}
            mode="date"
            onConfirm={(date) => {
              setOpenDatePicker(false);
              setFechaNacimiento(date);
            }}
            onCancel={() => {
              setOpenDatePicker(false);
            }}
          />

          <View style={styles.inputContainer}>
            <Icon name="balance-scale" size={20} color="#FF6F61" style={styles.icon} />
            <TextInput
              placeholder="Peso de la mascota (Kg)"
              value={peso}
              onChangeText={handlePesoChange}
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="comment" size={20} color="#FF6F61" style={styles.icon} />
            <TextInput
              placeholder="Cuéntanos más sobre tu mascota"
              value={descripcion}
              onChangeText={setDescripcion}
              style={[styles.input, { height: 80 }]}
              multiline
              numberOfLines={4}
              placeholderTextColor="#888"
            />
          </View>

          <TouchableOpacity style={styles.gradientButton} onPress={registrarMascota}>
            <Text style={styles.buttonText}>Registrar Mascota</Text>
          </TouchableOpacity>
        </View>

        {/* Modal de éxito */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={successModalVisible}
          onRequestClose={() => {
            setSuccessModalVisible(false);
            navigation.navigate('MisMascotas');
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Icon name="check-circle" size={60} color="green" />
              <Text style={styles.modalText}>Mascota registrada exitosamente</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setSuccessModalVisible(false);
                  navigation.navigate('MisMascotas');
                }}
              >
                <Text style={styles.modalButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de error */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={errorModalVisible}
          onRequestClose={() => {
            setErrorModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Icon name="times-circle" size={60} color="red" />
              <Text style={styles.modalText}>Error al registrar la mascota</Text>
              <Text style={styles.modalText}>{errorMessage}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setErrorModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de campos vacíos */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={emptyFieldsModalVisible}
          onRequestClose={() => {
            setEmptyFieldsModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Icon name="times-circle" size={60} color="red" />
              <Text style={styles.modalText}>Por favor, completa todos los campos</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setEmptyFieldsModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: windowWidth,
    height: windowHeight,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 25,
    borderRadius: 15,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#007BFF',
    textAlign: 'center',
    textShadowColor: '#87CEFA',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#87CEEB',
    borderRadius: 10,
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    marginLeft: 10,
  },
  icon: {
    marginLeft: 5,
    color: '#007BFF',
  },
  gradientButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#007BFF',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 5,
    textAlign: 'left',
  },
  
  
});



export default AñadirMascota;
