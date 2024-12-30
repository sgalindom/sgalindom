import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const CalificacionPanel = () => {
  const navigation = useNavigation();
  const user = auth().currentUser;

  const [respuesta, setRespuesta] = useState(3);
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
          <View style={styles.card}>
            <Text style={styles.title}>Califica tu experiencia</Text>
            {!calificacionEnviada ? (
              <>
                <View style={styles.questionContainer}>
                  <Text style={styles.preguntaText}>¿Cómo calificarías la app?</Text>
                  <View style={styles.radioButtons}>
                    {[1, 2, 3, 4, 5].map(value => (
                      <TouchableOpacity
                        key={value}
                        style={[styles.radioButton, { backgroundColor: respuesta === value ? '#007BFF' : '#5A9FD1' }]}
                        onPress={() => setRespuesta(value)}
                      >
                        <Text style={styles.radioButtonText}>{value}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <TextInput
                  style={styles.recomendacionInput}
                  placeholder="Escribe aquí tu recomendación..."
                  placeholderTextColor="black"
                  multiline
                  onChangeText={setRecomendacion}
                  value={recomendacion}
                />
                <TouchableOpacity style={styles.enviarButton} onPress={enviarCalificacion}>
                  <Text style={styles.enviarButtonText}>Enviar Calificación</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.agradecimientoContainer}>
                <Icon name="check-circle" size={50} color="#007BFF" />
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
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco semitransparente
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  questionContainer: {
    marginBottom: 20,
  },
  preguntaText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  radioButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  radioButton: {
    borderRadius: 50,
    padding: 12,
    marginHorizontal: 8,
    backgroundColor: '#5A9FD1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recomendacionInput: {
    height: 120,
    borderColor: '#007BFF',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
    color: '#333',
    backgroundColor: '#f2f2f2',
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  enviarButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  enviarButtonText: {
    color: '#fff',
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
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    alignItems: 'center',
  },
  volverButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default CalificacionPanel;
