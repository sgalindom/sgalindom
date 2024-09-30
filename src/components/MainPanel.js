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

  // Rotación de servicios cada 3 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextIndex = (currentServiceIndex + 1) % services.length;
      scrollViewRef.current.scrollTo({ x: nextIndex * width * 0.8, animated: true });
      setCurrentServiceIndex(nextIndex);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentServiceIndex]);

  // Rotación de consejos cada 3 segundos
  useEffect(() => {
    const tipIntervalId = setInterval(() => {
      setCurrentTipIndex(prevIndex => (prevIndex + 1) % tips.length);
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
            return snapshot.docs.map(doc => ({
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
        setVeterinarias(veterinariasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })));
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
    <ImageBackground source={require('./imagenes/fondomain.jpg')} style={styles.backgroundImage}>
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
            <TouchableOpacity onPress={() => navigation.navigate('proximamente')} style={styles.tarjeta}>
              <Image source={require('./imagenes/perro.jpg')} style={styles.tarjetaImage} />
              <Text style={styles.tarjetaText}>Perro</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Veterinarias */}
        <View style={styles.veterinariasContainer}>
          <View style={styles.veterinariasTitleContainer}>
            <Icon name="storefront-sharp" size={24} color="#E4784A" style={styles.iconMargin} />
            <Text style={styles.veterinariasTitle}>Veterinarias</Text>
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
          <Icon name="person" size={30} color="#000" />
          <Text style={styles.profileButtonText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('pago')} style={styles.profileButton}>
          <Icon name="cart" size={30} color="#000" />
          <Text style={styles.profileButtonText}>Pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Contactanos')} style={styles.profileButton}>
          <Icon name="logo-whatsapp" size={30} color="#000" />
          <Text style={styles.profileButtonText}>Contáctanos</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    padding: 15,
  },
  logoContainer: {
    width: '100%',
    height: 140, // La altura puede variar si lo deseas
    justifyContent: 'flex-start', // Para que esté pegado arriba
    alignItems: 'center',
    paddingTop: 0, // Sin padding superior
    marginTop: 0, // Sin margen superior
  },
  logoImage: {
    width: '110%', // Ocupar todo el ancho del dispositivo
    height: '100%', // Ocupar toda la altura disponible en el contenedor
    resizeMode: 'cover', // Ajustar la imagen sin distorsionar
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)', // Color de la sombra, negro con opacidad
    textShadowOffset: { width: 2, height: 2 }, // Desplazamiento de la sombra
    textShadowRadius: 3, // Difusión de la sombra
  },

  carouselContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCard: {
    width: width * 0.8, // 80% del ancho de la pantalla
    height: 200, // Altura de las tarjetas
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceTitle: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 5,
    width: '100%',
  },
  tipContainer: {
    marginBottom: 20,
  },
  tipCard: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    marginVertical: 10,
    alignItems: 'center',
  },
  tipText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  compraParaContainer: {
    marginBottom: 20,
  },
  compraParaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  tarjetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tarjeta: {
    alignItems: 'center',
    width: '40%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    marginHorizontal: 5,
    padding: 10,
  },
  tarjetaImage: {
    width: '100%',
    height: 130,
  },
  tarjetaText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
  },
  veterinariasContainer: {
    marginBottom: 20,
  },
  veterinariasTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconMargin: {
    marginRight: 10,
  },
  veterinariasTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  veterinariaCard: {
    marginRight: 15,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  veterinariaButton: {
    alignItems: 'center',
    padding: 10,
  },
  veterinariaImage: {
    width: 160,
    height: 120,
    borderRadius: 10,
  },
  veterinariaName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  profileBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  profileButton: {
    alignItems: 'center',
  },
  profileButtonText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MainPanel;
