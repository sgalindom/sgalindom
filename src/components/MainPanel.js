import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Animated, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window'); // Obtener el ancho de la pantalla

const MainPanel = ({ navigation }) => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0); // Índice de consejos
  const [foodProducts, setFoodProducts] = useState([]);
  const [accessoryProducts, setAccessoryProducts] = useState([]);
  const [allProductProducts, setProductProducts] = useState([]);
  const [veterinarias, setVeterinarias] = useState([]);
  const scrollViewRef = useRef(null); // Referencia al ScrollView de los servicios
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animación de opacidad

  const services = [
    { id: 1, title: 'Veterinarias y Pets Shops', image: require('./imagenes/Veterinario.jpg'), route: 'bveterinaria' },
    { id: 2, title: 'Paseos', image: require('./imagenes/paseos.jpg'), route: 'PaquetesPaseos' },
    { id: 3, title: 'Adiestramiento', image: require('./imagenes/adiestramiento.jpg'), route: 'badieguar' },
    { id: 4, title: 'Seguro para tu mascota', image: require('./imagenes/seguro.jpg'), route: 'proximamente' },
    { id: 5, title: 'Servicios Funebres', image: require('./imagenes/Premium.jpg'), route: 'ServicioFuneraria' },
    { id: 6, title: 'Contáctanos', image: require('./imagenes/contacto.jpg'), route: 'Contactanos' },
  ];

  const tips = [
    { id: 1, text: 'Mantén a tu mascota hidratada en todo momento.' },
    { id: 2, text: 'Proporciónale una dieta balanceada.' },
    { id: 3, text: 'Asegúrate de llevar a tu mascota al veterinario regularmente.' },
    { id: 4, text: 'Cepilla los dientes de tu mascota para mantener su salud dental.' },
    { id: 5, text: 'Ejercita a tu mascota diariamente para mantenerla en forma.' },
    { id: 6, text: 'Dale juguetes para estimular su mente y evitar el aburrimiento.' },
    { id: 7, text: 'Mantén su espacio limpio para prevenir enfermedades.' },
    { id: 8, text: 'Usa productos antipulgas y antigarrapatas según las recomendaciones.' },
    { id: 9, text: 'Asegúrate de tener su cartilla de vacunación al día.' },
    { id: 10, text: 'Enseña a tu mascota comandos básicos para su seguridad.' },
  ];

  // Rotación de servicios
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentServiceIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 6000); // Cambia la imagen cada 6 segundos

    return () => clearInterval(intervalId);
  }, [services.length]);

  // Rotación de consejos cada 3 segundos
  useEffect(() => {
    const tipIntervalId = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 3000);

    return () => clearInterval(tipIntervalId);
  }, [tips.length]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchCategoryProducts = async (category) => {
          const productRefs = [1, 2, 3].map(async (vetId) => {
            const vetProductsRef = firestore()
              .collection('Veterinarias')
              .doc(vetId.toString())
              .collection(category);

            const snapshot = await vetProductsRef.get();
            return snapshot.docs.map((doc) => ({
              id: doc.id,
              vetId: vetId,
              ...doc.data(),
            }));
          });

          const productsData = await Promise.all(productRefs);
          return productsData.reduce((acc, val) => acc.concat(val), []);
        };

        setFoodProducts(await fetchCategoryProducts('Comida'));
        setAccessoryProducts(await fetchCategoryProducts('Accesorios'));
        setProductProducts(await fetchCategoryProducts('Productos'));

        const veterinariasRef = firestore().collection('Veterinarias');
        const veterinariasSnapshot = await veterinariasRef.get();
        setVeterinarias(
          veterinariasSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleVetPress = (vetId) => {
    if (vetId === veterinarias[0].id) {
      navigation.navigate('vet1', { veterinariaId: vetId });
    } else {
      navigation.navigate('verveterinarias', { veterinariaId: vetId });
    }
  };

 

  return (
    <View style={styles.backgroundContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('./imagenes/fondoperfil.jpg')} style={styles.logoImage} />
        </View>

        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>¡Encuentra todo lo que tu mejor amigo necesita!</Text>
        </View>

        {/* Carrusel de Servicios con animación */}
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContainer}
        >
          {services.map((service, index) => (
            <Animated.View key={service.id} style={[styles.serviceCard, { opacity: fadeAnim }]}>
              <TouchableOpacity onPress={() => navigation.navigate(service.route)}>
                <ImageBackground source={service.image} style={styles.serviceImage}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                </ImageBackground>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.ScrollView>

        {/* Indicadores del carrusel */}
        <View style={styles.indicatorContainer}>
          {services.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                { backgroundColor: currentServiceIndex === index ? '#E4784A' : '#ccc' },
              ]}
            />
          ))}
        </View>

        {/* Consejos */}
        <View style={styles.tipContainer}>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>{tips[currentTipIndex].text}</Text>
          </View>
        </View>

        {/* ¿Para quién es la compra? */}
        <View style={styles.compraParaContainer}>
          <Text style={styles.compraParaText}>¿Para quién es la compra?</Text>
          <View style={styles.tarjetaContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('gato')} style={styles.tarjeta}>
              <Image source={require('./imagenes/gato.jpg')} style={styles.tarjetaImage} />
              <Text style={styles.tarjetaText}>Gato</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('perro')} style={styles.tarjeta}>
              <Image source={require('./imagenes/perro.jpg')} style={styles.tarjetaImage} />
              <Text style={styles.tarjetaText}>Perro</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Veterinarias */}
        <View style={styles.veterinariasContainer}>
          <View style={styles.veterinariasTitleContainer}>
            <Icon name="storefront-sharp" size={24} color="#E4784A" style={styles.iconMargin} />
            <Text style={styles.veterinariasTitle}>Veterinarias y mas...</Text>
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {veterinarias.map(vet => (
              <View key={vet.id} style={styles.veterinariaCard}>
                <TouchableOpacity
                  onPress={() => handleVetPress(vet.id)}
                  style={styles.veterinariaButton}
                >
                  <Image source={{ uri: vet.Foto }} style={styles.veterinariaImage} />
                  <Text style={styles.veterinariaName}>{vet.Nombre}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        

        
      </ScrollView>
      

      {/* Barra de perfil */}
      <View style={styles.profileBar}>
        <TouchableOpacity onPress={() => navigation.navigate('MiPerfil')} style={styles.profileButton}>
          <Icon name="person" size={30} color="black" />
          <Text style={styles.profileButtonText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('pago')} style={styles.profileButton}>
          <Icon name="cart" size={30} color="black" />
          <Text style={styles.profileButtonText}>Carrito</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('vercupones')} style={styles.profileButton}>
          <Icon name="ticket" size={30} color="black" />
          <Text style={styles.profileButtonText}>Cupones</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#f4f6fc', // Color de fondo suave
  },
  
  container: {
    flexGrow: 1,
    padding: 20,
  },

  logoContainer: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logoImage: {
    resizeMode: 'cover',
    width: '110%',
    height: 180,
    borderRadius: 15, // Bordes suaves
  },

  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
    textShadowColor: '#ddd',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },

  carouselContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  serviceCard: {
    width: width * 0.8,
    height: 220,
    marginHorizontal: 12,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 6,
    borderColor: '#ddd',
    borderWidth: 1,
  },

  serviceImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceTitle: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    width: '100%',
  },

  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 5,
    backgroundColor: '#ccc',
  },

  tipContainer: {
    marginBottom: 20,
  },
  
  tipCard: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 4,
    marginVertical: 12,
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
  },

  tipText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },

  compraParaContainer: {
    marginBottom: 20,
  },
  compraParaText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },

  tarjetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  tarjeta: {
    alignItems: 'center',
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 6,
    marginHorizontal: 5,
    padding: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  
  tarjetaImage: {
    width: '100%',
    height: 140,
    borderRadius: 10,
  },
  tarjetaText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },

  veterinariasContainer: {
    marginBottom: 20,
  },

  veterinariasTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  iconMargin: {
    marginRight: 10,
  },

  veterinariasTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    alignItems: 'center',
  },

  veterinariaCard: {
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
    borderColor: '#ddd',
    borderWidth: 1,
    marginHorizontal: 5,
  },

  veterinariaButton: {
    alignItems: 'center',
    padding: 10,
  },
  
  veterinariaImage: {
    width: 160,
    height: 120,
    borderRadius: 12,
  },

  veterinariaName: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  profileBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },

  profileButton: {
    alignItems: 'center',
  },

  profileButtonText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MainPanel;
