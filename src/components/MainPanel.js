  import React, { useEffect, useState, useRef } from 'react';
  import { View, Text, Image, StyleSheet, TouchableOpacity, BackHandler, ScrollView, ImageBackground, TextInput, Animated, Easing } from 'react-native';
  import { useFocusEffect } from '@react-navigation/native';
  import auth from '@react-native-firebase/auth';
  import firestore from '@react-native-firebase/firestore';
  import Icon from 'react-native-vector-icons/Ionicons';
  


  const MainPanel = ({ navigation }) => {
    const [userName, setUserName] = useState('');
    const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const slideAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [foodProducts, setFoodProducts] = useState([]);
    const [accessoryProducts, setAccessoryProducts] = useState([]);
    const [allProductProducts, setProductProducts] = useState([]);
    const [veterinarias, setVeterinarias] = useState([]);
    const [guarderiasAdiestramiento, setGuarderiasAndAdiestramiento] = useState([]);

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
      { id: 7, text: 'Consejo 7: Dedica tiempo al entrenamiento y socialización.' },
      { id: 8, text: 'Consejo 8: Proporciona un ambiente seguro en tu hogar.' },
      { id: 9, text: 'Consejo 9: Brinda juguetes interactivos para estimular a tu mascota.' },
      { id: 10, text: 'Consejo 10: Asegúrate de que tu mascota descanse adecuadamente.' },
      { id: 11, text: 'Consejo 11: Estimula mentalmente a tu mascota con juegos y desafíos.' },
      { id: 12, text: 'Consejo 12: Fomenta la interacción social con otras mascotas.' },
      { id: 13, text: 'Consejo 13: Supervisa a tu mascota al aire libre para prevenir riesgos.' },
    ];
    
    useEffect(() => {
      if (services.length > 0) {
        const intervalId = setInterval(() => {
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 100, // Reduje la duración de la animación de desvanecimiento a 100ms
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: -300,
              duration: 500, // Reduje la duración del desplazamiento a 500ms
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
            Animated.timing(slideAnim, {
              toValue: 300,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 500, // Reduje la duración del desplazamiento a 500ms
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 100, // Reduje la duración de la animación de desvanecimiento a 100ms
              useNativeDriver: true,
            }),
          ]).start();
    
          setTimeout(() => {
            setCurrentServiceIndex(prevIndex => (prevIndex + 1) % services.length);
          }, 1000); // Reduje el tiempo entre cada cambio de servicio a 1000ms (1 segundo)
        }, 8000); // Mantuve el tiempo total entre cada cambio de servicio a 8 segundos
    
        return () => clearInterval(intervalId);
      }
    }, [slideAnim, fadeAnim, services.length]);

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const foodProductsRefs = [1, 2, 3].map(async (vetId) => {
            const vetFoodProductsRef = firestore()
              .collection('Veterinarias')
              .doc(vetId.toString())
              .collection('Comida');
    
            const snapshot = await vetFoodProductsRef.get();
    
            return snapshot.docs.map(doc => ({
              id: doc.id,
              vetId: vetId,
              ...doc.data(),
            }));
          });
    
          const foodProductsData = await Promise.all(foodProductsRefs);
          const allFoodProducts = foodProductsData.reduce((acc, val) => acc.concat(val), []);
          setFoodProducts(allFoodProducts);
    
          const accessoryProductsRefs = [1, 2, 3].map(async (vetId) => {
            const vetAccessoryProductsRef = firestore()
              .collection('Veterinarias')
              .doc(vetId.toString())
              .collection('Accesorios');
    
            const snapshot = await vetAccessoryProductsRef.get();
    
            return snapshot.docs.map(doc => ({
              id: doc.id,
              vetId: vetId,
              ...doc.data(),
            }));
          });
    
          const accessoryProductsData = await Promise.all(accessoryProductsRefs);
          const allAccessoryProducts = accessoryProductsData.reduce((acc, val) => acc.concat(val), []);
          setAccessoryProducts(allAccessoryProducts);
    
          const productProductsRefs = [1, 2, 3].map(async (vetId) => {
            const vetProductProductsRef = firestore()
              .collection('Veterinarias')
              .doc(vetId.toString())
              .collection('Productos');
    
            const snapshot = await vetProductProductsRef.get();
    
            return snapshot.docs.map(doc => ({
              id: doc.id,
              vetId: vetId,
              ...doc.data(),
            }));
          });
    
          const productProductsData = await Promise.all(productProductsRefs);
          const allProductProducts = productProductsData.reduce((acc, val) => acc.concat(val), []);
          setProductProducts(allProductProducts);
    
          const veterinariasRef = firestore().collection('Veterinarias');
          const veterinariasSnapshot = await veterinariasRef.get();
    
          const allVeterinarias = veterinariasSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
    
          setVeterinarias(allVeterinarias);
        } catch (error) {
          console.error('Error fetching products', error);
        }
      };
    
      const fetchGuarderiasAndAdiestramiento = async () => {
        try {
          const guarderiasAndAdiestramientoRefs = [1, 2, 3].map(async (id) => {
            const guarderiasAndAdiestramientoRef = firestore()
              .collection('Guarderiasyadiestramiento')
              .doc(id.toString());
    
            const snapshot = await guarderiasAndAdiestramientoRef.get();
    
            return snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null;
          });
    
          const guarderiasAndAdiestramientoData = await Promise.all(guarderiasAndAdiestramientoRefs);
    
          // Filtrar elementos nulos (documentos que no existen)
          const filteredData = guarderiasAndAdiestramientoData.filter(item => item !== null);
    
          setGuarderiasAndAdiestramiento(filteredData);
        } catch (error) {
          console.error('Error fetching guarderias and adiestramiento data:', error);
        }
      };
    
      fetchProducts();
      fetchGuarderiasAndAdiestramiento();
    }, []);
    

    const handleProductPress = (productId, vetId, productType) => {
      let route = '';
      switch (productType) {
        case 'comida':
          route = vetId === 1 ? 'vet1comida' : vetId === 2 ? 'vet2comida' : 'vet3comida';
          break;
        case 'accesorios':
          route = vetId === 1 ? 'vet1accesorios' : vetId === 2 ? 'vet2accesorios' : 'vet3accesorios';
          break;
        case 'productos':
          route = vetId === 1 ? 'vet1juguetes' : vetId === 2 ? 'vet2productos' : 'vet3productos';
          break;
        default:
          console.error('Tipo de producto no reconocido');
          break;
      }

      if (route !== '') {
        navigation.navigate(route);
      } else {
        console.error('Ruta de navegación no válida');
      }
    };

    const handleVetPress = (vetId) => {
      const route = `vet${vetId}`;
      navigation.navigate(route);
    };

    const handleGuarderiaAdiestramientoPress = (id) => {
      const route = `Adieguar${id}`;
      navigation.navigate(route);
    };
    

    const slide = slideAnim.interpolate({
      inputRange: [-300, 0, 300],
      outputRange: [-300, 0, 300],
    });

    return (
      <ImageBackground source={require('./imagenes/fondomain.jpg')} style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerContainer}>
            <Image source={require('./imagenes/fondoperfil.jpg')} style={styles.headerImage} />
            {/* Ícono de perfil en la esquina superior izquierda de la imagen */}
            <View style={styles.profileIconContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('MiPerfil')}>
                <View style={styles.profileIconCircle}>
                  <Icon name="person" size={30} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
    
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="¿En qué podemos ayudarte hoy?"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#000000"
            />
          </View>
    
          {services.length > 0 && (
            <View style={styles.serviceCardContainer}>
              <Animated.View style={[styles.serviceContainer, { transform: [{ translateY: slideAnim }], opacity: fadeAnim }]}>
                <TouchableOpacity onPress={() => navigation.navigate(services[currentServiceIndex].route)}>
                  <ImageBackground source={services[currentServiceIndex].image} style={styles.serviceImage}>
                    <Text style={styles.serviceTitle}>{services[currentServiceIndex].title}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
    
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>{tips[currentServiceIndex % tips.length].text}</Text>
          </View>
    
          {/* Productos de comida */}
          <View style={styles.productContainer}>
            <View style={styles.productTitleContainer}>
              <Icon name="cart" size={24} color="#000" style={{ marginRight: 5 }} />
            <Text style={styles.productTitle}>Productos de Comida</Text>
          </View>
            <ScrollView horizontal={true}>
             {foodProducts.map(product => (
              <TouchableOpacity key={product.id} style={styles.productCard} onPress={() => handleProductPress(product.id, product.vetId, 'comida')}>
                  <Image source={{ uri: product.Foto }} style={styles.productImage} />
                    <Text style={styles.productName}>{product.Nombre}</Text>
                    <Text style={styles.productPrice}>${product.Precio}</Text>
              </TouchableOpacity>
               ))}
            </ScrollView>
          </View>

          <View style={styles.productContainer}>
            <View style={styles.productTitleContainer}>
              <Icon name="cart" size={24} color="#000" style={{ marginRight: 5 }} />
              <Text style={styles.productTitle}>Productos de Accesorios</Text>
            </View>
            <ScrollView horizontal={true}>
              {accessoryProducts.map(product => (
                <TouchableOpacity key={product.id} style={styles.productCard} onPress={() => handleProductPress(product.id, product.vetId, 'accesorios')}>
                  <Image source={{ uri: product.Foto }} style={styles.productImage} />
                  <Text style={styles.productName}>{product.Nombre}</Text>
                  <Text style={styles.productPrice}>${product.Precio}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.productContainer}>
            <View style={styles.productTitleContainer}>
              <Icon name="cart" size={24} color="#000" style={{ marginRight: 5 }} />
              <Text style={styles.productTitle}>Productos</Text>
            </View>
            <ScrollView horizontal={true}>
              {allProductProducts.map(product => (
                <TouchableOpacity key={product.id} style={styles.productCard} onPress={() => handleProductPress(product.id, product.vetId, 'productos')}>
                  <Image source={{ uri: product.Foto }} style={styles.productImage} />
                  <Text style={styles.productName}>{product.Nombre}</Text>
                  <Text style={styles.productPrice}>${product.Precio}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.veterinariasContainer}>
            <View style={styles.veterinariasTitleContainer}>
              <Icon name="paw" size={24} color="#000" style={{ marginRight: 5 }} />
              <Text style={styles.veterinariasTitle}>Veterinarias</Text>
            </View>
            <ScrollView horizontal={true}>
              {veterinarias.map(vet => (
                <TouchableOpacity key={vet.id} style={styles.veterinariaCard} onPress={() => handleVetPress(vet.id)}>
                  <Image source={{ uri: vet.Foto }} style={styles.veterinariaImage} />
                  <Text style={styles.veterinariaName}>{vet.Nombre}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.guarderiasAdiestramientoContainer}>
            <View style={styles.guarderiasAdiestramientoTitleContainer}>
              <Icon name="home" size={24} color="#000" style={{ marginRight: 5 }} />
              <Text style={styles.guarderiasAdiestramientoTitle}>Guarderías y Adiestramiento</Text>
            </View>
            <ScrollView horizontal={true}>
              {guarderiasAdiestramiento.map(guarderia => (
                <TouchableOpacity key={guarderia.id} style={styles.guarderiaAdiestramientoCard} onPress={() => handleGuarderiaAdiestramientoPress(guarderia.id)}>
                  <Image source={{ uri: guarderia.Foto }} style={styles.guarderiaAdiestramientoImage} />
                  <Text style={styles.guarderiaAdiestramientoName}>{guarderia.Nombre}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      fontFamily: 'Roboto', // Aplicar la fuente Roboto
    },
    headerContainer: {
      position: 'relative',
    },
    headerImage: {
      width: '100%',
      height: 150,
    },
    profileIconContainer: {
      position: 'absolute',
      top: 20, // Ajusta la posición superior según sea necesario
      left: 20, // Ajusta la posición izquierda según sea necesario
      zIndex: 1, // Asegura que el botón esté sobre el contenido
      backgroundColor: '#2F9FFA', // Color de fondo vibrante
      borderRadius: 30,
      padding: 10,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    profileIconCircle: {
      backgroundColor: 'transparent',
      borderRadius: 30,
    },
    searchContainer: {
      padding: 10,
    },
    searchInput: {
      height: 40,
      paddingHorizontal: 10,
      color: '#000000',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Roboto', // Aplicar la fuente Roboto
    },
    serviceCardContainer: {
      alignItems: 'center',
    },
    serviceContainer: {
      width: '100%',
    },
    serviceImage: {
      width: '100%',
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
    },
    serviceTitle: {
      fontSize: 24,
      color: '#fff',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      fontFamily: 'Roboto', // Aplicar la fuente Roboto
    },
    tipCard: {
      backgroundColor: '#f9f9f9',
      padding: 15,
      borderRadius: 5,
      margin: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 2,
    },
    tipText: {
      fontSize: 16,
      textAlign: 'center',
      color: '#333',
      fontFamily: 'Roboto', // Aplicar la fuente Roboto
    },
    productContainer: {
      marginVertical: 10,
    },
    productTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    productTitleIcon: {
      marginRight: 5,
    },
    productTitle: {
      fontSize: 20,
      paddingHorizontal: 10,
      marginBottom: 5,
      color: '#000000',
      fontFamily: 'Roboto', // Aplicar la fuente Roboto
    },
    productCard: {
      width: 150,
      marginHorizontal: 5,
      backgroundColor: '#ffffff',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginBottom: 10,
      elevation: 2,
    },
    productImage: {
      width: 150,
      height: 100,
      resizeMode: 'cover',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    productName: {
      fontSize: 14,
      marginTop: 5,
      color: '#000000',
      fontFamily: 'Roboto', // Aplicar la fuente Roboto
    },
    productPrice: {
      fontSize: 12,
      color: '#666666',
      marginBottom: 5,
      fontFamily: 'Roboto', // Aplicar la fuente Roboto
    },
    veterinariasContainer: {
      marginVertical: 10,
    },
    veterinariasTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    veterinariasTitleIcon: {
      marginRight: 5,
    },
    veterinariasTitle: {
      fontSize: 20,
      paddingHorizontal: 10,
      marginBottom: 5,
      color: '#000000',
      fontFamily: 'Roboto', // Aplicar la fuente Roboto
    },
    veterinariaCard: {
      width: 150,
      marginHorizontal: 5,
      backgroundColor: '#ffffff',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginBottom: 10,
      elevation: 2,
    },
    veterinariaImage: {
      width: 150,
      height: 100,
      resizeMode: 'cover',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    veterinariaName: {
      fontSize: 14,
      marginTop: 5,
      color: '#000000',
      fontFamily: 'Roboto', // Aplicar la fuente Roboto
    },
    guarderiasAdiestramientoContainer: {
      marginVertical: 10,
    },
    guarderiasAdiestramientoTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    guarderiasAdiestramientoTitleIcon: {
      marginRight: 5,
    },
    guarderiasAdiestramientoTitle: {
      fontSize: 20,
      paddingHorizontal: 10,
      marginBottom: 5,
      color: 'black',
      fontFamily: 'Roboto', // Aplicar la fuente Roboto
    },
    guarderiaAdiestramientoCard: {
      width: 150,
      marginHorizontal: 5,
      backgroundColor: '#ffffff',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginBottom: 10,
      elevation: 2,
    },
    guarderiaAdiestramientoImage: {
      width: 150,
      height: 100,
      resizeMode: 'cover',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    guarderiaAdiestramientoName: {
      fontSize: 14,
      marginTop: 5,
      color: '#000000',
      fontFamily: 'Roboto', // Aplicar la fuente Roboto
    },
  });
  
  export default MainPanel;