import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
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

const logoImage = require('../imagenes/fondoperfil.jpg');

const Registro = ({ navigation }) => {
  const initialFormState = {
    email: '',
    password: '',
    confirmPassword: '',
    nombreCompleto: '',
    mascota: [], // Ajustado para permitir múltiples selecciones
    direccion: '',
    telefono: '',
  };

  const [form, setForm] = useState(initialFormState);
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('Débil');
  const [passwordColor, setPasswordColor] = useState('red');

  useEffect(() => {
    setForm(initialFormState);
  }, []);

  const handleNombreInput = (value) => {
    const formattedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setForm({ ...form, nombreCompleto: formattedValue });
  };

  const handlePasswordInput = (value) => {
    const formattedValue = value.replace(/\s/g, '');
    setForm({ ...form, password: formattedValue });

    if (value.length < 6) {
      setPasswordStrength('Débil');
      setPasswordColor('red');
    } else if (value.length >= 6 && !value.match(/^(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/)) {
      setPasswordStrength('Media');
      setPasswordColor('yellow');
    } else if (value.match(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)) {
      setPasswordStrength('Segura');
      setPasswordColor('green');
    }
  };

  const toggleMascota = (tipo) => {
    const nuevoEstado = form.mascota.includes(tipo)
      ? form.mascota.filter((mascota) => mascota !== tipo)
      : [...form.mascota, tipo];
    setForm({ ...form, mascota: nuevoEstado });
  };

  const handleRegistro = async () => {
    setLoading(true);

    try {
      if (!form.email || !form.password || !form.nombreCompleto || form.mascota.length === 0 || !form.direccion || !form.telefono) {
        setModalMessage('Por favor completa todos los campos obligatorios.');
        setModalSuccess(false);
        setModalVisible(true);
        setLoading(false);
        return;
      }

      if (form.password !== form.confirmPassword && form.confirmPassword) {
        setModalMessage('Las contraseñas no coinciden.');
        setModalSuccess(false);
        setModalVisible(true);
        setLoading(false);
        return;
      }

      await auth().createUserWithEmailAndPassword(form.email, form.password);

      const user = auth().currentUser;

      if (user) {
        const userData = {
          nombreCompleto: form.nombreCompleto,
          mascota: form.mascota,
          direccion: form.direccion,
          telefono: form.telefono,
        };

        await firestore()
          .collection('usuarios')
          .doc(user.email)
          .collection('datos')
          .add(userData);

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
    if (modalSuccess) {
      navigation.navigate('MainPanel');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logo} />
      </View>
      <Text style={styles.title}>¡Registra a tu mascota en el mejor cuidado profesional!</Text>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="black" style={styles.icon} />
          <TextInput
            placeholder="Nombre completo"
            onChangeText={handleNombreInput}
            value={form.nombreCompleto}
            style={styles.input}
            placeholderTextColor="black"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="black" style={styles.icon} />
          <TextInput
            placeholder="Correo electrónico"
            onChangeText={(value) => setForm({ ...form, email: value })}
            value={form.email}
            style={styles.input}
            placeholderTextColor="black"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color="black" style={styles.icon} />
          <TextInput
            placeholder="Teléfono"
            onChangeText={(value) => setForm({ ...form, telefono: value })}
            value={form.telefono}
            style={styles.input}
            placeholderTextColor="black"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="address-card" size={20} color="black" style={styles.icon} />
          <TextInput
            placeholder="Dirección"
            onChangeText={(value) => setForm({ ...form, direccion: value })}
            value={form.direccion}
            style={styles.input}
            placeholderTextColor="black"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="black" style={styles.icon} />
          <TextInput
            placeholder="Contraseña"
            secureTextEntry={hidePassword}
            onChangeText={handlePasswordInput}
            value={form.password}
            style={styles.input}
            placeholderTextColor="black"
          />
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={styles.largerTouchArea}>
            <Icon name={hidePassword ? 'eye-slash' : 'eye'} size={30} color="black" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.passwordStrength, { color: passwordColor }]}>Fortaleza: {passwordStrength}</Text>

        <Text style={styles.mascotaLabel}>¿Qué mascota tienes?</Text>
        <View style={styles.checkboxWrapper}>
          <TouchableOpacity
            style={[styles.checkbox, form.mascota.includes('Perro') && styles.checkboxSelected]}
            onPress={() => toggleMascota('Perro')}
          >
            <Text style={styles.checkboxText}>Perro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.checkbox, form.mascota.includes('Gato') && styles.checkboxSelected]}
            onPress={() => toggleMascota('Gato')}
          >
            <Text style={styles.checkboxText}>Gato</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2F9FFA" />
        ) : (
          <TouchableOpacity onPress={handleRegistro} style={styles.gradientButton}>
            <LinearGradient colors={["#6DD5FA", "#2980B9"]} style={styles.gradientButton}>
              <Text style={styles.buttonText}>Crear cuenta</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <Modal isVisible={isModalVisible}>
          <View style={styles.modalContent}>
            <Icon name={modalSuccess ? 'check-circle' : 'times-circle'} size={60} color={modalSuccess ? 'green' : 'red'} />
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity onPress={handleCloseModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  logoContainer: {
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 10,
    color: 'black',
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
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
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
    color: 'black',
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: '#2980B9',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  checkbox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#6DD5FA',
    borderColor: '#2980B9',
  },
  checkboxText: {
    fontSize: 14,
    color: 'black',
  },
  mascotaLabel: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  passwordStrength: {
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  passwordHint: {
    fontSize: 10,
    color: 'black',
    marginBottom: 15,
  },
});

export default Registro;
