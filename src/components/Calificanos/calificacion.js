import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const CalificacionPanel = () => {
  const navigation = useNavigation();
  const user = auth().currentUser;

  const [respuesta, setRespuesta] = useState(3); // Solo una respuesta
  const [recomendacion, setRecomendacion] = useState('');
  const [calificacionEnviada, setCalificacionEnviada] = useState(false);

  const enviarCalificacion = async () => {
    try {
      if (user) {
        await firestore().collection('Calificaciones').add({
          timestamp: firestore.FieldValue.serverTimestamp(),
          usuarioCorreo: user.email,
          respuesta,
          recomendacion,
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
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Califica tu experiencia</Text>
            {!calificacionEnviada ? (
              <>
                <View style={styles.card}>
                  <Text style={styles.preguntaText}>¿Cómo calificarías la app?</Text>
                  <View style={styles.radioButtons}>
                    {[1, 2, 3, 4, 5].map(value => (
                      <TouchableOpacity
                        key={value}
                        style={[styles.radioButton, { backgroundColor: respuesta === value ? '#007BFF' : 'transparent' }]}
                        onPress={() => setRespuesta(value)}
                      >
                        <Text style={styles.radioButtonText}>{value}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.card}>
                  <TextInput
                    style={styles.recomendacionInput}
                    placeholder="Escribe aquí tu recomendación..."
                    placeholderTextColor="gray" // Color del texto del placeholder
                    multiline
                    onChangeText={setRecomendacion}
                    value={recomendacion}
                  />
                </View>
                <TouchableOpacity style={styles.enviarButton} onPress={enviarCalificacion}>
                  <Text style={styles.enviarButtonText}>Enviar Calificación</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.agradecimientoContainer}>
                <Icon name="check-circle" size={50} color="#4BB543" />
                <Text style={styles.agradecimientoText}>¡Gracias por tu calificación!</Text>
                <TouchableOpacity style={styles.volverButton} onPress={volverAMiPerfil}>
                  <Text style={styles.volverButtonText}>Volver a Mi Perfil</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // Hacer que la imagen de fondo ocupe todo el espacio
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fondo blanco semitransparente
    borderRadius: 20,
    padding: 20,
    width: '90%',
    elevation: 5, // Sombra para dar profundidad
    alignItems: 'center', // Centrar el contenido
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Título en un gris oscuro
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9', // Fondo claro para las tarjetas
    borderRadius: 10,
    width: '100%', // Asegura que la tarjeta ocupe el ancho total
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2, // Sombra para Android
  },
  preguntaText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333', // Color del texto de la pregunta
    textAlign: 'center',
  },
  radioButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  radioButton: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#007BFF',
    padding: 10,
    marginHorizontal: 5,
  },
  radioButtonText: {
    color: '#333', // Color del texto de los botones de radio
  },
  recomendacionInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: 'black', // Color del texto ingresado
    textAlignVertical: 'top', // Alinear el texto en la parte superior
  },
  enviarButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  enviarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  agradecimientoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  agradecimientoText: {
    fontSize: 18,
    marginTop: 10,
    color: '#333',
    textAlign: 'center',
  },
  volverButton: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
  },
  volverButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default CalificacionPanel;
