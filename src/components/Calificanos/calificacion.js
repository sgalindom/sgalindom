import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const CalificacionPanel = () => {
  const navigation = useNavigation();
  const user = auth().currentUser;

  const [respuestas, setRespuestas] = useState([3, 3, 3, 3, 3]);
  const [recomendacion, setRecomendacion] = useState('');
  const [calificacionEnviada, setCalificacionEnviada] = useState(false);

  const handleRadioButtonChange = (index, value) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[index] = value;
    setRespuestas(nuevasRespuestas);
  };

  const handleRecomendacionChange = (text) => {
    setRecomendacion(text);
  };

  const enviarCalificacion = async () => {
    try {
      if (user) {
        await firestore().collection('Calificaciones').add({
          timestamp: firestore.FieldValue.serverTimestamp(),
          usuarioCorreo: user.email,
          // Guardar solo la respuesta seleccionada
          respuestas: respuestas.map((respuesta, index) => (index === respuestas[index] ? respuesta : null)),
          recomendacion: recomendacion,
        });
        setCalificacionEnviada(true);
      } else {
        alert('Usuario no autenticado, inicia sesión para enviar una calificación.');
      }
    } catch (error) {
      console.error('Error al enviar la calificación:', error);
      alert('Hubo un problema al enviar la calificación. Inténtalo de nuevo más tarde.');
    }
  };

  const volverAMiPerfil = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground source={require('../imagenes/fondomain.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Califica tu experiencia</Text>
          {!calificacionEnviada ? (
            <>
              <View style={styles.preguntaContainer}>
                <Text style={styles.preguntaText}>¿Cómo calificarías la app?</Text>
                <View style={styles.radioButtons}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={[styles.radioButton, { backgroundColor: respuestas[0] === value ? '#007BFF' : 'transparent' }]}
                      onPress={() => handleRadioButtonChange(0, value)}
                    >
                      <Text style={styles.radioButtonText}>{value}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* Repite esto para las demás preguntas */}
              {/* Agrega un campo de texto para la recomendación */}
              <TextInput
                style={styles.recomendacionInput}
                placeholder="Escribe aquí tu recomendación..."
                multiline
                onChangeText={handleRecomendacionChange}
                value={recomendacion}
              />
              {/* Botón de enviar */}
              <TouchableOpacity style={styles.enviarButton} onPress={enviarCalificacion}>
                <Text style={styles.enviarButtonText}>Enviar Calificación</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Mensaje de agradecimiento si la calificación ya fue enviada
            <View style={styles.agradecimientoContainer}>
              <Icon name="check-circle" size={50} color="#4BB543" />
              <Text style={styles.agradecimientoText}>¡Gracias por tu calificación!</Text>
              {/* Botón para volver al perfil */}
              <TouchableOpacity style={styles.volverButton} onPress={volverAMiPerfil}>
                <Text style={styles.volverButtonText}>Volver a Mi Perfil</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco semitransparente
    borderRadius: 20,
    padding: 20,
    width: '90%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black', // Título en negro
    textAlign: 'center',
  },
  preguntaContainer: {
    marginBottom: 20,
  },
  preguntaText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black', // Texto en negro
  },
  radioButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonText: {
    fontSize: 18,
    color: 'black',
  },
  recomendacionInput: {
    height: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray', // Cambia el color del borde según tus preferencias
  },

  enviarButton: {
    backgroundColor: '#007BFF', // Color azul
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  enviarButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white', // Texto en blanco
  },
  agradecimientoContainer: {
    alignItems: 'center',
  },
  agradecimientoText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black', // Texto en negro
  },
  volverButton: {
    backgroundColor: '#007BFF', // Color azul
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  volverButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white', // Texto en blanco
  },
  // Estilo para la imagen de fondo
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalificacionPanel;
