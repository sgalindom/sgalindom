import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';

const logoImage = require('../imagenes/fondoperfil.jpg');
const backgroundImage = require('../imagenes/fondomain.jpg');

const Registro = ({ navigation }) => {
  // Definir estados iniciales
  const initialFormState = {
    email: '',
    password: '',
    confirmPassword: '',
    nombreCompleto: '',
    telefono: '',
    direccion: '',
    dateOfBirth: new Date(),
  };

  const [form, setForm] = useState(initialFormState);
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false); // Estado para diferenciar entre éxito o error
  const [openDatePicker, setOpenDatePicker] = useState(false); // Estado para controlar el modal del DatePicker

  // Restablecer el formulario cada vez que se monta el componente
  useEffect(() => {
    // Reiniciar los valores del formulario cuando el componente se monta
    setForm(initialFormState);
  }, []);

  // Función para manejar la entrada del nombre, permitiendo solo letras y espacios
  const handleNombreInput = (value) => {
    const formattedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); // Solo permite letras y espacios
    setForm({ ...form, nombreCompleto: formattedValue });
  };

  // Función para manejar la entrada del teléfono, permitiendo solo números y el símbolo "+"
  const handleTelefonoInput = (value) => {
    const formattedValue = value.replace(/[^0-9+]/g, ''); // Solo permite números y el símbolo "+"
    setForm({ ...form, telefono: formattedValue });
  };

  // Función para manejar la validación de la contraseña, eliminando espacios
  const handlePasswordInput = (value) => {
    const formattedValue = value.replace(/\s/g, ''); // Elimina todos los espacios
    setForm({ ...form, password: formattedValue });
  };

  const handleConfirmPasswordInput = (value) => {
    setForm({ ...form, confirmPassword: value });
  };

  const handleEmailInput = (value) => {
    setForm({ ...form, email: value });
  };

  const handleDireccionInput = (value) => {
    setForm({ ...form, direccion: value });
  };

  const handlePasswordValidation = () => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/;
    if (!passwordPattern.test(form.password)) {
      setModalMessage('La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial.');
      setModalSuccess(false);
      setModalVisible(true);
      return false;
    }
    return true;
  };

  const handleRegistro = async () => {
    setLoading(true);
  
    try {
      if (!form.email || !form.password || !form.confirmPassword || !form.nombreCompleto || !form.telefono || !form.direccion || !form.dateOfBirth) {
        setModalMessage('Por favor completa todos los campos.');
        setModalSuccess(false);
        setModalVisible(true);
        setLoading(false);
        return;
      }
  
      if (!handlePasswordValidation()) {
        setLoading(false);
        return;
      }
  
      if (form.password !== form.confirmPassword) {
        setModalMessage('Las contraseñas no coinciden.');
        setModalSuccess(false);
        setModalVisible(true);
        setLoading(false);
        return;
      }
  
      // Cálculo de la edad a partir de la fecha de nacimiento
      const today = new Date();
      const birthDate = new Date(form.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
  
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--; // Ajuste para el caso en que el cumpleaños aún no ha pasado este año
      }
  
      await auth().createUserWithEmailAndPassword(form.email, form.password);
  
      const user = auth().currentUser;
  
      if (user) {
        const userData = {
          nombreCompleto: form.nombreCompleto,
          telefono: form.telefono,
          direccion: form.direccion,
          fechaNacimiento: form.dateOfBirth, // Fecha de nacimiento completa
          edad: age, // Edad calculada
        };
  
        await firestore().collection('usuarios').doc(user.email).collection('datos').add(userData);
  
        // Mostrar modal de éxito, pero NO navegar aún al MainPanel
        setModalMessage('Usuario registrado exitosamente');
        setModalSuccess(true);
        setModalVisible(true);
        setLoading(false);
      }
    } catch (error) {
      setModalMessage('Ocurrió un error al registrar el usuario. Por favor intenta nuevamente.');
      setModalSuccess(false);
      setModalVisible(true);
      setLoading(false);
    }
  };
  

  const handleCloseModal = () => {
    setModalVisible(false);

    // Navegar al MainPanel solo si el registro fue exitoso
    if (modalSuccess) {
      navigation.navigate('MainPanel');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} />
        </View>
        <Text style={styles.title}>¡Únete a nosotros!</Text>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Nombre completo"
              onChangeText={handleNombreInput}
              value={form.nombreCompleto}
              style={styles.input}
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Teléfono"
              onChangeText={handleTelefonoInput}
              value={form.telefono}
              style={styles.input}
              placeholderTextColor="#888"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="home" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Dirección"
              onChangeText={handleDireccionInput}
              value={form.direccion}
              style={styles.input}
              placeholderTextColor="#888"
            />
          </View>

          {/* Botón para abrir el DatePicker */}
          <View style={styles.inputContainer}>
            <Icon name="calendar" size={20} color="#555" style={styles.icon} />
            <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
              <Text style={styles.input}>{form.dateOfBirth ? form.dateOfBirth.toDateString() : 'Seleccionar fecha de nacimiento'}</Text>
            </TouchableOpacity>
          </View>

          {/* Modal del DatePicker */}
          <DatePicker
            modal
            open={openDatePicker}
            date={form.dateOfBirth}
            mode="date"
            minimumDate={new Date(1900, 0, 1)}
            maximumDate={new Date()}
            onConfirm={(date) => {
              setOpenDatePicker(false);
              setForm({ ...form, dateOfBirth: date });
            }}
            onCancel={() => {
              setOpenDatePicker(false);
            }}
          />

          <View style={styles.inputContainer}>
            <Icon name="envelope" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Correo electrónico"
              onChangeText={handleEmailInput}
              value={form.email}
              style={styles.input}
              placeholderTextColor="#888"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Contraseña"
              secureTextEntry={hidePassword}
              onChangeText={handlePasswordInput}
              value={form.password}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={styles.largerTouchArea}>
              <Icon name={hidePassword ? 'eye-slash' : 'eye'} size={20} color="#555" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Confirmar contraseña"
              secureTextEntry={hidePassword}
              onChangeText={handleConfirmPasswordInput}
              value={form.confirmPassword}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={styles.largerTouchArea}>
              <Icon name={hidePassword ? 'eye-slash' : 'eye'} size={20} color="#555" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#2F9FFA" />
          ) : (
            <TouchableOpacity onPress={handleRegistro} style={styles.gradientButton}>
              <LinearGradient colors={['#6DD5FA', '#2980B9']} style={styles.gradientButton}>
                <Text style={styles.buttonText}>¡Regístrate ahora!</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Modal personalizado para mostrar alertas bonitas */}
          <Modal isVisible={isModalVisible}>
            <View style={styles.modalContent}>
              <Icon
                name={modalSuccess ? 'check-circle' : 'times-circle'}
                size={60}
                color={modalSuccess ? 'green' : 'red'}
              />
              <Text style={styles.modalMessage}>{modalMessage}</Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
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
  logoContainer: {
    marginBottom: 20,
    width: '100%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '120%',
    height: '120%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  formContainer: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    color: '#333',
  },
  icon: {
    marginRight: 10,
  },
  largerTouchArea: {
    padding: 10,
    position: 'absolute',
    right: 0,
  },
  gradientButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginVertical: 10,
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: '#2980B9',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default Registro;
