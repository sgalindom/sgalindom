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
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';  // Para el gradiente

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
  const [loading, setLoading] = useState(false);

  const handleRegistro = async () => {
    setLoading(true);

    try {
      if (!email || !password || !confirmPassword || !nombreCompleto || !telefono || !direccion || !edad) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      await auth().createUserWithEmailAndPassword(email, password);

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
    } finally {
      setLoading(false);
    }
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
            <Icon name="user" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Nombre completo"
              onChangeText={setNombreCompleto}
              style={styles.input}
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Teléfono"
              onChangeText={setTelefono}
              style={styles.input}
              placeholderTextColor="#888"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="home" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Dirección"
              onChangeText={setDireccion}
              style={styles.input}
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="birthday-cake" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Edad"
              onChangeText={setEdad}
              style={styles.input}
              placeholderTextColor="#888"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="envelope" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Correo electrónico"
              onChangeText={setEmail}
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
              onChangeText={setPassword}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={styles.eyeIconContainer}>
              <Icon name={hidePassword ? 'eye-slash' : 'eye'} size={20} color="#555" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Confirmar contraseña"
              secureTextEntry={hidePassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={styles.eyeIconContainer}>
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
    width: '100%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '80%',
    height: '100%',
    resizeMode: 'contain', // Asegura que el logo mantenga su proporción
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
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
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
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default Registro;
