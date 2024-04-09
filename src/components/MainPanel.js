import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, BackHandler, ScrollView, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const MainPanel = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userEmail = user.email;

          const userDocs = await firestore()
            .collection('usuarios')
            .doc(userEmail)
            .collection('datos')
            .get();

          if (!userDocs.empty) {
            const docId = userDocs.docs[0].id;

            const userDoc = await firestore()
              .collection('usuarios')
              .doc(userEmail)
              .collection('datos')
              .doc(docId) 
              .get();

            if (userDoc.exists) {
              const userData = userDoc.data();
              const nombreCompleto = userData?.nombreCompleto || 'usuario';
              setUserName(nombreCompleto);
            } else {
              console.log('No se encontró el documento con el ID:', docId);
            }
          } else {
            console.log('No se encontraron documentos en la colección "datos".');
          }
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario', error);
      }
    };

    fetchUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (navigation.isFocused()) {
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        backHandler.remove();
      };
    }, [navigation])
  );

  const services = [
    { id: 1, title: 'Veterinarias y Pets Shops', image: require('./imagenes/Veterinario.jpg'), route: 'bveterinaria' },
    { id: 2, title: 'Paseos', image: require('./imagenes/paseos.jpg'), route: 'proximamente' },
    { id: 3, title: 'Adiestramiento', image: require('./imagenes/adiestramiento.jpg'), route: 'proximamente' },
    { id: 4, title: 'Contáctanos', image: require('./imagenes/contacto.jpg'), route: 'Contactanos' },
  ];

  const tips = [
    { id: 1, text: 'Consejo 1: Mantén a tu mascota hidratada en todo momento.' },
    { id: 2, text: 'Consejo 2: Asegúrate de que tu mascota haga ejercicio regularmente.' },
    { id: 3, text: 'Consejo 3: Proporciona a tu mascota una alimentación equilibrada.' },
    { id: 4, text: 'Consejo 4: Realiza visitas veterinarias de forma periódica.' },
    { id: 5, text: 'Consejo 5: Cuida la higiene de tu mascota regularmente.' },
    { id: 6, text: 'Consejo 6: Identifica a tu mascota con collar y microchip.' },
    { id: 7, text: 'Consejo 7: Dedica tiempo al entrenamiento y socialización.' },
    { id: 8, text: 'Consejo 8: Proporciona un ambiente seguro en tu hogar.' },
    { id: 9, text: 'Consejo 9: Brinda juguetes interactivos para estimular a tu mascota.' },
    { id: 10, text: 'Consejo 10: Asegúrate de que tu mascota descanse adecuadamente.' },
    { id: 11, text: 'Consejo 11: Estimula mentalmente a tu mascota con juegos y desafíos.' },
    { id: 12, text: 'Consejo 12: Fomenta la interacción social con otras mascotas.' },
    { id: 13, text: 'Consejo 13: Supervisa a tu mascota al aire libre para prevenir riesgos.' },
  ];

  const handleServicePress = (serviceTitle) => {
    const service = services.find((s) => s.title === serviceTitle);
    if (service) {
      navigation.navigate(service.route);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [tips]);

  return (
    <ImageBackground source={require('./imagenes/fondomain.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.curvedContainer}>
          <Text style={styles.greetingText}>¡Hola, {userName}!</Text>
          <Text style={styles.title}>Bienvenido a Pet Services</Text>
          <Text style={styles.helpText}>¿En qué podemos ayudarte hoy?</Text>
        </View>

        <ScrollView style={styles.scrollContainer}>
          <View style={styles.servicesContainer}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => handleServicePress(service.title)}
              >
                <Image source={service.image} style={styles.serviceImage} />
                <Text style={styles.serviceTitle}>{service.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipText}>{tips[currentTipIndex].text}</Text>
          </View>
        </ScrollView>

        {/* Barra de perfil en la parte inferior */}
        <TouchableOpacity
          style={styles.profileBar}
          onPress={() => navigation.navigate('MiPerfil')}
        >
          <Text style={styles.profileText}>MI PERFIL</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)', // Ajusta la opacidad del fondo del contenido
    padding: 16,
  },
  curvedContainer: {
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#2F9FFA',
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    width: '100%',
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
    textAlign: 'center',
  },
  helpText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
    textAlign: 'center',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  serviceCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 5,
    alignItems: 'center',
  },
  serviceImage: {
    height: 150,
    width: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'normal', // Cambiado a normal para hacerlo más delgado
    marginVertical: 8,
    color: 'black',
  },
  tipCard: {
    backgroundColor: '#2F9FFA',
    borderRadius: 16,
    marginBottom: 24,
    padding: 24,
    elevation: 5,
  },
  tipText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
    textAlign: 'center',
  },
  profileBar: {
    backgroundColor: 'white',
    paddingVertical: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'normal', // Cambiado a normal para hacerlo más delgado
    color: 'black', // Cambiado a negro
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default MainPanel;
