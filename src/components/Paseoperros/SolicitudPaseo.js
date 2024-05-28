import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { Calendar } from 'react-native-calendars';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/Ionicons';

const backgroundImage = require('../imagenes/fondomain.jpg');

const SolicitudPaseo = ({ route, navigation }) => {
  const [selectedDate, setSelectedDate] = useState({});
  const [selectedHour, setSelectedHour] = useState('');
  const [mascotas, setMascotas] = useState([]);
  const [selectedMascotas, setSelectedMascotas] = useState([]);
  const [observaciones, setObservaciones] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);

  const user = auth().currentUser;
  const userEmail = user ? user.email : '';

  useEffect(() => {
    if (userEmail) {
      const unsubscribe = firestore()
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

      return () => {
        unsubscribe();
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
      updatedDates[day.dateString] = { selected: true, selectedColor: 'blue' };
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
    };

    if (userEmail) {
      // Guardar la solicitud en la colección "servicios" dentro del perfil del usuario en Firebase
      firestore()
        .collection('usuarios')
        .doc(userEmail)
        .collection('servicios')
        .add(solicitudData)
        .then(() => {
          alert('Solicitud de paseo enviada con éxito!');
          navigation.navigate('MainPanel');
        })
        .catch((error) => {
          console.error('Error al enviar la solicitud de paseo: ', error);
        });
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.panelContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              style={styles.calendar}
              onDayPress={handleDayPress}
              current={new Date().toISOString().split('T')[0]}
              markedDates={selectedDate}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.mascotaContainer}>
            <Text style={styles.label}>Selecciona tus mascotas (hasta 6):</Text>
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

          <View style={styles.separator} />

          <View style={styles.horaContainer}>
            <Text style={styles.label}>Selecciona la hora del paseo:</Text>
            <View style={styles.inputContainer}>
              <Icon name="time-outline" size={20} color="black" />
              <TextInput
                value={selectedHour}
                onChangeText={(text) => setSelectedHour(text)}
                style={styles.textInput}
                placeholder="HH:MM"
                placeholderTextColor="#ccc"
              />
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.packageContainer}>
            <Text style={styles.label}>Selecciona el paquete:</Text>
            <TouchableOpacity
              style={[styles.packageOption, selectedPackage === 'diario' ? styles.selectedOption : null]}
              onPress={() => setSelectedPackage('diario')}
            >
              <Icon name="journal-outline" size={20} color="black" />
              <Text style={styles.packageOptionText}>Diario</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.packageOption, selectedPackage === 'semanal' ? styles.selectedOption : null]}
              onPress={() => setSelectedPackage('semanal')}
            >
              <Icon name="calendar-outline" size={20} color="black" />
              <Text style={styles.packageOptionText}>Semanal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.packageOption, selectedPackage === 'mensual' ? styles.selectedOption : null]}
              onPress={() => setSelectedPackage('mensual')}
            >
              <Icon name="calendar-sharp" size={20} color="black" />
              <Text style={styles.packageOptionText}>Mensual</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          <View style={styles.detallesContainer}>
            <Text style={styles.label}>Agrega más detalles aquí:</Text>
            <TextInput
              value={observaciones}
              onChangeText={(text) => setObservaciones(text)}
              multiline={true}
              numberOfLines={4}
              style={[styles.textInput, { height: 100 }]}
              placeholder="Agrega detalles (opcional)"
              placeholderTextColor="#ccc"
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={solicitarPaseo}>
              <Text style={styles.buttonText}>¡A PASEAR!</Text>
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
    justifyContent: 'center',
  },
  container: {
    padding: 16,
  },
  panelContainer: {
    margin: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco semitransparente
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'black',
  },
  calendarContainer: {
    marginBottom: 16,
  },
  calendar: {},
  separator: {
    height: 16,
  },
  mascotaContainer: {
    marginBottom: 16,
  },
  horaContainer: {
    marginBottom: 16,
  },
  packageContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  mascota: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mascotaNombre: {
    fontSize: 16,
    color: 'black',
    marginLeft: 8,
  },
  noMascotasText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'black',
  },
  registrarMascotaButton: {
    backgroundColor: '#2F9FFA',
    padding: 10,
    borderRadius: 4,
    width: 200,
    alignSelf: 'center',
    marginTop: 16,
  },
  registrarMascotaButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  packageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 12,
    marginBottom: 8,
  },
  packageOptionText: {
    marginLeft: 8,
    color: 'black',
  },
  selectedOption: {
    backgroundColor: '#F5F5F5',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 8,
    color: 'black',
    flex: 1,
    marginLeft: 8,
  },
  detallesContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2F9FFA',
    padding: 12,
    borderRadius: 8,
    width: 200,
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
};


export default SolicitudPaseo;
