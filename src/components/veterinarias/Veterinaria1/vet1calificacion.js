import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

const CalificacionScreen = ({ navigation }) => {
  const [preguntas, setPreguntas] = useState([
    { id: 1, pregunta: '¿Cómo calificarías la atención del personal?', respuesta: null },
    { id: 2, pregunta: '¿Qué tan satisfecho estás con los servicios ofrecidos?', respuesta: null },
    { id: 3, pregunta: '¿Recomendarías nuestros servicios a otros?', respuesta: null },
  ]);
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

  const handleSeleccionRespuesta = (id, respuesta) => {
    const nuevasPreguntas = preguntas.map((pregunta) => {
      if (pregunta.id === id) {
        return { ...pregunta, respuesta };
      }
      return pregunta;
    });
    setPreguntas(nuevasPreguntas);
  };

  const handleCalificarPress = async () => {
    try {
      if (usuario) {
        const respuestas = preguntas.map((pregunta) => `${pregunta.pregunta}: ${pregunta.respuesta}`);
        await firestore().collection('Calificaciones').add({
          respuestas,
          userEmail: usuario.email,
          veterinariaNombre: 'Animal Zone',
        });

        setPreguntas(preguntas.map((pregunta) => ({ ...pregunta, respuesta: null })));

        // Mostrar un mensaje de agradecimiento
        Alert.alert(
          '¡Gracias por tu calificación!',
          'Agradecemos tu opinión y calificación. Tu feedback es importante para nosotros.',
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
        {preguntas.map((pregunta) => (
          <View key={pregunta.id} style={styles.preguntaContainer}>
            <Text style={styles.pregunta}>{pregunta.pregunta}</Text>
            <View style={styles.respuestasContainer}>
              {['Excelente', 'Bueno', 'Regular', 'Malo'].map((opcion) => (
                <TouchableOpacity
                  key={opcion}
                  style={[styles.respuesta, pregunta.respuesta === opcion && styles.respuestaSeleccionada]}
                  onPress={() => handleSeleccionRespuesta(pregunta.id, opcion)}
                >
                  <Text style={styles.respuestaTexto}>{opcion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.calificarButton} onPress={handleCalificarPress}>
          <Icon name="star" size={24} color="white" style={styles.iconoEstrella} />
          <Text style={styles.calificarButtonText}>Calificar</Text>
          <Icon name="send" size={24} color="white" style={styles.iconoEnviar} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  preguntaContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  pregunta: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  respuestasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  respuesta: {
    backgroundColor: '#2F9FFA',
    padding: 10,
    borderRadius: 5,
    width: '22%',
    alignItems: 'center',
  },
  respuestaTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10, // Cambié el tamaño de la letra aquí
  },
  respuestaSeleccionada: {
    backgroundColor: '#FFD700',
  },
  calificarButton: {
    backgroundColor: '#2F9FFA',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calificarButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  iconoEstrella: {
    marginRight: 10,
  },
  iconoEnviar: {
    marginLeft: 10,
  },
});

export default CalificacionScreen;
