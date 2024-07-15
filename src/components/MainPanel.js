import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, BackHandler, ScrollView, ImageBackground, TextInput, Easing, FlatList, } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { PanResponder, Animated } from 'react-native';

const MainPanel = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredVeterinarias, setFilteredVeterinarias] = useState([]);
  const [filteredGuarderias, setFilteredGuarderias] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [foodProducts, setFoodProducts] = useState([]);
  const [accessoryProducts, setAccessoryProducts] = useState([]);
  const [allProductProducts, setProductProducts] = useState([]);
  const [veterinarias, setVeterinarias] = useState([]);
  const [guarderiasAdiestramiento, setGuarderiasAndAdiestramiento] = useState([]);

  // Función de búsqueda
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();

      setFilteredServices(services.filter(service => service.title.toLowerCase().includes(lowercasedQuery)));
      setFilteredProducts([
        ...foodProducts.filter(product => product.Nombre.toLowerCase().includes(lowercasedQuery)),
        ...accessoryProducts.filter(product => product.Nombre.toLowerCase().includes(lowercasedQuery)),
        ...allProductProducts.filter(product => product.Nombre.toLowerCase().includes(lowercasedQuery)),
      ]);
      setFilteredVeterinarias(veterinarias.filter(vet => vet.Nombre.toLowerCase().includes(lowercasedQuery)));
      setFilteredGuarderias(guarderiasAdiestramiento.filter(guarderia => guarderia.Nombre.toLowerCase().includes(lowercasedQuery)));
    } else {
      setFilteredServices([]);
      setFilteredProducts([]);
      setFilteredVeterinarias([]);
      setFilteredGuarderias([]);
    }
  }, [searchQuery, foodProducts, accessoryProducts, allProductProducts, veterinarias, guarderiasAdiestramiento]);



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
      
      { id: 4, title: 'Seguro para tu mascota', image: require('./imagenes/seguro.jpg'), route: 'proximamente' },
      { id: 5, title: 'Servicios Funebres', image: require('./imagenes/Premium.jpg'), route: 'ServicioFuneraria' },
      { id: 6, title: 'Contáctanos', image: require('./imagenes/contacto.jpg'), route: 'Contactanos' },
    ];

    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate(item.route)}
      >
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
    );

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
    const intervalId = setInterval(() => {
      setCurrentServiceIndex(prevIndex => (prevIndex + 1) % services.length);
    }, 8000);

    return () => clearInterval(intervalId);
  }, [services.length]);

  
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
          const { dx } = gestureState;
          slideAnim.setValue(dx);
        },
        onPanResponderRelease: (evt, gestureState) => {
          const { dx } = gestureState;
          if (Math.abs(dx) > 50) {
            if (dx > 0) {
              setCurrentServiceIndex(prevIndex => (prevIndex === 0 ? services.length - 1 : prevIndex - 1));
            } else {
              setCurrentServiceIndex(prevIndex => (prevIndex + 1) % services.length);
            }
          }
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      })
    ).current;
  



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
      if (productType === 'comida') {
        navigation.navigate('vet1comida', { productId, vetId });
      } else {
        let route = '';
        switch (productType) {
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
      }
    };
    

    const handleVetPress = (vetId) => {
      navigation.navigate('verveterinarias', { veterinariaId: vetId });
    };

    const handleGuarderiaAdiestramientoPress = (id) => {
      const route = `Adieguar${id}`;
      navigation.navigate(route);
    };

   
    return (
      <ImageBackground source={require('./imagenes/fondomain.jpg')} style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={[styles.container, styles.scrollViewContainer]}>
          <View style={styles.headerContainer}>
            <Image source={require('./imagenes/fondoperfil.jpg')} style={styles.headerImage} />
            <View style={styles.profileIconContainer}></View>
          </View>
  
          {services.length > 0 && (
            <View style={styles.serviceCardContainer}>
              <ScrollView horizontal={true}>
                {services.map(service => (
                  <TouchableOpacity
                    key={service.id}
                    style={styles.serviceCard}
                    onPress={() => navigation.navigate(service.route)}
                  >
                    <ImageBackground source={service.image} style={styles.serviceImage}>
                      <Text style={styles.serviceTitle}>{service.title}</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
  
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>{tips[currentServiceIndex % tips.length].text}</Text>
          </View>
  
          <View style={styles.compraParaContainer}>
            <Text style={styles.compraParaText}>¿Para quién es la compra?</Text>
            <View style={styles.tarjetaContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('gato')} style={styles.tarjeta}>
                <View style={styles.tarjetaContent}>
                  <Image source={require('./imagenes/gato.jpg')} style={styles.tarjetaImage} />
                  <Text style={styles.tarjetaText}>Gato</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('perro')} style={styles.tarjeta}>
                <View style={styles.tarjetaContent}>
                  <Image source={require('./imagenes/perro.jpg')} style={styles.tarjetaImage} />
                  <Text style={styles.tarjetaText}>Perro</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
  
          <View style={styles.veterinariasContainer}>
            <View style={styles.veterinariasTitleContainer}>
              <Icon name="storefront-sharp" size={24} color="#E4784A" style={{ marginRight: 5 }} />
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
              <Icon name="storefront" size={24} color="#E4784A" style={{ marginRight: 5 }} />
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
  
          {/* Sección "Servicios Funebres" */}
          <View style={styles.productContainer}>
            <View style={styles.productTitleContainer}>
              <Icon name="home" size={24} color="#E4784A" style={{ marginRight: 5 }} />
              <Text style={styles.productTitle}>Servicios Funebres y Otros</Text>
            </View>
            <ScrollView horizontal={true}>
              <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate('ServicioFuneraria')}>
                <Image source={require('./imagenes/Premium.jpg')} style={styles.productImage} />
                <Text style={styles.productName}>Servicio Funerario y otros </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
  
          {/* Sección "Seguro para tu Mascota" */}
          <View style={styles.productContainer}>
            <View style={styles.productTitleContainer}>
              <Icon name="home" size={24} color="#E4784A" style={{ marginRight: 5 }} />
              <Text style={styles.productTitle}>Seguro para tu Mascota</Text>
            </View>
            <ScrollView horizontal={true}>
              <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate('proximamente')}>
                <Image source={require('./imagenes/seguro.jpg')} style={styles.productImage} />
                <Text style={styles.productName}>Seguro para Mascotas</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
  
          {/* Añadir un View vacío para espacio extra al final */}
          <View style={styles.footerSpacing} />
        </ScrollView>
  
        {/* Barra de perfil */}
        <View style={styles.profileBar}>
          <TouchableOpacity onPress={() => navigation.navigate('MiPerfil')} style={styles.profileButton}>
            <Icon name="person" size={30} color="#000" />
            <Text style={styles.profileButtonText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('pago')} style={styles.profileButton}>
            <Icon name="cart" size={30} color="#000" />
            <Text style={styles.profileButtonText}>Carrito</Text>
          </TouchableOpacity>
  
          <TouchableOpacity onPress={() => navigation.navigate('Contactanos')} style={styles.profileButton}>
            <Icon name="paw" size={30} color="#000" />
            <Text style={styles.profileButtonText}>Contactanos</Text>
          </TouchableOpacity>
  
        </View>
      </ImageBackground>
    );
  };
  
  const styles = StyleSheet.create({
  
    footerSpacing: {
      height: 100, // Ajusta esta altura según sea necesario para asegurar que el contenido no sea cubierto
    },
  
    otrosCard: {
      width: 150,
      marginHorizontal: 5,
      backgroundColor: '#ffffff',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginBottom: 10,
    },
    otrosImage: {
      width: 150,
      height: 100,
      resizeMode: 'cover',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    otrosName: {
      fontSize: 14,
      marginTop: 5,
      marginBottom: 5,
      paddingHorizontal: 10,
      color: '#000000',
      fontFamily: 'Roboto',
    },
    otrosContainer: {
      marginVertical: 10,
    },
    otrosTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    otrosTitle: {
      fontSize: 20,
      paddingHorizontal: 10,
      marginBottom: 5,
      color: '#ffffff',
      fontFamily: 'Roboto',
      textShadowColor: '#000000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 3,
    },
    container: {
      flexGrow: 1,
      fontFamily: 'Roboto',
    },
    headerContainer: {
      position: 'relative',
    },
    headerImage: {
      width: '100%',
      height: 150,
    },
    searchContainer: {
      padding: 10,
    },
    searchInput: {
      height: 40,
      paddingHorizontal: 10,
      color: '#000000',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Roboto',
    },
  
  
    serviceCardContainer: {
      alignItems: 'center',
      paddingHorizontal: 20, // Ajusta el margen horizontal para separar las tarjetas de los lados
    },
  
    serviceCard: {
      width: 250, // Ajusta el ancho de la tarjeta
      height: 250, // Ajusta la altura de la tarjeta
      marginHorizontal: 10, // Margen horizontal entre tarjetas
      marginBottom: 10, // Margen inferior para separar las tarjetas del contenido debajo
    },
  
    serviceImage: {
      width: '100%',
      height: '100%', // Ajusta la altura de la imagen para llenar el contenedor de la tarjeta
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10, // Añade bordes redondeados a la imagen de la tarjeta
      overflow: 'hidden', // Asegura que el contenido de la imagen no se desborde
    },
  
    serviceTitle: {
      fontSize: 24,
      color: '#fff',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      fontFamily: 'Roboto',
      paddingVertical: 10, // Añade un espacio vertical al texto dentro de la tarjeta
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Añade un fondo semitransparente al texto para mayor legibilidad
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
      fontFamily: 'Roboto',
    },
    productContainer: {
      marginVertical: 10,
    },
    productTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    productTitle: {
      fontSize: 20,
      paddingHorizontal: 10,
      marginBottom: 5,
      color: '#ffffff',
      fontFamily: 'Roboto',
      textShadowColor: '#000000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 3,
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
      fontFamily: 'Roboto',
    },
    productPrice: {
      fontSize: 12,
      color: '#666666',
      marginBottom: 5,
      fontFamily: 'Roboto',
    },
    veterinariasContainer: {
      marginVertical: 10,
    },
    veterinariasTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    veterinariasTitle: {
      fontSize: 20,
      paddingHorizontal: 10,
      marginBottom: 5,
      color: '#ffffff',
      fontFamily: 'Roboto',
      textShadowColor: '#000000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 3,
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
      fontFamily: 'Roboto',
    },
    guarderiasAdiestramientoContainer: {
      marginVertical: 10,
    },
    guarderiasAdiestramientoTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    guarderiasAdiestramientoTitle: {
      fontSize: 20,
      paddingHorizontal: 10,
      marginBottom: 5,
      color: '#ffffff',
      fontFamily: 'Roboto',
      textShadowColor: '#000000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 3,
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
      fontFamily: 'Roboto',
    },
    profileBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#ffffff',  // Cambiado a blanco
      flexDirection: 'row',
      justifyContent: 'space-around',  // Alinea los íconos equitativamente en la barra
      paddingVertical: 1,  // Reducir el padding vertical
    },
    profileButton: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileButtonText: {
      fontSize: 10,  // Reducir el tamaño del texto
      color: '#000',  // Cambiado a negro para mejor visibilidad sobre fondo blanco
      marginTop: 1,  // Reducir el margen superior para separar el texto del icono
      fontFamily: 'Roboto',
    },
    verTodoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 'auto', // Esto alinea el contenedor al lado derecho del contenedor padre
      marginRight: 10, // Agrega un margen derecho para separar el texto del borde derecho
    },
    verTodo: {
      color: '#000', // Color de texto negro
      marginRight: 5, // Margen derecho para separar el texto del icono
    },
  
    compraParaContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    compraParaText: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 15,
      color: '#333',
      textAlign: 'center',
    },
    tarjetaContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      width: '100%',
      marginTop: 20, // Añadido margen superior para separar las tarjetas del contenido anterior
    },
    tarjeta: {
      alignItems: 'center',
      width: '48%',
      borderRadius: 15,
      backgroundColor: '#f7f7f7',
      elevation: 5,
      padding: 10,
    },
    tarjetaContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    tarjetaImage: {
      width: 120,
      height: 120,
      borderRadius: 15,
      marginBottom: 10,
    },
    tarjetaText: {
      fontSize: 16,
      color: '#444',
      textAlign: 'center',
    },
    
  });
  
  export default MainPanel;