import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, BackHandler, ScrollView, ImageBackground, TextInput, Animated, Easing } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const MainPanel = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;

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
    { id: 2, title: 'Paseos', image: require('./imagenes/paseos.jpg'), route: 'PaquetesPaseos' },
    { id: 3, title: 'Adiestramiento', image: require('./imagenes/adiestramiento.jpg'), route: 'badieguar' },
    { id: 4, title: 'Contáctanos', image: require('./imagenes/contacto.jpg'), route: 'Contactanos' },
  ];

  const tips = [
    { id: 1, text: 'Consejo 1: Mantén a tu mascota hidratada en todo momento.' },
    { id: 2, text: 'Consejo 2: Asegúrate de que tu mascota haga ejercicio regularmente.' },
    { id: 3, text: 'Consejo 3: Proporciona a tu mascota una alimentación equilibrada.' },
    { id: 4, text: 'Consejo 4: Realiza visitas veterinarias de forma periódica.' },
    { id: 5, text: 'Consejo 5: Cuida la higiene de tu mascota regularmente.' },
    { id: 6, text: 'Consejo 6: Identifica a tu mascota con collar y microchip.' },
    { id: 7, text: 'Dedica tiempo al entrenamiento y socialización.' },
    { id: 8, text: 'Proporciona un ambiente seguro en tu hogar.' },
    { id: 9, text: 'Brinda juguetes interactivos para estimular a tu mascota.' },
    { id: 10, text: 'Asegúrate de que tu mascota descanse adecuadamente.' },
    { id: 11, text: 'Estimula mentalmente a tu mascota con juegos y desafíos.' },
    { id: 12, text: 'Fomenta la interacción social con otras mascotas.' },
    { id: 13, text: 'Supervisa a tu mascota al aire libre para prevenir riesgos.' },
  ];

  useEffect(() => {
    if (services.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentServiceIndex(prevIndex => (prevIndex + 1) % services.length);
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }).start(() => {
          slideAnim.setValue(0);
        });
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [slideAnim, services.length]);

  const currentService = services[currentServiceIndex];

  const slide = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -300],
  });

  const handleServicePress = () => {
    navigation.navigate(currentService.route);
  };

  const comidaPanels = {
    1: 'vet1comida',
    2: 'vet2comida',
    3: 'vet3comida',
    4: 'vet4comida',
    5: 'vet5comida',
  };

  const juguetePanels = {
    1: 'vet1juguete',
    2: 'vet2juguete',
    3: 'vet3juguete',
    4: 'vet4juguete',
    5: 'vet5juguete',
  };

  const accesoriosPanels = {
    1: 'vet1accesorios',
    2: 'vet2accesorios',
    3: 'vet3accesorios',
    4: 'vet4accesorios',
    5: 'vet5accesorios',
  };

  const paseosPanels = {
    1: 'vet1paseos',
    2: 'vet2paseos',
    3: 'vet3paseos',
    4: 'vet4paseos',
    5: 'vet5paseos',
  };

  const adiestramientoPanels = {
    1: 'vet1adiestramiento',
    2: 'vet2adiestramiento',
    3: 'vet3adiestramiento',
    4: 'vet4adiestramiento',
    5: 'vet5adiestramiento',
  };

  const handleComidaPress = (index) => {
    const panelName = comidaPanels[index];
    navigation.navigate(panelName);
  };

  const handleJuguetePress = (index) => {
    const panelName = juguetePanels[index];
    navigation.navigate(panelName);
  };

  const handleAccesoriosPress = (index) => {
    const panelName = accesoriosPanels[index];
    navigation.navigate(panelName);
  };

  const handlePaseosPress = (index) => {
    const panelName = paseosPanels[index];
    navigation.navigate(panelName);
  };

  const handleAdiestramientoPress = (index) => {
    const panelName = adiestramientoPanels[index];
    navigation.navigate(panelName);
  };

  return (
    <ImageBackground source={require('./imagenes/fondomain.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={require('./imagenes/fondoperfil.jpg')} style={styles.headerImage} />
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="¿En qué podemos ayudarte hoy?"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {services.length > 0 && (
            <Animated.View style={[styles.serviceCard, { transform: [{ translateX: slide }] }]}>
              <TouchableOpacity onPress={handleServicePress}>
                <Image source={currentService.image} style={styles.serviceImage} />
                <Text style={styles.serviceTitle}>{currentService.title}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <View style={styles.tipCard}>
            <Text style={styles.tipText}>{tips[currentServiceIndex % tips.length].text}</Text>
          </View>

          <Text style={styles.sectionTitle}>Comida</Text>
          <ScrollView horizontal contentContainerStyle={styles.foodScrollContainer}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity key={index} onPress={() => handleComidaPress(index + 1)}>
                <View style={styles.foodCard}>
                  <Image source={require('./imagenes/comida.jpg')} style={styles.foodImage} />
                  <Text style={styles.foodTitle}>Comida</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Juguetes</Text>
          <ScrollView horizontal contentContainerStyle={styles.foodScrollContainer}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity key={index} onPress={() => handleJuguetePress(index + 1)}>
                <View style={styles.foodCard}>
                  <Image source={require('./imagenes/juguete-para-perro-puppis-con-sonido.png')} style={styles.foodImage} />
                  <Text style={styles.foodTitle}>Juguete</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Accesorios</Text>
          <ScrollView horizontal contentContainerStyle={styles.foodScrollContainer}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity key={index} onPress={() => handleAccesoriosPress(index + 1)}>
                <View style={styles.foodCard}>
                  <Image source={require('./imagenes/toypingui.jpg')} style={styles.foodImage} />
                  <Text style={styles.foodTitle}>Accesorios</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Paseos</Text>
          <ScrollView horizontal contentContainerStyle={styles.foodScrollContainer}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity key={index} onPress={() => handlePaseosPress(index + 1)}>
                <View style={styles.foodCard}>
                  <Image source={require('./imagenes/paseos.jpg')} style={styles.foodImage} />
                  <Text style={styles.foodTitle}>Paseos</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Adiestramiento</Text>
          <ScrollView horizontal contentContainerStyle={styles.foodScrollContainer}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity key={index} onPress={() => handleAdiestramientoPress(index + 1)}>
                <View style={styles.foodCard}>
                  <Image source={require('./imagenes/adiestramiento.jpg')} style={styles.foodImage} />
                  <Text style={styles.foodTitle}>Adiestramiento</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

        </ScrollView>

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
    flexGrow: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 16,
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 150,
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    margin: 16,
    elevation: 5,
    width: '90%',
  },
  searchInput: {
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCard: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 5,
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  serviceImage: {
    height: 100,
    width: '10%',
    resizeMode: 'cover',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'normal',
    marginVertical: 8,
    color: 'black',
    textAlign: 'center',
  },
  tipCard: {
    width: '90%',
    backgroundColor: '#2F9FFA',
    borderRadius: 8,
    marginBottom: 24,
    padding: 16,
    elevation: 5,
  },
  tipText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
    color: 'black',
  },
  foodScrollContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  foodCard: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  foodTitle: {
    fontSize: 16,
    fontWeight: 'normal',
    color: 'black',
    marginTop: 5,
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
    fontWeight: 'normal',
    color: 'black',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default MainPanel;
