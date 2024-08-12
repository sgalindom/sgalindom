import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '273923140034-t2scom2bamihapkdpt5t2dpf902j3qnj.apps.googleusercontent.com',
});

// Importaciones relacionadas con Registro, Loguin y Contraseña
import PreLogin from './components/Registro-loguin-contraseña/PreLogin';
import Login from './components/Registro-loguin-contraseña/Login';
import Registro from './components/Registro-loguin-contraseña/Registro';
import RecuperarContraseña from './components/Registro-loguin-contraseña/RecuperarContraseña';

// Importaciones relacionadas con el Panel Principal
import MainPanel from './components/MainPanel';
import Contactonos from './components/Contactanos'; // Importación añadida
import MiPerfil from './components/Perfil-usuario/MiPerfil';
import MiInformacion from './components/Perfil-usuario/MiInformacion';
import Politica from './components/Politicas/politica';
import Notificaciones from './components/Notificaciones/notificaciones';
import CalificacionPanel from './components/Calificanos/calificacion';

// Importaciones relacionadas con Adiestramiento
import Badiegard from './components/badieguar';

// Importaciones relacionadas con Paseo de Perros
import PaquetesPaseos from './components/Paseoperros/PaquetesPaseos';
import SolicitudPaseo from './components/Paseoperros/SolicitudPaseo';

// Importaciones relacionadas con Perfil de Mascotas
import MisMascotas from './components/Perfilmascota/MisMascotas';
import AñadirMascota from './components/Perfilmascota/AñadirMascota';
import DetalleMascota from './components/Perfilmascota/DetalleMascota';

// Importaciones relacionadas con Pagos
import Pago from './components/Pedidosusuarios/pago';

// Importaciones relacionadas con Veterinaria 1
import Bveterinaria from './components/bveterinaria';

import CitasBañoPanel from './components/Paneladministrador/citasbaños';
import CitasDrPanel from './components/Paneladministrador/citasdr';
import CitasDrAtendidas from './components/Paneladministrador/citasdratendidas';
import CitasBañosAtendidas from './components/Paneladministrador/citasbañoatendidas';

// Importaciones relacionadas con Cupones y Servicios
import VerCupones from './components/Cupones/vercupones';
import Cuponqr1 from './components/Cupones/Cuponqr1';
import ServicioFuneraria from './components/Funeraria/ServicioFuneraria';
import Basico from './components/Funeraria/Basico';
import Premium from './components/Funeraria/Premium';

// Importaciones relacionadas con el Panel Administrativo
import PanelAdmin from './components/Paneladministrador/paneladmin';
import PedidosPetShopPanel from './components/Paneladministrador/pepetshop';
import DespachadosPetShopPanel from './components/Paneladministrador/despapetshop';
import ProductosPanel from './components/Paneladministrador/productostiendaañadir';
import Accesorios from './components/Paneladministrador/accesorios';
import Comida from './components/Paneladministrador/comida';
import Productos from './components/Paneladministrador/productos';
import MisProductosPanel from './components/Paneladministrador/misproductos';
import ProximamentePanel from './components/proximamente';

// Importaciones relacionadas con el Panel Adiestramiento y Guarderia Adieguar
import AdieguarScreen from './components/Adiestramiento/Adieguar1';

import MisPedidos from './components/Pedidosusuarios/mispedidos';
import Seguros from './components/seguros/seguros';
import Inicio from './components/Registro-loguin-contraseña/Inicio';
import VerVeterinarias from './components/veterinarias/verveterinarias';
import GatoScreen from './components/Petshop/Gato/gato';
import Opciones from './components/Petshop/Gato/opciones';
import VerProductos from './components/Petshop/Gato/verproductos';
import Detalle from './components/Petshop/detalles';

import Paseosadmin from './components/Paneladministrador/paseosadmin';

import Vet1Screen from './components/veterinarias/Veterinaria1/vet1';
import PetShopScreen from './components/veterinarias/Veterinaria1/petshop';
import VerProductoJuguetes from './components/veterinarias/Veterinaria1/verproductojuguetes';
import VerProductoComida from './components/veterinarias/Veterinaria1/verproductocomida';
import Vet1Accesorios from './components/veterinarias/Veterinaria1/vet1accesorios';
import Vet1Juguetes from './components/veterinarias/Veterinaria1/vet1juguetes';
import Vet1Comida from './components/veterinarias/Veterinaria1/vet1comida';
import VerProductoAccesorios from './components/veterinarias/Veterinaria1/verproductoaccesorios';

const Stack = createNativeStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return null; // o cualquier indicador de carga
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="inicio">
        <Stack.Screen name="PreLogin" component={PreLogin} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="MainPanel" component={MainPanel} />
        <Stack.Screen name="MiPerfil" component={MiPerfil} />
        <Stack.Screen name="RecuperarContraseña" component={RecuperarContraseña} />
        <Stack.Screen name="vercupones" component={VerCupones} />
        <Stack.Screen name="Cuponqr1" component={Cuponqr1} />
        <Stack.Screen name="PaquetesPaseos" component={PaquetesPaseos} />
        <Stack.Screen name="MiInformacion" component={MiInformacion} />
        <Stack.Screen name="MisMascotas" component={MisMascotas} />
        <Stack.Screen name="politica" component={Politica} />
        <Stack.Screen name="notificaciones" component={Notificaciones} />
        <Stack.Screen name="calificacion" component={CalificacionPanel} />
        <Stack.Screen name="AñadirMascota" component={AñadirMascota} />
        <Stack.Screen name="DetalleMascota" component={DetalleMascota} />
        <Stack.Screen name="SolicitudPaseo" component={SolicitudPaseo} />
        <Stack.Screen name="pago" component={Pago} />
        <Stack.Screen name="bveterinaria" component={Bveterinaria} />
        <Stack.Screen name="citasdr" component={CitasDrPanel} />
        <Stack.Screen name="citasdratendidas" component={CitasDrAtendidas} />
        <Stack.Screen name="citasbaños" component={CitasBañoPanel} />
        <Stack.Screen name="citasbañoatendidas" component={CitasBañosAtendidas} />
        <Stack.Screen name="despapetshop" component={DespachadosPetShopPanel} />
        <Stack.Screen name="productostiendaañadir" component={ProductosPanel} />
        <Stack.Screen name="Contactanos" component={Contactonos} />
        <Stack.Screen name="ServicioFuneraria" component={ServicioFuneraria} />
        <Stack.Screen name="Basico" component={Basico} />
        <Stack.Screen name="Premium" component={Premium} />
        <Stack.Screen name="paneladmin" component={PanelAdmin} />
        <Stack.Screen name="pepetshop" component={PedidosPetShopPanel} />
        <Stack.Screen name="MisProductosPanel" component={MisProductosPanel} />
        <Stack.Screen name="accesorios" component={Accesorios} />
        <Stack.Screen name="comida" component={Comida} />
        <Stack.Screen name="productos" component={Productos} />
        <Stack.Screen name="proximamente" component={ProximamentePanel} />
        <Stack.Screen name="badieguar" component={Badiegard} />
        <Stack.Screen name="MisPedidos" component={MisPedidos} />
        <Stack.Screen name="seguros" component={Seguros} />
        <Stack.Screen name="inicio" component={Inicio} />
        <Stack.Screen name="verveterinarias" component={VerVeterinarias} />
        <Stack.Screen name="gato" component={GatoScreen} />
        <Stack.Screen name="opciones" component={Opciones} />
        <Stack.Screen name="verproductos" component={VerProductos} />
        <Stack.Screen name="detalles" component={Detalle} />
        <Stack.Screen name="Adieguar1" component={AdieguarScreen} />
        <Stack.Screen name="Paseosadmin" component={Paseosadmin} />
        <Stack.Screen name="vet1" component={Vet1Screen} />
        <Stack.Screen name="petshop" component={PetShopScreen} />
        <Stack.Screen name="verproductojuguetes" component={VerProductoJuguetes} />
        <Stack.Screen name="verproductocomida" component={VerProductoComida} />
        <Stack.Screen name="vet1accesorios" component={Vet1Accesorios} />
        <Stack.Screen name="vet1juguetes" component={Vet1Juguetes} />
        <Stack.Screen name="vet1comida" component={Vet1Comida} />
        <Stack.Screen name="verproductoaccesorios" component={VerProductoAccesorios} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
