import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const backgroundImage = require('../imagenes/fondomain.jpg');

const SolicitudPaseo = ({ route, navigation }) => {
  const [selectedDate, setSelectedDate] = useState({});
  const [selectedHour, setSelectedHour] = useState('');
  const [mascotas, setMascotas] = useState([]);
  const [selectedMascotas, setSelectedMascotas] = useState([]);
  const [observaciones, setObservaciones] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [userData, setUserData] = useState({});

  const user = auth().currentUser;
  const userEmail = user ? user.email : '';

  useEffect(() => {
    if (userEmail) {
      // Obtener ID del documento de datos del usuario
      const fetchUserData = async () => {
        try {
          const userDatosSnapshot = await firestore()
            .collection('usuarios')
            .doc(userEmail)
            .collection('datos')
            .get();
          
          if (!userDatosSnapshot.empty) {
            const dataDoc = userDatosSnapshot.docs[0]; // Suponemos que solo hay un documento de datos por usuario
            const data = dataDoc.data();
            setUserData(data);
          }
        } catch (error) {
          console.error('Error al obtener los datos del usuario: ', error);
        }
      };

      // Obtener mascotas del usuario
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

  const handleDayPress = (day) => {
    if (selectedDate[day.dateString]) {
      const updatedDates = { ...selectedDate };
      delete updatedDates[day.dateString];
      setSelectedDate(updatedDates);
    } else {
      const updatedDates = { ...selectedDate };
      updatedDates[day.dateString] = { selected: true, selectedColor: '#007bff' }; // Cambiar color de selección
      setSelectedDate(updatedDates);
    }
  };

  const getSelectedDates = () => {
    const dates = Object.keys(selectedDate);
    return dates;
  };

  const solicitarPaseo = () => {
    if (getSelectedDates().length === 0 || selectedMascotas.length === 0 || !selectedHour || !selectedPackage) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    let maxDias = 1;
    if (selectedPackage === 'semanal') {
      maxDias = 5;
    } else if (selectedPackage === 'mensual') {
      maxDias = 20;
    } else if (selectedPackage === 'diario') {
      maxDias = 1; // Cambiar a 1 para el paquete diario
    }

    if (getSelectedDates().length > maxDias) {
      alert(`Solo puedes seleccionar hasta ${maxDias} días para el paquete ${selectedPackage}.`);
      return;
    }

    // Crear un objeto con los datos de la solicitud
    const solicitudData = {
      fechas: getSelectedDates(),
      mascotas: selectedMascotas,
      hora: selectedHour,
      observaciones: observaciones,
      paquete: selectedPackage,
      nombre: userData.nombreCompleto,
      telefono: userData.telefono,
      direccion: userData.direccion,
    };

    if (userEmail) {
      // Guardar la solicitud en la colección "servicios" dentro del perfil del usuario en Firebase
      firestore()
        .collection('usuarios')
        .doc(userEmail)
        .collection('servicios')
        .add(solicitudData)
        .then(() => {
          // Guardar la misma solicitud en la colección "paseos" para los paseadores
          firestore()
            .collection('paseos')
            .doc() // Genera un ID automático para la solicitud de paseo en "paseos"
            .set(solicitudData)
            .then(() => {
              alert('Solicitud de paseo enviada con éxito!');
              navigation.navigate('MainPanel');
            })
            .catch((error) => {
              console.error('Error al enviar la solicitud de paseo a paseos: ', error);
            });
        })
        .catch((error) => {
          console.error('Error al enviar la solicitud de paseo a servicios: ', error);
        });
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    setSelectedHour(`${hours}:${minutes < 10 ? '0' : ''}${minutes}`);
    hideDatePicker();
  };

  const renderTimePickerButton = () => {
    return (
      <TouchableOpacity style={styles.timePickerButton} onPress={showDatePicker}>
        <Text style={styles.timePickerText}>{selectedHour ? selectedHour : 'Seleccionar hora'}</Text>
        <Icon name="time-outline" size={20} color="black" />
      </TouchableOpacity>
    );
  };

  const renderHourPicker = () => {
    // Crear un array de horas desde las 8 AM hasta las 4 PM
    const hours = Array.from({ length: 9 }, (_, index) => index + 8);

    return (
      <FlatList
        data={hours}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.hourOption, selectedHour === `${item}:00` ? styles.selectedHourOption : null]}
            onPress={() => setSelectedHour(`${item}:00`)}
          >
            <Text style={styles.hourOptionText}>{`${item}:00`}</Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.panelContainer}>
          {/* Calendar Section */}
          <View style={styles.sectionContainer}>
            <Calendar
              style={styles.calendar}
              onDayPress={handleDayPress}
              current={new Date().toISOString().split('T')[0]}
              markedDates={selectedDate}
            />
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Mascotas Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Selecciona tus mascotas (hasta 6)</Text>
            {mascotas.length > 0 ? (
              // Si el usuario tiene mascotas registradas, muestra la lista de mascotas
              mascotas.map((mascota) => (
                <View key={mascota.id} style={styles.mascota}>
                  <CheckBox
                    value={selectedMascotas.includes(mascota.nombre)}
                    onValueChange={() => toggleMascota(mascota.nombre)}
                  />
                  <Text style={styles.mascotaNombre}>{mascota.nombre}</Text>
                </View>
              ))
            ) : (
              // Si el usuario no tiene mascotas registradas, muestra un mensaje y un botón de registro
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

          {/* Separator */}
          <View style={styles.separator} />

          {/* Hora Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Selecciona la hora del paseo</Text>
            {renderTimePickerButton()}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="time"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              headerTextIOS="Elige la hora del paseo"
              confirmTextIOS="Confirmar"
              cancelTextIOS="Cancelar"
              locale="es_ES"
            />
            {renderHourPicker()}
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Observaciones Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Observaciones</Text>
            <TextInput
              style={styles.observacionesInput}
              multiline
              placeholder="Escribe aquí cualquier observación adicional."
              value={observaciones}
              onChangeText={(text) => setObservaciones(text)}
            />
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Paquete Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Selecciona el paquete</Text>
            <TouchableOpacity
              style={[styles.paqueteOption, selectedPackage === 'diario' ? styles.selectedPaqueteOption : null]}
              onPress={() => setSelectedPackage('diario')}
            >
              <Text style={styles.paqueteOptionText}>Diario</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paqueteOption, selectedPackage === 'semanal' ? styles.selectedPaqueteOption : null]}
              onPress={() => setSelectedPackage('semanal')}
            >
              <Text style={styles.paqueteOptionText}>Semanal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paqueteOption, selectedPackage === 'mensual' ? styles.selectedPaqueteOption : null]}
              onPress={() => setSelectedPackage('mensual')}
            >
              <Text style={styles.paqueteOptionText}>Mensual</Text>
            </TouchableOpacity>
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={solicitarPaseo}>
              <Text style={styles.submitButtonText}>Solicitar Paseo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = {
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    padding: 20,
  },
  panelContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
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
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  registrarMascotaButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  registrarMascotaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timePickerText: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  hourOption: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedHourOption: {
    backgroundColor: '#007bff',
  },
  hourOptionText: {
    fontSize: 16,
    color: '#333',
  },
  observacionesInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    fontSize: 16,
  },
  paqueteOption: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedPaqueteOption: {
    backgroundColor: '#007bff',
  },
  paqueteOptionText: {
    fontSize: 16,
    color: '#333',
  },
  submitContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
};

export default SolicitudPaseo;
