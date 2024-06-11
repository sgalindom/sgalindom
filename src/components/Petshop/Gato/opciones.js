import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Opciones = ({ route, navigation }) => {
  const { opcionSeleccionada } = route.params;

  const obtenerOpciones = (tarjeta) => {
    switch (tarjeta) {
      case 'Alimento':
        return [
          { nombre: 'Humedo', imagen: require('../../imagenes/alimento.jpg'), tipoColeccion: tarjeta },
          { nombre: 'Concentrado', imagen: require('../../imagenes/alimento.jpg'), tipoColeccion: tarjeta }
        ];
      case 'Snacks':
        return [
          { nombre: 'Cremosos', imagen: require('../../imagenes/alimento.jpg'), tipoColeccion: tarjeta },
          { nombre: 'Galletas', imagen: require('../../imagenes/alimento.jpg'), tipoColeccion: tarjeta }
        ];
      case 'Juguetes':
        return [
          { nombre: 'Interactivos', imagen: require('../../imagenes/alimento.jpg'), tipoColeccion: tarjeta },
          { nombre: 'Peluches y pelotas', imagen: require('../../imagenes/alimento.jpg'), tipoColeccion: tarjeta },
          { nombre: 'Rascadores', imagen: require('../../imagenes/alimento.jpg'), tipoColeccion: tarjeta }
        ];
      case 'Higiene':
        return [
          { nombre: 'Cepillos y peines', imagen: require('../../imagenes/alimento.jpg'), tipoColeccion: tarjeta },
          { nombre: 'Cuidado Oral', imagen: require('../../imagenes/alimento.jpg'), tipoColeccion: tarjeta },
          { nombre: 'Shampoos', imagen: require('../../imagenes/alimento.jpg'), tipoColeccion: tarjeta }
        ];
      case 'Arena':
        return [
          { nombre: 'Arenas', imagen: require('../../imagenes/alimento.jpg'), tipoColeccion: tarjeta }
        ];
      case 'Accesorios':
        return [
          { nombre: 'Arneses', imagen: require('../../imagenes/alimento.jpg'), tipoColeccion: tarjeta },
          { nombre: 'Collares', imagen: require('../../imagenes/alimento.jpg'), tipoColeccion: tarjeta }
        ];
      default:
        return [];
    }
  };

  const opciones = obtenerOpciones(opcionSeleccionada);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../imagenes/fondoperfil.jpg')}
        style={styles.headerImage}
      />
      <Text style={styles.title}>Opciones para {opcionSeleccionada}</Text>
      <View style={styles.opcionesContainer}>
        {opciones.map((opcion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.opcionCard}
            onPress={() => navigation.navigate('verproductos', { tipoColeccion: opcion.tipoColeccion, tipoAlimento: opcion.nombre })}
          >
            <Image
              source={opcion.imagen}
              style={styles.opcionImage}
            />
            <Text style={styles.opcionText}>{opcion.nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerImage: {
    width: '100%',
    height: 150,
  },
  title: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  opcionesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  opcionCard: {
    width: '45%',
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  opcionImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  opcionText: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default Opciones;
