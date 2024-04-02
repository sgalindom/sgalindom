import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, ImageBackground, TextInput } from 'react-native';
import { Card, RadioButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

// Importa la imagen de fondo
import FondoImage from '../imagenes/fondomain.jpg';

const CalificacionPanel = () => {
  const navigation = useNavigation();
  const user = auth().currentUser;

  const [preguntas, setPreguntas] = useState([
    { pregunta: '¿Cómo calificarías la calidad del servicio?', respuesta: 3 },
    { pregunta: '¿Qué tan satisfecho estás con la atención al cliente?', respuesta: 3 },
    { pregunta: '¿Cómo evalúas la eficiencia en la entrega de servicios?', respuesta: 3 },
    { pregunta: '¿Qué tan probable es que recomiendes nuestro servicio a otros?', respuesta: 3 },
    { pregunta: '¿En general, cómo calificarías tu experiencia con nosotros?', respuesta: 3 },
  ]);

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
        // Guardar en Firebase
        await firestore().collection('Calificaciones').add({
          timestamp: firestore.FieldValue.serverTimestamp(),
          usuarioCorreo: user.email,
          respuestas: respuestas.map((respuesta, index) => ({
            pregunta: preguntas[index].pregunta,
            respuesta: respuesta,
          })),
          recomendacion: recomendacion, // Agregar la recomendación
        });

        // Actualiza el estado para mostrar el panel de agradecimiento
        setCalificacionEnviada(true);
      } else {
        // Si el usuario no está autenticado, puedes manejarlo de alguna manera.
        Alert.alert('Usuario no autenticado', 'Inicia sesión para enviar una calificación.', [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Error al enviar la calificación:', error);
      Alert.alert('Error', 'Hubo un problema al enviar la calificación. Inténtalo de nuevo más tarde.', [{ text: 'OK' }]);
    }
  };

  const volverAMiPerfil = () => {
    // Navegar de vuelta al panel anterior (MiPerfil.js)
    navigation.goBack();
  };

  return (
    // Utiliza ImageBackground para agregar una imagen de fondo
    <ImageBackground source={FondoImage} style={styles.backgroundImage} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Calificación</Text>
          {!calificacionEnviada ? (
            <>
              {preguntas.map((pregunta, index) => (
                <Card key={index} style={styles.card}>
                  <Card.Content>
                    <Text style={styles.preguntaText}>{pregunta.pregunta}</Text>
                    <RadioButton.Group
                      onValueChange={(value) => handleRadioButtonChange(index, value)}
                      value={respuestas[index]}
                    >
                      {[1, 2, 3, 4, 5].map((option) => (
                        <RadioButton.Item key={option} label={option.toString()} value={option} />
                      ))}
                    </RadioButton.Group>
                  </Card.Content>
                </Card>
              ))}
              <TextInput
                style={styles.recomendacionInput}
                placeholder="Escribe aquí tu recomendación..."
                multiline
                onChangeText={handleRecomendacionChange}
                value={recomendacion}
              />
              <Button title="Enviar" onPress={enviarCalificacion} color="#007BFF" />
            </>
          ) : (
            <View style={styles.agradecimientoContainer}>
              <Text style={styles.agradecimientoText}>¡Gracias por tu calificación!</Text>
              <Button title="Volver a Mi Perfil" onPress={volverAMiPerfil} color="#007BFF" />
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black', // Título en negro
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
  },
  preguntaText: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black', // Texto en negro
  },
  recomendacionInput: {
    height: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  agradecimientoContainer: {
    alignItems: 'center',
  },
  agradecimientoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black', // Texto en negro
  },
  // Agrega un estilo para la imagen de fondo
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalificacionPanel;
