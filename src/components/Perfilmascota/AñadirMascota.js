import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AñadirMascota = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [raza, setRaza] = useState('');
  const [edad, setEdad] = useState('');
  const [unidadEdad, setUnidadEdad] = useState('años');
  const [peso, setPeso] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoMascota, setTipoMascota] = useState('perro');

  const user = auth().currentUser;
  const userEmail = user ? user.email : '';

  const registrarMascota = async () => {
    if (userEmail && nombre && raza && edad && peso) {
      // Obtener la referencia a la colección de mascotas específica del usuario
      const mascotasRef = firestore().collection(`usuarios/${userEmail}/mascotas`);

      try {
        // Obtener la última mascota para determinar el próximo ID
        const ultimaMascota = await mascotasRef.orderBy('id', 'desc').limit(1).get();
        const ultimoID = ultimaMascota.docs.length > 0 ? ultimaMascota.docs[0].data().id : 0;
        
        // Crear la nueva mascota con el próximo ID secuencial
        const nuevoID = ultimoID + 1;

        const nuevaMascota = {
          id: nuevoID,
          nombre: nombre,
          raza: raza,
          edad: unidadEdad === 'años' ? Number(edad) : `(${Number(edad)} meses)`,
          peso: Number(peso),
          descripcion: descripcion,
          tipo: tipoMascota,
        };

        // Agregar la mascota a la colección
        await mascotasRef.doc(nuevoID.toString()).set(nuevaMascota);

        console.log('Mascota registrada con ID: ', nuevoID, ' y nombre: ', nuevaMascota.nombre);

        navigation.navigate('MisMascotas');
      } catch (error) {
        console.error('Error al registrar la mascota: ', error);
      }
    }
  };

  return (
    <ImageBackground
      source={require('../imagenes/AñadirMascota.jpg')}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Conozcamos a tu mascota</Text>
        <Picker
          selectedValue={tipoMascota}
          onValueChange={(itemValue, itemIndex) => setTipoMascota(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Perro" value="perro" />
          <Picker.Item label="Gato" value="gato" />
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la mascota"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Raza de la mascota"
          value={raza}
          onChangeText={setRaza}
        />
        <TextInput
          style={styles.input}
          placeholder={`Edad de la mascota (${unidadEdad})`}
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
        />
        <Picker
          selectedValue={unidadEdad}
          onValueChange={(itemValue, itemIndex) => setUnidadEdad(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Años" value="años" />
          <Picker.Item label="Meses" value="meses" />
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Peso de la mascota (Kg)"
          value={peso}
          onChangeText={setPeso}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Cuentanos más sobre tu mascota"
          multiline
          numberOfLines={4}
          value={descripcion}
          onChangeText={setDescripcion}
        />
        <TouchableOpacity style={styles.registrarButton} onPress={registrarMascota}>
          <Text style={styles.registrarButtonText}>Registrar Mascota</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  registrarButton: {
    backgroundColor: '#2AC9FA',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  registrarButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default AñadirMascota;
