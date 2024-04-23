import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const CalificacionScreen = ({ navigation }) => {
  const [pregunta1, setPregunta1] = useState(null);
  const [pregunta2, setPregunta2] = useState(null);
  const [pregunta3, setPregunta3] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const usuarioAutenticado = auth().currentUser;
        setUsuario(usuarioAutenticado);
      } catch (error) {
        console.error('Error al obtener información del usuario:', error);
      }
    };

    obtenerUsuario();
  }, []);

  const handleCalificarPress = async () => {
    try {
      if (usuario) {
        await firestore().collection('Calificaciones').add({
          pregunta1,
          pregunta2,
          pregunta3,
          userEmail: usuario.email,
          veterinariaNombre: 'Animal Zone',
        });

        setPregunta1(null);
        setPregunta2(null);
        setPregunta3(null);

        // Mostrar un mensaje de agradecimiento
        Alert.alert(
          'Gracias por calificarnos',
          'Agradecemos tu opinión y calificación. ¡Tu feedback es importante para nosotros!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Redirigir al usuario al panel vet1.js después de hacer clic en OK
                navigation.navigate('vet1');
              },
            },
          ]
        );
      } else {
        console.error('No hay un usuario logueado');
      }
    } catch (error) {
      console.error('Error al almacenar las calificaciones:', error);
    }
  };

  return (
    <ImageBackground source={require('../../imagenes/fondocalificaranimalzone.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Califica nuestros servicios</Text>

        <Text style={styles.pregunta}>1. ¿Cómo calificarías la atención del personal?</Text>
        <View style={styles.respuestas}>
          {[1, 2, 3, 4, 5].map((opcion) => (
            <TouchableOpacity
              key={opcion}
              style={[styles.opcion, pregunta1 === opcion && styles.opcionSeleccionada]}
              onPress={() => setPregunta1(opcion)}
            >
              <Text style={styles.opcionTexto}>{opcion}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.pregunta}>2. ¿Qué tan satisfecho estás con los servicios ofrecidos?</Text>
        <View style={styles.respuestas}>
          {[1, 2, 3, 4, 5].map((opcion) => (
            <TouchableOpacity
              key={opcion}
              style={[styles.opcion, pregunta2 === opcion && styles.opcionSeleccionada]}
              onPress={() => setPregunta2(opcion)}
            >
              <Text style={styles.opcionTexto}>{opcion}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.pregunta}>3. ¿Recomendarías nuestros servicios a otros?</Text>
        <View style={styles.respuestas}>
          {[1, 2, 3, 4, 5].map((opcion) => (
            <TouchableOpacity
              key={opcion}
              style={[styles.opcion, pregunta3 === opcion && styles.opcionSeleccionada]}
              onPress={() => setPregunta3(opcion)}
            >
              <Text style={styles.opcionTexto}>{opcion}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.calificarButton} onPress={handleCalificarPress}>
          <Text style={styles.calificarButtonText}>Calificar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  pregunta: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
  },
  respuestas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  opcion: {
    backgroundColor: '#2F9FFA',
    padding: 10,
    borderRadius: 4,
    width: '18%',
    alignItems: 'center',
  },
  opcionTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  opcionSeleccionada: {
    backgroundColor: '#FFD700',
  },
  calificarButton: {
    backgroundColor: '#2F9FFA',
    padding: 15,
    borderRadius: 4,
    width: '50%',
    alignSelf: 'center',
  },
  calificarButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CalificacionScreen;
