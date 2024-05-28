import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Vet1CitasDrScreen = () => {
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState(null);
  const [description, setDescription] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const [ultimoId, setUltimoId] = useState(0);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedPetType, setSelectedPetType] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    obtenerFechasDisponibles();
    obtenerUltimoId();
    obtenerDatosUsuario();
  }, []);

  const obtenerDatosUsuario = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userEmail = user.email;

        const userDataSnapshot = await firestore()
          .collection('usuarios')
          .doc(userEmail)
          .collection('datos')
          .get();

        if (!userDataSnapshot.empty) {
          const documentData = userDataSnapshot.docs[0].data();
          setUserData(documentData);
        } else {
          console.log('No se encontraron datos del usuario en Firestore.');
        }
      } else {
        console.log('El usuario no está autenticado.');
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario: ', error);
    }
  };

  const obtenerFechasDisponibles = async () => {
    try {
      const adminEmail = 'animalzone@gmail.com'; // Cambia esto al correo del administrador específico

      const citasSnapshot = await firestore().collection(`Administradores/${adminEmail}/citasdr`).get();
      const fechasOcupadas = citasSnapshot.docs.map((doc) => {
        const fechasData = doc.data().informacion;
        return fechasData ? fechasData.date : null;
      });

      const todasLasFechas = getTodasLasFechas();
      const fechasDisponibles = todasLasFechas.filter((fecha) => !fechasOcupadas.includes(fecha));

      setAvailableDates(fechasDisponibles);

      if (selectedDate) {
        obtenerHorasOcupadas(selectedDate);
      }
    } catch (error) {
      console.error('Error al obtener fechas disponibles:', error);
    }
  };

  const obtenerUltimoId = async () => {
    try {
      const adminEmail = 'animalzone@gmail.com'; // Cambia esto al correo del administrador específico

      const contadorIdRef = firestore().collection(`Administradores/${adminEmail}/citasdr`).doc('contadorId');
      const contadorIdDoc = await contadorIdRef.get();

      if (contadorIdDoc.exists) {
        setUltimoId(contadorIdDoc.data().count);
      }
    } catch (error) {
      console.error('Error al obtener el último ID:', error);
    }
  };

  const obtenerHorasOcupadas = async (fecha) => {
    try {
      const adminEmail = 'animalzone@gmail.com'; // Cambia esto al correo del administrador específico

      const horasSnapshot = await firestore()
        .collection(`Administradores/${adminEmail}/citasdr`)
        .where('informacion.date', '==', fecha)
        .get();

      const horasOcupadas = horasSnapshot.docs.map((doc) => doc.data().informacion.hour);

      setHorasOcupadas(horasOcupadas);
    } catch (error) {
      console.error('Error al obtener horas ocupadas:', error);
    }
  };

  const getTodasLasFechas = () => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const todasLasFechas = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      todasLasFechas.push(dateString);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return todasLasFechas;
  };

  const handleDatePress = (day) => {
    setSelectedDate(day.dateString);
    setSelectedHour(null);
    obtenerHorasOcupadas(day.dateString);
  };

  const handleHourPress = (hour) => {
    setSelectedHour(hour);
  };

  const solicitarCita = async () => {
    try {
      if (!selectedDate || !selectedHour || !userData || !selectedGender || !selectedPetType) {
        Alert.alert('Campos incompletos', 'Por favor, completa todos los campos antes de agendar la cita.');
        return;
      }

      const adminEmail = 'animalzone@gmail.com'; // Cambia esto al correo del administrador específico

      // Obtener la colección de citasdr
      const citasCollection = firestore().collection(`Administradores/${adminEmail}/citasdr`);

      // Obtener el último ID
      const contadorIdDoc = await citasCollection.doc('contadorId').get();
      const ultimoId = contadorIdDoc.exists ? contadorIdDoc.data().count : 0;

      // Crear un nuevo ID siguiendo el formato '0001', '0002', ...
      const nuevoId = ('000' + (ultimoId + 1)).slice(-4);

      // Verificar si la fecha y hora están ocupadas
      const citaExistente = await citasCollection
        .where('informacion.date', '==', selectedDate)
        .where('informacion.hour', '==', selectedHour)
        .get();

      if (!citaExistente.empty) {
        Alert.alert('Fecha y hora ocupadas', 'La fecha y hora seleccionadas ya están ocupadas. Por favor, elige otra fecha u hora.');
        return;
      }

      // Crear el nuevo documento de cita
      const citaId = citasCollection.doc(nuevoId);

      await citaId.set({
        informacion: {
          date: selectedDate,
          description: description,
          fullName: userData.nombreCompleto,
          hour: selectedHour,
          petGender: selectedGender,
          petType: selectedPetType,
          phoneNumber: userData.telefono,
        },
      });

      // Actualizar el contador de ID en la colección
      await citasCollection.doc('contadorId').set({
        count: ultimoId + 1,
      });

      obtenerFechasDisponibles();
      setSelectedDate('');
      setSelectedHour(null);
      setDescription('');
      setSelectedGender('');
      setSelectedPetType('');

      Alert.alert('Cita agendada', 'Cita agendada exitosamente. Pronto será contactado por el personal de la veterinaria para confirmar su cita.');

      navigation.navigate('vet1dr');
    } catch (error) {
      console.error('Error al agendar cita:', error);
      Alert.alert('Error', 'Hubo un error al agendar la cita. Por favor, inténtelo nuevamente.');
    }
  };

  const horasDisponibles = Array.from({ length: 8 }, (_, index) => 9 + index);

  return (
    <ImageBackground source={require('../../imagenes/fondocitabaño.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDatePress}
            markedDates={{ [selectedDate]: { selected: true, selectedColor: 'blue' } }}
          />
        </View>

        {selectedDate && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Selecciona una hora:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {horasDisponibles.map((hour) => (
                <TouchableOpacity
                  key={hour}
                  style={[styles.horaOption, horasOcupadas.includes(hour) ? styles.disabledOption : null, selectedHour === hour ? styles.selectedOption : null]}
                  onPress={() => handleHourPress(hour)}
                  disabled={horasOcupadas.includes(hour)}
                >
                  <Text style={{ color: 'black' }}>{hour}:00</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.separator} />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Tus datos:</Text>
          <TextInput
            value={userData ? userData.nombreCompleto : ''}
            onChangeText={(text) => setFullName(text)}
            placeholder="Nombre completo"
            style={[styles.textInput, { color: 'black' }]}
            editable={false}
          />
          <TextInput
            value={userData ? userData.telefono : ''}
            onChangeText={(text) => setPhoneNumber(text)}
            placeholder="Número de teléfono"
            keyboardType="phone-pad"
            style={[styles.textInput, { color: 'black' }]}
            editable={false}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Tipo de mascota:</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={[styles.genderButton, selectedPetType === 'Perro' ? styles.selectedOption : null]}
              onPress={() => setSelectedPetType('Perro')}
            >
              <Text style={styles.genderButtonText}>🐶 Perro</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderButton, selectedPetType === 'Gato' ? styles.selectedOption : null]}
              onPress={() => setSelectedPetType('Gato')}
            >
              <Text style={styles.genderButtonText}>🐱 Gato</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Género de la mascota:</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={[styles.genderButton, selectedGender === 'Hembra' ? styles.selectedOption : null]}
              onPress={() => setSelectedGender('Hembra')}
            >
              <Text style={styles.genderButtonText}>♀ Hembra</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderButton, selectedGender === 'Macho' ? styles.selectedOption : null]}
              onPress={() => setSelectedGender('Macho')}
            >
              <Text style={styles.genderButtonText}>♂ Macho</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Añade detalles adicionales:</Text>
          <TextInput
            value={description}
            onChangeText={(text) => setDescription(text)}
            multiline={true}
            numberOfLines={4}
            style={[styles.textInput, { color: 'black' }]}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.buttonContainer}>
          <Button title="Agendar Cita" onPress={solicitarCita} />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = {
  container: {
    padding: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  calendarContainer: {
    marginBottom: 16,
  },
  separator: {
    height: 16,
  },
  sectionContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color:'black',
  },
  horaOption: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    borderColor: 'blue',
  },
  disabledOption: {
    backgroundColor: '#ddd',
  },
  genderButton: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 8,
    width: '48%',
    marginBottom: 8,
  },
  genderButtonText: {
    textAlign: 'center',
    color:'black',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
    color: 'black',
  },
  buttonContainer: {
    marginTop: 16,
  },
};

export default Vet1CitasDrScreen;
