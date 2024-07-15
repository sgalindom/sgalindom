import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

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
      const mascotasRef = firestore().collection(`usuarios/${userEmail}/mascotas`);

      try {
        const ultimaMascota = await mascotasRef.orderBy('id', 'desc').limit(1).get();
        const ultimoID = ultimaMascota.docs.length > 0 ? ultimaMascota.docs[0].data().id : 0;
        
        const nuevoID = ultimoID + 1;

        const nuevaMascota = {
          id: nuevoID,
          nombre: nombre,
          raza: raza,
          edad: unidadEdad === 'años' ? Number(edad) : `(${Number(edad)} meses)`,
          peso: peso,
          descripcion: descripcion,
          tipo: tipoMascota,
        };

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
      source={require('../imagenes/fondomain.jpg')}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Conozcamos a tu mascota</Text>
        <View style={styles.inputContainer}>
          <Icon name="paw" size={20} color="#FF6F61" style={styles.icon} />
          <Picker
            selectedValue={tipoMascota}
            onValueChange={(itemValue) => setTipoMascota(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Perro" value="perro" />
            <Picker.Item label="Gato" value="gato" />
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#FF6F61" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre de la mascota"
            value={nombre}
            onChangeText={setNombre}
            placeholderTextColor="#666"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="book" size={20} color="#FF6F61" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Raza de la mascota"
            value={raza}
            onChangeText={setRaza}
            placeholderTextColor="#666"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="calendar" size={20} color="#FF6F61" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder={`Edad de la mascota (${unidadEdad})`}
            value={edad}
            onChangeText={setEdad}
            keyboardType="numeric"
            placeholderTextColor="#666"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="clock-o" size={20} color="#FF6F61" style={styles.icon} />
          <Picker
            selectedValue={unidadEdad}
            onValueChange={(itemValue) => setUnidadEdad(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Años" value="años" />
            <Picker.Item label="Meses" value="meses" />
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <Icon name="balance-scale" size={20} color="#FF6F61" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Peso de la mascota (Kg)"
            value={peso}
            onChangeText={setPeso}
            keyboardType="numeric"
            placeholderTextColor="#666"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="comment" size={20} color="#FF6F61" style={styles.icon} />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Cuentanos más sobre tu mascota"
            multiline
            numberOfLines={4}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholderTextColor="#666"
          />
        </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  icon: {
    marginRight: 10,
  },
  registrarButton: {
    backgroundColor: '#FF6F61',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  registrarButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default AñadirMascota;
