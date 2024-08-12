import React, { useState } from 'react';
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
  Animated,
  Alert,
  ActivityIndicator, // Importar el componente ActivityIndicator
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const logoImage = require('../imagenes/fondoperfil.jpg');
const backgroundImage = require('../imagenes/fondomain.jpg');

const Registro = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [edad, setEdad] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [errorField, setErrorField] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para manejar la carga

  const handleRegistro = async () => {
    setLoading(true); // Activar el estado de carga

    try {
      // Validar que todos los campos estén llenos
      if (!email || !password || !confirmPassword || !nombreCompleto || !telefono || !direccion || !edad) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        setLoading(false); // Desactivar el estado de carga
        return;
      }

      // Validar que la contraseña tenga al menos 6 caracteres
      if (password.length < 6) {
        Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
        setLoading(false); // Desactivar el estado de carga
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        setLoading(false); // Desactivar el estado de carga
        return;
      }

      // Validar formato de email
      if (!validateEmail(email)) {
        Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
        setLoading(false); // Desactivar el estado de carga
        return;
      }

      await auth().createUserWithEmailAndPassword(email, password);
      console.log('Registro exitoso');

      const user = auth().currentUser;

      if (user) {
        const userData = {
          nombreCompleto,
          telefono,
          direccion,
          edad,
        };

        await firestore().collection('usuarios').doc(user.email).collection('datos').add(userData);
        Alert.alert('Éxito', 'Usuario registrado exitosamente');
        navigation.navigate('MainPanel');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al registrar el usuario. Por favor intenta nuevamente.');
      console.error('Error al registrar usuario', error);
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  // Función para validar formato de email
  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  // Función para validar que solo se ingresen números en el teléfono y la edad
  const validateNumberInput = (value) => {
    const numberRegex = /^[0-9]*$/;
    return numberRegex.test(value);
  };

  // Función para validar que solo se ingresen letras en el nombre
  const validateNameInput = (value) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(value);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} />
        </View>
        <Text style={styles.title}>¡Únete a nosotros!</Text>
        <Animated.View style={styles.formContainer}>
          <View style={[styles.inputContainer, errorField === 'nombreCompleto' && styles.error]}>
            <Icon name="user" size={20} color="#000000" style={styles.icon} />
            <TextInput
              placeholder="Nombre completo"
              onChangeText={setNombreCompleto}
              style={styles.input}
              placeholderTextColor="#000000"
              keyboardType="default"
              maxLength={50}
              editable
              autoCapitalize="words"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color="#000000" style={styles.icon} />
            <TextInput
              placeholder="Teléfono"
              onChangeText={(value) => {
                if (validateNumberInput(value) || value === '') {
                  setTelefono(value);
                }
              }}
              style={styles.input}
              placeholderTextColor="#000000"
              keyboardType="phone-pad"
              maxLength={10}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="home" size={20} color="#000000" style={styles.icon} />
            <TextInput
              placeholder="Dirección"
              onChangeText={setDireccion}
              style={styles.input}
              placeholderTextColor="#000000"
              keyboardType="default"
              maxLength={100}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="birthday-cake" size={20} color="#000000" style={styles.icon} />
            <TextInput
              placeholder="Edad"
              onChangeText={(value) => {
                if (validateNumberInput(value) || value === '') {
                  setEdad(value);
                }
              }}
              style={styles.input}
              placeholderTextColor="#000000"
              keyboardType="numeric"
              maxLength={3}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="envelope" size={20} color="#000000" style={styles.icon} />
            <TextInput
              placeholder="Correo electrónico"
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor="#000000"
              keyboardType="email-address"
              maxLength={50}
              autoCapitalize="none"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#000000" style={styles.icon} />
            <TextInput
              placeholder="Contraseña"
              secureTextEntry={hidePassword}
              onChangeText={setPassword}
              style={styles.input}
              placeholderTextColor="#000000"
              keyboardType="default"
              maxLength={50}
              autoCapitalize="none"
              returnKeyType="next"
            />
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={styles.eyeIconContainer}>
              <Icon name={hidePassword ? 'eye-slash' : 'eye'} size={20} color="#000000" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#000000" style={styles.icon} />
            <TextInput
              placeholder="Confirmar contraseña"
              secureTextEntry={hidePassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              placeholderTextColor="#000000"
              keyboardType="default"
              maxLength={50}
              autoCapitalize="none"
              returnKeyType="done"
            />
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={styles.eyeIconContainer}>
              <Icon name={hidePassword ? 'eye-slash' : 'eye'} size={20} color="#000000" />
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#2F9FFA" style={styles.loadingIndicator} />
          ) : (
            <TouchableOpacity onPress={handleRegistro} style={styles.button} disabled={loading}>
              <Text style={styles.buttonText}>¡Regístrate ahora!</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
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
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  formContainer: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    color: '#000000',
  },
  icon: {
    marginRight: 10,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
  },
  button: {
    backgroundColor: '#2F9FFA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  error: {
    borderBottomColor: 'red',
  },
});

export default Registro;
