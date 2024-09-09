import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Animated } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

const MainPanel = ({ navigation }) => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [foodProducts, setFoodProducts] = useState([]);
  const [accessoryProducts, setAccessoryProducts] = useState([]);
  const [allProductProducts, setProductProducts] = useState([]);
  const [veterinarias, setVeterinarias] = useState([]);
  
  const [fadeAnim] = useState(new Animated.Value(0));

  const services = [
    { id: 1, title: 'Veterinarias y Pets Shops', image: require('./imagenes/Veterinario.jpg'), route: 'bveterinaria' },
    { id: 2, title: 'Paseos', image: require('./imagenes/paseos.jpg'), route: 'PaquetesPaseos' },
    { id: 3, title: 'Adiestramiento', image: require('./imagenes/adiestramiento.jpg'), route: 'badieguar' },
    { id: 4, title: 'Seguro para tu mascota', image: require('./imagenes/seguro.jpg'), route: 'proximamente' },
    { id: 5, title: 'Servicios Funebres', image: require('./imagenes/Premium.jpg'), route: 'ServicioFuneraria' },
    { id: 6, title: 'Contáctanos', image: require('./imagenes/contacto.jpg'), route: 'Contactanos' },
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
    const intervalId = setInterval(() => {
      setCurrentServiceIndex(prevIndex => (prevIndex + 1) % services.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [services.length]);

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
        
        {/* Bienvenidos */}
        <Text style={styles.welcomeText}>BIENVENIDOS</Text>

        {/* Carrusel de Servicios */}
        <Animated.View style={[styles.carouselContainer, { opacity: fadeAnim }]}>
          <ScrollView horizontal={true} pagingEnabled showsHorizontalScrollIndicator={false}>
            {services.map((service, index) => (
              <TouchableOpacity
                key={service.id}
                style={[styles.serviceCard, index === currentServiceIndex && styles.activeServiceCard]}
                onPress={() => navigation.navigate(service.route)}
              >
                <ImageBackground source={service.image} style={styles.serviceImage} imageStyle={{ borderRadius: 15 }}>
                  <View style={styles.serviceOverlay}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>


        {/* Consejos */}
        <View style={styles.tipContainer}>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>{tips[currentServiceIndex % tips.length].text}</Text>
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
          <Text style={styles.profileButtonText}>Contactanos</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    padding: 15,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 400,
    height: 150,
    borderRadius: 10,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco
    textAlign: 'center',
    textShadowColor: 'black', // Sombra oscura
    textShadowOffset: { width: -4, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 10, // Difuminado de la sombra
    marginBottom: 20,
  },
  carouselContainer: {
    marginBottom: 20,
  },
  serviceCard: {
    width: 250,
    marginHorizontal: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  activeServiceCard: {
    borderWidth: 2,
    borderColor: '#E4784A',
  },
  serviceImage: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
  },
  serviceOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  serviceTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    marginHorizontal: 10,
    padding: 10,
  },
  tarjetaImage: {
    width: '100%',
    height: 150,
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
    width: 150,
    height: 150,
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
