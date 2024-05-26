import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Politica = ({ navigation }) => {
  const handleEntiendo = () => {
    navigation.navigate('MiPerfil'); // Navegar a la pantalla de Mi Perfil
  };

  return (
    <ImageBackground source={require('../imagenes/fondomain.jpg')} style={styles.backgroundImage}>
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.title}>Bienvenido a Pet Services Bucaramanga</Text>
          <Text style={styles.paragraph}>
            La aplicación que se preocupa por el bienestar de tus mascotas. Queremos informarte sobre cómo manejamos tus datos personales y cómo protegemos tu privacidad. Al utilizar nuestra aplicación, aceptas las prácticas descritas en esta Política de Privacidad.
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}><Icon name="lock" size={18} color="black" /> Finalidad de la Recogida de Datos Personales:</Text>
            <Text style={styles.cardText}>
              Recopilamos tus datos personales con el único propósito de mejorar la experiencia de usuario y proporcionar servicios personalizados relacionados con el cuidado de tus mascotas. Estos datos nos ayudan a entender tus preferencias y necesidades para ofrecerte un servicio más eficiente y adaptado.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}><Icon name="user" size={18} color="black" /> Nombre y Datos de Contacto del Responsable del Tratamiento:</Text>
            <Text style={styles.cardText}>
              Pet Services Bucaramanga es operado por Sebastian Galindo Mendoza, con domicilio en Bucaramanga y datos de contacto a través de petservicesbga@gmail.com. Nos comprometemos a proteger y manejar tus datos de manera responsable.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}><Icon name="check" size={18} color="black" /> Legitimación para el Tratamiento de Datos:</Text>
            <Text style={styles.cardText}>
              La recopilación y el procesamiento de tus datos personales se basan en tu consentimiento explícito para el uso de la aplicación y sus servicios relacionados con el cuidado de mascotas.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}><Icon name="users" size={18} color="black" /> Destinatarios de los Datos:</Text>
            <Text style={styles.cardText}>
              Tus datos personales serán tratados de manera confidencial y solo serán compartidos con terceros cuando sea necesario para brindarte servicios específicos, como servicios veterinarios o de entrega de productos para mascotas.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}><Icon name="clock" size={18} color="black" /> Periodo de Conservación de Datos:</Text>
            <Text style={styles.cardText}>
              Conservaremos tus datos personales durante el tiempo necesario para cumplir con los fines para los que fueron recopilados, a menos que se requiera un período de retención más prolongado por razones legales o regulatorias.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}><Icon name="edit" size={18} color="black" /> Ejercicio de Derechos:</Text>
            <Text style={styles.cardText}>
              Te informamos sobre tu derecho de acceso, rectificación, supresión, limitación de tratamiento, portabilidad y oposición. Puedes ejercer estos derechos enviando una solicitud a través de correo a petservicesbga@gmail.com.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}><Icon name="thumbs-up" size={18} color="black" /> Consentimiento Específico:</Text>
            <Text style={styles.cardText}>
              Antes de acceder a cualquier dato personal, te solicitaremos tu consentimiento explícito para garantizar la transparencia y el control sobre tus datos.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}><Icon name="child" size={18} color="black" /> Datos de Menores y Servicios de Geolocalización:</Text>
            <Text style={styles.cardText}>
              Nuestra aplicación no está dirigida a menores de +13, y no recopilamos conscientemente información de usuarios menores de esa edad. Además, si la aplicación utiliza servicios de geolocalización, solicitaremos tu consentimiento antes de acceder a esta información.
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Al utilizar Pet Services Bucaramanga, confías en nosotros tus datos personales. Nos comprometemos a proteger tu privacidad y a utilizar tus datos de manera responsable. Si tienes alguna pregunta o inquietud sobre nuestra Política de Privacidad, no dudes en contactarnos.
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleEntiendo}>
            <Text style={styles.buttonText}>Entiendo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  cardText: {
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#0000FF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default Politica;
