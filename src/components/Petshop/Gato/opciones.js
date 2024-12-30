import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import storage from '@react-native-firebase/storage'; // Importar para trabajar con Firebase Storage

const Opciones = ({ route, navigation }) => {
  const { opcionSeleccionada } = route.params;
  const [opciones, setOpciones] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const obtenerOpciones = async (tarjeta) => {
      try {
        let imageUrls = [];
        
        switch (tarjeta) {
          case 'Alimento':
            imageUrls = [
              { nombre: 'Humedo', tipoColeccion: tarjeta, imagenRef: 'gato/comidahumeda.png' },
              { nombre: 'Concentrado', tipoColeccion: tarjeta, imagenRef: 'gato/alimentoconcentradogatos.jpg' },
            ];
            break;
          case 'Snacks':
            imageUrls = [
              { nombre: 'Cremosos', tipoColeccion: tarjeta, imagenRef: 'gato/cremososgatos.jpg' },
              { nombre: 'Galletas', tipoColeccion: tarjeta, imagenRef: 'gato/galletasgatos.jpg' },
            ];
            break;
          case 'Juguetes':
            imageUrls = [
              { nombre: 'Interactivos', tipoColeccion: tarjeta, imagenRef: 'gato/interactivos.png' },
              { nombre: 'Peluches y pelotas', tipoColeccion: tarjeta, imagenRef: 'gato/alimento.jpg' },
              { nombre: 'Rascadores', tipoColeccion: tarjeta, imagenRef: 'gato/alimento.jpg' },
            ];
            break;
          case 'Higiene':
            imageUrls = [
              { nombre: 'Cepillos y peines', tipoColeccion: tarjeta, imagenRef: 'gato/alimento.jpg' },
              { nombre: 'Cuidado Oral', tipoColeccion: tarjeta, imagenRef: 'gato/alimento.jpg' },
              { nombre: 'Shampoos', tipoColeccion: tarjeta, imagenRef: 'gato/alimento.jpg' },
            ];
            break;
          case 'Arena':
            imageUrls = [
              { nombre: 'Arenas', tipoColeccion: tarjeta, imagenRef: 'gato/arenagatos2.jpg' },
            ];
            break;
          case 'Accesorios':
            imageUrls = [
              { nombre: 'Arneses', tipoColeccion: tarjeta, imagenRef: 'gato/arneses.png' },
              { nombre: 'Collares', tipoColeccion: tarjeta, imagenRef: 'gato/collares.jpg' },
            ];
            break;
          default:
            imageUrls = [];
            break;
        }

        // Obtención de las URLs desde Firebase Storage
        const opcionesConImagenes = await Promise.all(
          imageUrls.map(async (opcion) => {
            const url = await storage().ref(opcion.imagenRef).getDownloadURL();
            return { ...opcion, imagen: url };
          })
        );
        
        setOpciones(opcionesConImagenes);
        setLoading(false); // Cuando se obtienen las imágenes, se cambia el estado de carga
      } catch (error) {
        console.error('Error fetching images from Firebase:', error);
        setLoading(false);
      }
    };

    obtenerOpciones(opcionSeleccionada);
  }, [opcionSeleccionada]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../imagenes/fondoperfil.jpg')}
        style={styles.headerImage}
      />
      <Text style={styles.title}>Opciones para {opcionSeleccionada}</Text>
      <View style={styles.opcionesContainer}>
        {loading ? (
          <Text>Cargando opciones...</Text> // Indicador de carga
        ) : (
          opciones.map((opcion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.opcionCard}
              onPress={() => navigation.navigate('verproductos', { tipoColeccion: opcion.tipoColeccion, tipoAlimento: opcion.nombre })}
            >
              <Image
                source={{ uri: opcion.imagen }}
                style={styles.opcionImage}
              />
              <Text style={styles.opcionText}>{opcion.nombre}</Text>
            </TouchableOpacity>
          ))
        )}
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
    color: '#000',
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
    shadowOffset: { width: 0, height: 2 },
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
    color: '#000',
  },
});

export default Opciones;
