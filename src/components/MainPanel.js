import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Animated, Dimensions, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import storage from '@react-native-firebase/storage';

const { width } = Dimensions.get('window');

const MainPanel = ({ navigation }) => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [foodProducts, setFoodProducts] = useState([]);
  const [accessoryProducts, setAccessoryProducts] = useState([]);
  const [allProductProducts, setProductProducts] = useState([]);
  const [veterinarias, setVeterinarias] = useState([]);
  const [guarderias, setGuarderias] = useState([]);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(true);
  const [serviceImages, setServiceImages] = useState({});
  const [otherImages, setOtherImages] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      const imageNames = [
        'bucaramanga.jpg',
        'paseos.jpg',
        'adiestramiento.jpg',
        'seguro.jpg',
        'serviciosfunebres.jpg',
        'contacto.jpg',
        'fondoperfil.jpg',
        'gato.jpg',
        'perro.jpg',
      ];

      const storagePromises = imageNames.map(async (imageName) => {
        const url = await storage().ref(`/imagenes/${imageName}`).getDownloadURL();
        return { name: imageName, url };
      });

      const imageUrls = await Promise.all(storagePromises);
      const fetchedServiceImages = {};
      const fetchedOtherImages = {};

      imageUrls.forEach(({ name, url }) => {
        if (
          name.startsWith('bucaramanga') ||
          name.startsWith('paseos') ||
          name.startsWith('adiestramiento') ||
          name.startsWith('seguro') ||
          name.startsWith('serviciosfunebres') ||
          name.startsWith('contacto')
        ) {
          fetchedServiceImages[name.split('.')[0]] = url;
        } else {
          fetchedOtherImages[name.split('.')[0]] = url;
        }
      });

      setServiceImages(fetchedServiceImages);
      setOtherImages(fetchedOtherImages);
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const tipIntervalId = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 3000);

    return () => clearInterval(tipIntervalId);
  }, [tips]); // Dependency changed to tips

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
          })),
        );

        const guarderiasRef = firestore().collection('Guarderiasyadiestramiento');
        const guarderiasSnapshot = await guarderiasRef.get();
        setGuarderias(
          guarderiasSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        );
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setIsLoading(false);
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

  const services = [
    { id: 1, title: 'Veterinarias y Pets Shops', image: serviceImages.bucaramanga, route: 'bveterinaria' },
    { id: 2, title: 'Paseos', image: serviceImages.paseos, route: 'PaquetesPaseos' },
    { id: 3, title: 'Adiestramiento', image: serviceImages.adiestramiento, route: 'badieguar' },
    { id: 4, title: 'Seguro para tu mascota', image: serviceImages.seguro, route: 'proximamente' },
    { id: 5, title: 'Servicios Funebres', image: serviceImages.serviciosfunebres, route: 'ServicioFuneraria' },
    { id: 6, title: 'Contáctanos', image: serviceImages.contacto, route: 'Contactanos' },
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

  useEffect(() => {
    // This useEffect will only run after serviceImages has been populated
    let intervalId;
    if (Object.keys(serviceImages).length > 0 && services.length > 0) {
      intervalId = setInterval(() => {
        setCurrentServiceIndex((prevIndex) => (prevIndex + 1) % services.length);
      }, 6000);
    }

    return () => clearInterval(intervalId);
  }, [serviceImages]); // Now depends on serviceImages

  return (
    <View style={styles.backgroundContainer}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#E4784A" />
          <Text style={styles.welcomeText}>Cargando...</Text>
          <Text style={styles.welcomeText}>¡Encuentra todo lo que tu mejor amigo necesita!</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoContainer}>
            <FastImage
              style={styles.logoImage}
              source={{
                uri: otherImages.fondoperfil,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>

          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeText}>¡Encuentra todo lo que tu mejor amigo necesita!</Text>
          </View>

          {/* Ensure serviceImages is populated before rendering the carousel */}
          {Object.keys(serviceImages).length > 0 && (
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
                    <ImageBackground source={{ uri: service.image }} style={styles.serviceImage}>
                      <Text style={styles.serviceTitle}>{service.title}</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </Animated.ScrollView>
          )}

          <View style={styles.indicatorContainer}>
            {services.map((_, index) => (
              <View
                key={index}
                style={[styles.indicator, { backgroundColor: currentServiceIndex === index ? '#E4784A' : '#ccc' }]}
              />
            ))}
          </View>

          <View style={styles.tipContainer}>
            <View style={styles.tipCard}>
              <Text style={styles.tipText}>{tips[currentTipIndex].text}</Text>
            </View>
          </View>

          <View style={styles.compraParaContainer}>
            <Text style={styles.compraParaText}>¿Para qué compañero peludo estás eligiendo hoy?</Text>
            <View style={styles.tarjetaContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('gato')} style={styles.tarjeta}>
                <FastImage
                  style={styles.tarjetaImage}
                  source={{
                    uri: otherImages.gato,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <Text style={styles.tarjetaText}>Gato</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('perro')} style={styles.tarjeta}>
                <FastImage
                  style={styles.tarjetaImage}
                  source={{
                    uri: otherImages.perro,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <Text style={styles.tarjetaText}>Perro</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.veterinariasContainer}>
            <View style={styles.veterinariasTitleContainer}>
              <Icon name="storefront-sharp" size={24} color="#E4784A" style={styles.iconMargin} />
              <Text style={styles.veterinariasTitle}>Veterinarias y mas...</Text>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {veterinarias.map((vet) => (
                <View key={vet.id} style={styles.veterinariaCard}>
                  <TouchableOpacity onPress={() => handleVetPress(vet.id)} style={styles.veterinariaButton}>
                    <FastImage
                      style={styles.veterinariaImage}
                      source={{
                        uri: vet.Foto,
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                    <Text style={styles.veterinariaName}>{vet.Nombre}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.guarderiasContainer}>
            <View style={styles.guarderiasTitleContainer}>
              <Icon name="paw" size={24} color="#E4784A" style={styles.iconMargin} />
              <Text style={styles.guarderiasTitle}>Guarderías y Adiestramiento</Text>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {guarderias.map((guarderia) => (
                <View key={guarderia.id} style={styles.guarderiaCard}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Adieguar1', { adieguarId: guarderia.id })}
                    style={styles.guarderiaButton}
                  >
                    <FastImage
                      style={styles.guarderiaImage}
                      source={{
                        uri: guarderia.Foto,
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                    <Text style={styles.guarderiaName}>{guarderia.Nombre}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      )}

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
    backgroundColor: '#f4f6fc',
  },

  container: {
    flexGrow: 1,
    padding: 20,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 15,
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
    borderWidth:1,
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
    resizeMode: 'cover',
  },

  veterinariaName: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  guarderiasContainer: {
    marginBottom: 20,
  },

  guarderiasTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  guarderiasTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    alignItems: 'center',
  },

  guarderiaCard: {
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
    borderColor: '#ddd',
    borderWidth: 1,
    marginHorizontal: 5,
  },

  guarderiaButton: {
    alignItems: 'center',
    padding: 10,
  },

  guarderiaImage: {
    width: 160,
    height: 120,
    borderRadius: 12,
    resizeMode: 'cover',
  },

  guarderiaName: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  profileBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 5,
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