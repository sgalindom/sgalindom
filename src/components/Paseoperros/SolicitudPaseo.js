import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Modal } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker'; // Importar el DatePicker de ruedita

const backgroundImage = require('../imagenes/fondomain.jpg');

const SolicitudPaseo = ({ route, navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState('');
  const [mascotas, setMascotas] = useState([]);
  const [selectedMascotas, setSelectedMascotas] = useState([]);
  const [observaciones, setObservaciones] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false); // Controlar el modal del DatePicker
  const [openTimePicker, setOpenTimePicker] = useState(false); // Controlar el modal del TimePicker
  const [userData, setUserData] = useState({});

  const user = auth().currentUser;
  const userEmail = user ? user.email : '';

  useEffect(() => {
    if (userEmail) {
      const fetchUserData = async () => {
        try {
          const userDatosSnapshot = await firestore()
            .collection('usuarios')
            .doc(userEmail)
            .collection('datos')
            .get();
          
          if (!userDatosSnapshot.empty) {
            const dataDoc = userDatosSnapshot.docs[0];
            const data = dataDoc.data();
            setUserData(data);
          }
        } catch (error) {
          console.error('Error al obtener los datos del usuario: ', error);
        }
      };

      const unsubscribeMascotas = firestore()
        .collection('usuarios')
        .doc(userEmail)
        .collection('mascotas')
        .onSnapshot((querySnapshot) => {
          const mascotasCargadas = [];
          querySnapshot.forEach((documentSnapshot) => {
            const data = documentSnapshot.data();
            mascotasCargadas.push({
              id: documentSnapshot.id,
              nombre: data.nombre,
            });
          });
          setMascotas(mascotasCargadas);
        });

      fetchUserData();

      return () => {
        unsubscribeMascotas();
      };
    }
  }, [userEmail]);

  const toggleMascota = (nombreMascota) => {
    if (selectedMascotas.includes(nombreMascota)) {
      setSelectedMascotas(selectedMascotas.filter((nombre) => nombre !== nombreMascota));
    } else {
      setSelectedMascotas([...selectedMascotas, nombreMascota]);
    }
  };

  const solicitarPaseo = () => {
    if (!selectedDate || selectedMascotas.length === 0 || !selectedHour || !selectedPackage) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const solicitudData = {
      fecha: selectedDate.toISOString().split('T')[0],
      mascotas: selectedMascotas,
      hora: selectedHour,
      observaciones: observaciones,
      paquete: selectedPackage,
      nombre: userData.nombreCompleto,
      telefono: userData.telefono,
      direccion: userData.direccion,
    };

    if (userEmail) {
      firestore()
        .collection('usuarios')
        .doc(userEmail)
        .collection('servicios')
        .add(solicitudData)
        .then(() => {
          firestore()
            .collection('paseos')
            .add(solicitudData)
            .then(() => {
              alert('Solicitud enviada con éxito!');
              navigation.navigate('MainPanel');
            })
            .catch((error) => {
              console.error('Error al enviar la solicitud a paseos: ', error);
            });
        })
        .catch((error) => {
          console.error('Error al enviar la solicitud a servicios: ', error);
        });
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Solicita un Paseo</Text>
        <View style={styles.panelContainer}>
          
          {/* Picker de Fecha estilo ruedita */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Selecciona la fecha</Text>
            <TouchableOpacity onPress={() => setOpenDatePicker(true)} style={styles.pickerButton}>
              <Text style={styles.pickerText}>{selectedDate.toDateString()}</Text>
              <Icon name="calendar-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <DatePicker
              modal
              open={openDatePicker}
              date={selectedDate}
              mode="date"
              onConfirm={(date) => {
                setSelectedDate(date);
                setOpenDatePicker(false);
              }}
              onCancel={() => setOpenDatePicker(false)}
            />
          </View>

          {/* Picker de Hora */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Selecciona la hora del paseo</Text>
            <TouchableOpacity onPress={() => setOpenTimePicker(true)} style={styles.pickerButton}>
              <Text style={styles.pickerText}>{selectedHour ? selectedHour : 'Seleccionar hora'}</Text>
              <Icon name="time-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <DatePicker
              modal
              open={openTimePicker}
              date={selectedDate}
              mode="time"
              onConfirm={(date) => {
                const hours = date.getHours();
                const minutes = date.getMinutes();
                setSelectedHour(`${hours}:${minutes < 10 ? '0' : ''}${minutes}`);
                setOpenTimePicker(false);
              }}
              onCancel={() => setOpenTimePicker(false)}
            />
          </View>

          {/* Mascotas Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Selecciona tus mascotas (hasta 6)</Text>
            {mascotas.length > 0 ? (
              mascotas.map((mascota) => (
                <View key={mascota.id} style={styles.mascota}>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      value={selectedMascotas.includes(mascota.nombre)}
                      onValueChange={() => toggleMascota(mascota.nombre)}
                    />
                    <Text style={styles.mascotaNombre}>{mascota.nombre}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View>
                <Text style={styles.noMascotasText}>No tienes mascotas registradas.</Text>
                <TouchableOpacity
                  style={styles.registrarMascotaButton}
                  onPress={() => navigation.navigate('AñadirMascota')}
                >
                  <Text style={styles.registrarMascotaButtonText}>Registrar Mascota</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Observaciones Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Observaciones</Text>
            <TextInput
              style={styles.observacionesInput}
              multiline
              placeholder="¿Algo especial que debamos saber?"
              value={observaciones}
              onChangeText={(text) => setObservaciones(text)}
            />
          </View>

          {/* Paquete Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Selecciona el paquete</Text>
            <TouchableOpacity
              style={[styles.paqueteOption, selectedPackage === 'diario' && styles.selectedPaqueteOption]}
              onPress={() => setSelectedPackage('diario')}
            >
              <Text style={styles.paqueteOptionText}>Diario</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paqueteOption, selectedPackage === 'semanal' && styles.selectedPaqueteOption]}
              onPress={() => setSelectedPackage('semanal')}
            >
              <Text style={styles.paqueteOptionText}>Semanal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paqueteOption, selectedPackage === 'mensual' && styles.selectedPaqueteOption]}
              onPress={() => setSelectedPackage('mensual')}
            >
              <Text style={styles.paqueteOptionText}>Mensual</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={solicitarPaseo}>
              <Text style={styles.submitButtonText}>Enviar Solicitud</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  panelContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'linear-gradient(90deg, rgba(0,122,255,1) 0%, rgba(0,180,255,1) 100%)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  pickerText: {
    fontSize: 16,
    color: '#fff',
  },
  mascota: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  mascotaNombre: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  noMascotasText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  registrarMascotaButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  registrarMascotaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  observacionesInput: {
    borderColor: '#007AFF',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 10,
    minHeight: 100,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  paqueteOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 10,
    borderColor: '#007AFF',
    borderWidth: 1.5,
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  selectedPaqueteOption: {
    backgroundColor: '#007AFF',
    borderColor: '#005BBB',
  },
  paqueteOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  submitContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginRight: 10,
  },
});


export default SolicitudPaseo;
