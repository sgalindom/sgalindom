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
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [foodProducts, setFoodProducts] = useState([]);
  const [accessoryProducts, setAccessoryProducts] = useState([]);
  const [allProductProducts, setProductProducts] = useState([]); // Corregido

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
    { id: 3, text: 'Proporciona a tu mascota una alimentación equilibrada.' },
    { id: 4, text: 'Realiza visitas veterinarias de forma periódica.' },
    { id: 5, text: 'Cuida la higiene de tu mascota regularmente.' },
    { id: 6, text: 'Identifica a tu mascota con collar y microchip.' },
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
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -300,
            duration: 500,
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
            duration: 500,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();

        setTimeout(() => {
          setCurrentServiceIndex(prevIndex => (prevIndex + 1) % services.length);
        }, 500); // Change the service index after the fade-out animation
      }, 4000);

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
            vetId: vetId, ...doc.data(),
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
            vetId: vetId, ...doc.data(),
          }));
        });

        const productProductsData = await Promise.all(productProductsRefs);
        const allProductProducts = productProductsData.reduce((acc, val) => acc.concat(val), []);
        setProductProducts(allProductProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductPress = (productId, vetId, productType) => {
    let route = '';
    switch (productType) {
      case 'comida':
        route = vetId === 1 ? 'vet1comida' : 'vet3comida';
        break;
      case 'accesorios':
        route = vetId === 1 ? 'vet1accesorios' : 'vet3accesorios';
        break;
      case 'productos':
        route = vetId === 1 ? 'vet1productos' : 'vet3productos';
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

  const slide = slideAnim.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [-300, 0, 300],
  });

  return (
    <ImageBackground source={require('./imagenes/fondomain.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('./imagenes/fondoperfil.jpg')} style={styles.headerImage} />

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
          <Text style={styles.productTitle}>Productos de Comida</Text>
          <ScrollView horizontal={true}>
            {foodProducts.map(product => (
              <TouchableOpacity key={product.id} style={styles.productCard} onPress={() => handleProductPress(product.id, product.vetId)}>
                <Image source={{ uri: product.Foto }} style={styles.productImage} />
                <Text style={styles.productName}>{product.Nombre}</Text>
                <Text style={styles.productPrice}>{product.Precio}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Productos de accesorios */}
        <View style={styles.productContainer}>
          <Text style={styles.productTitle}>Productos de Accesorios</Text>
          <ScrollView horizontal={true}>
            {accessoryProducts.map(product => (
              <TouchableOpacity key={product.id} style={styles.productCard} onPress={() => handleProductPress(product.id, product.vetId)}>
                <Image source={{ uri: product.Foto }} style={styles.productImage} />
                <Text style={styles.productName}>{product.Nombre}</Text>
                <Text style={styles.productPrice}>{product.Precio}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </ScrollView>

      <TouchableOpacity
        style={styles.profileBar}
        onPress={() => navigation.navigate('MiPerfil')}
      >
        <Text style={styles.profileText}>MI PERFIL</Text>
      </TouchableOpacity>
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
  },
  serviceCardContainer: {
    alignItems: 'center',
  },
  serviceCard: {
    width: 300,
    height: 200,
    marginVertical: 10,
    alignItems: 'center',
  },
  serviceImage: {
    width: 380,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
  },
  profileBar: {
    backgroundColor: '#333',
    padding: 10,
    alignItems: 'center',
  },
  profileText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  productContainer: {
    marginTop: 20,
    marginLeft: 20,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productCard: {
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    width: 150,
    height: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});

export default MainPanel;
