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
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const logoImage = require('../imagenes/fondoperfil.jpg');
const backgroundImage = require('../imagenes/Registro.jpg');

const Registro = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [edad, setEdad] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const handleRegistro = async () => {
    try {
      // Validar que todos los campos estén llenos
      if (!email || !password || !confirmPassword || !nombreCompleto || !telefono || !direccion || !edad) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }

      // Validar formato de email
      if (!validateEmail(email)) {
        Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
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

        navigation.navigate('MainPanel');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al registrar el usuario. Por favor intenta nuevamente.');
      console.error('Error al registrar usuario', error);
    }
  };

  // Función para validar formato de email
  const validateEmail = (email) => {
    // Expresión regular para validar formato de email
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  // Función para validar que solo se ingresen números en el teléfono y la edad
  const validateNumberInput = (value) => {
    // Expresión regular para validar que solo sean números
    const numberRegex = /^[0-9]*$/;
    return numberRegex.test(value);
  };

  // Función para validar que solo se ingresen letras en el nombre
  const validateNameInput = (value) => {
    // Expresión regular para validar que solo sean letras
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
          <View style={styles.inputContainer}>
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
          <TouchableOpacity onPress={handleRegistro} style={styles.button}>
            <Text style={styles.buttonText}>¡Regístrate ahora!</Text>
          </TouchableOpacity>
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
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    width: '80%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF', // Fondo blanco
    borderRadius: 10, // Bordes redondeados
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
  },
  button: {
    backgroundColor: '#2F9FFA',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Registro;
