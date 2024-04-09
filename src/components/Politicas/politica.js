// Importa las bibliotecas necesarias de React Native
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Componente Funcional para el Panel de Política
const Politica = () => {
  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.title}>Bienvenido a Pet Services Bucaramanga</Text>
        <Text style={styles.paragraph}>
          La aplicación que se preocupa por el bienestar de tus mascotas. Queremos informarte sobre cómo manejamos tus datos personales y cómo protegemos tu privacidad. Al utilizar nuestra aplicación, aceptas las prácticas descritas en esta Política de Privacidad.
        </Text>

        <Text style={styles.heading}>1. Finalidad de la Recogida de Datos Personales:</Text>
        <Text style={styles.paragraph}>
          Recopilamos tus datos personales con el único propósito de mejorar la experiencia de usuario y proporcionar servicios personalizados relacionados con el cuidado de tus mascotas. Estos datos nos ayudan a entender tus preferencias y necesidades para ofrecerte un servicio más eficiente y adaptado.
        </Text>

        <Text style={styles.heading}>2. Nombre y Datos de Contacto del Responsable del Tratamiento:</Text>
        <Text style={styles.paragraph}>
          Pet Services Bucaramanga es operado por Sebastian Galindo Mendoza, con domicilio en Bucaramanga y datos de contacto a través de petservicesbga@gmail.com. Nos comprometemos a proteger y manejar tus datos de manera responsable.
        </Text>

        <Text style={styles.heading}>3. Legitimación para el Tratamiento de Datos:</Text>
        <Text style={styles.paragraph}>
          La recopilación y el procesamiento de tus datos personales se basan en tu consentimiento explícito para el uso de la aplicación y sus servicios relacionados con el cuidado de mascotas.
        </Text>

        <Text style={styles.heading}>4. Destinatarios de los Datos:</Text>
        <Text style={styles.paragraph}>
          Tus datos personales serán tratados de manera confidencial y solo serán compartidos con terceros cuando sea necesario para brindarte servicios específicos, como servicios veterinarios o de entrega de productos para mascotas.
        </Text>

        <Text style={styles.heading}>5. Periodo de Conservación de Datos:</Text>
        <Text style={styles.paragraph}>
          Conservaremos tus datos personales durante el tiempo necesario para cumplir con los fines para los que fueron recopilados, a menos que se requiera un período de retención más prolongado por razones legales o regulatorias.
        </Text>

        <Text style={styles.heading}>6. Ejercicio de Derechos:</Text>
        <Text style={styles.paragraph}>
          Te informamos sobre tu derecho de acceso, rectificación, supresión, limitación de tratamiento, portabilidad y oposición. Puedes ejercer estos derechos enviando una solicitud a través de correo a petservicesbga@gmail.com.
        </Text>

        <Text style={styles.heading}>7. Consentimiento Específico:</Text>
        <Text style={styles.paragraph}>
          Antes de acceder a cualquier dato personal, te solicitaremos tu consentimiento explícito para garantizar la transparencia y el control sobre tus datos.
        </Text>

        <Text style={styles.heading}>8. Datos de Menores y Servicios de Geolocalización:</Text>
        <Text style={styles.paragraph}>
          Nuestra aplicación no está dirigida a menores de +13, y no recopilamos conscientemente información de usuarios menores de esa edad. Además, si la aplicación utiliza servicios de geolocalización, solicitaremos tu consentimiento antes de acceder a esta información.
        </Text>

        <Text style={styles.paragraph}>
          Al utilizar Pet Services Bucaramanga, confías en nosotros tus datos personales. Nos comprometemos a proteger tu privacidad y a utilizar tus datos de manera responsable. Si tienes alguna pregunta o inquietud sobre nuestra Política de Privacidad, no dudes en contactarnos.
        </Text>

        <Text style={styles.thankYou}>¡Gracias por confiar en Pet Services Bucaramanga para el cuidado de tus mascotas!</Text>
      </View>
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color:'black',
  },
  paragraph: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
    color:'black',
  },
  thankYou: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'black',
  },
});

export default Politica;
