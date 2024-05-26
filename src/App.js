import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

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
import pago from './components/Pedidosusuarios/pago';

// Importaciones relacionadas con Veterinaria 1
import bveterinaria from './components/bveterinaria';
import Vet1Screen from './components/veterinarias/Veterinaria1/vet1';
import petshop from './components/veterinarias/Veterinaria1/petshop';
import baño from './components/veterinarias/Veterinaria1/baño';
import domicilio from './components/veterinarias/Veterinaria1/vet1dr';
import vet1juguetes from './components/veterinarias/Veterinaria1/vet1juguetes';
import Vet1Comida from './components/veterinarias/Veterinaria1/vet1comida';
import vet1accesorios from './components/veterinarias/Veterinaria1/vet1accesorios';
import vet1calificacion from './components/veterinarias/Veterinaria1/vet1calificacion';
import Vet1DrScreen from './components/veterinarias/Veterinaria1/vet1dr';
import Vet1BañoCitasScreen from './components/veterinarias/Veterinaria1/vet1bañocita';
import CitasBañoPanel from './components/Paneladministrador/citasbaños';
import CitasDrPanel from './components/Paneladministrador/citasdr';
import Vet1CitasDrScreen from './components/veterinarias/Veterinaria1/vet1citasdr';
import CitasDrAtendidas from './components/Paneladministrador/citasdratendidas';
import CitasBañosAtendidas from './components/Paneladministrador/citasbañoatendidas';

// Importaciones relacionadas con Veterinaria 2
import Vet2Screen from './components/veterinarias/Veterinaria2/vet2';
import Vet2ServiciosMedicos from './components/veterinarias/Veterinaria2/vet2serviciosmedicos';
import Vet2Consultas from './components/veterinarias/Veterinaria2/vet2consultas';


import Vet3Screen from './components/veterinarias/Veterinaria3/vet3';
import Vet4Screen from './components/veterinarias/Veterinaria4/vet4';
import Vet5Screen from './components/veterinarias/Veterinaria5/vet5';
import Vet6Screen from './components/veterinarias/Veterinaria6/vet6';
import Vet7Screen from './components/veterinarias/Veterinaria7/vet7';
import Vet8Screen from './components/veterinarias/Veterinaria8/vet8';
import Vet9Screen from './components/veterinarias/Veterinaria9/vet9';





// Importaciones relacionadas con Cupones y Servicios
import VerCupones from './components/Cupones/vercupones';
import Cuponqr1 from './components/Cupones/Cuponqr1';
import ServicioFuneraria from './components/Funeraria/ServicioFuneraria';
import Basico from './components/Funeraria/Basico';
import Premium from './components/Funeraria/Premium';

// Importaciones relacionadas con el Panel Administrativo
import CuponesQRadmin from './components/Paneladministrador/cuponesqr';
import PanelAdmin from './components/Paneladministrador/paneladmin';
import PedidosPetShopPanel from './components/Paneladministrador/pepetshop';
import DespachadosPetShopPanel from './components/Paneladministrador/despapetshop';
import ProductosPanel from './components/Paneladministrador/productostiendaañadir';
import Accesorios from './components/Paneladministrador/accesorios';
import Comida from './components/Paneladministrador/coida';
import Productos from './components/Paneladministrador/productos';
import MisProductos from './components/Paneladministrador/misproductos';


import ProximamentePanel from './components/proximamente';


// Importaciones relacionadas con el Panel Adiestramiento y Guarderia Adieguar
import AdieguarScreen from './components/Adiestramiento/Adieguar1/Adieguar1';


import VerProductoComida from './components/veterinarias/Veterinaria1/verproductocomida';
import VerProductoJuguete from './components/veterinarias/Veterinaria1/verproductojuguetes';
import VerProductoAccesorios from './components/veterinarias/Veterinaria1/verproductoaccesorios';


import MisPedidos from './components/Pedidosusuarios/mispedidos';

import Seguros from './components/seguros/seguros';


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
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="PreLogin">
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
        <Stack.Screen name='SolicitudPaseo' component={SolicitudPaseo} />
        
        <Stack.Screen name="pago" component={pago} />
        <Stack.Screen name='bveterinaria' component={bveterinaria}/>
        <Stack.Screen name="domicilio" component={domicilio} />


        <Stack.Screen name="vet1" component={Vet1Screen} /> 
        <Stack.Screen name="vet1calificacion" component={vet1calificacion} />
        <Stack.Screen name="baño" component={baño} />
        <Stack.Screen name="vet1bañocita" component={Vet1BañoCitasScreen} />
        <Stack.Screen name="petshop" component={petshop} /> 
        <Stack.Screen name= 'vet1comida' component={Vet1Comida}/>
        <Stack.Screen name="vet1juguetes" component={vet1juguetes} />
        <Stack.Screen name="vet1accesorios" component={vet1accesorios} />
        <Stack.Screen name="vet1dr" component={Vet1DrScreen} />
      
        <Stack.Screen name="vet1citasdr" component={Vet1CitasDrScreen} />

        <Stack.Screen name="citasdr" component={CitasDrPanel} />

        <Stack.Screen name="citasdratendidas" component={CitasDrAtendidas} />

        <Stack.Screen name="citasbaños" component={CitasBañoPanel} />
        <Stack.Screen name="citasbañoatendidas" component={CitasBañosAtendidas} />
        <Stack.Screen name="despapetshop" component={DespachadosPetShopPanel } />
        <Stack.Screen name="productostiendaañadir" component={ProductosPanel } />

        
        <Stack.Screen name="Contactanos" component={Contactonos} />
        <Stack.Screen name="ServicioFuneraria" component={ServicioFuneraria} />
        <Stack.Screen name="Basico" component={Basico} />
        <Stack.Screen name="Premium" component={Premium} />
        <Stack.Screen name="CuponesQR" component={CuponesQRadmin} />
        <Stack.Screen name="paneladmin" component={PanelAdmin} />
        <Stack.Screen name="pepetshop" component={PedidosPetShopPanel} />
        <Stack.Screen name="misproductos" component={MisProductos} />
        <Stack.Screen name="accesorios" component={Accesorios} />
        <Stack.Screen name="comida" component={Comida} />
        <Stack.Screen name="productos" component={Productos} />
        


        <Stack.Screen name="vet2" component={Vet2Screen} />
        <Stack.Screen name="vet2serviciosmedicos" component={Vet2ServiciosMedicos} />
        <Stack.Screen name="vet2consultas" component={Vet2Consultas} />


        
        <Stack.Screen name="vet3" component={Vet3Screen} />
        <Stack.Screen name="vet4" component={Vet4Screen} />
        <Stack.Screen name="vet5" component={Vet5Screen} />
        <Stack.Screen name="vet6" component={Vet6Screen} />
        <Stack.Screen name="vet7" component={Vet7Screen} />
        <Stack.Screen name="vet8" component={Vet8Screen} />
        <Stack.Screen name="vet9" component={Vet9Screen} />


        <Stack.Screen name="proximamente" component={ProximamentePanel} />


        <Stack.Screen name="badieguar" component={Badiegard} />
        <Stack.Screen name="Adieguar1" component={AdieguarScreen} />



        <Stack.Screen name="verproductocomida" component={VerProductoComida} />
        <Stack.Screen name="verproductojuguetes" component={VerProductoJuguete} />
        <Stack.Screen name="verproductoaccesorios" component={VerProductoAccesorios} />
        <Stack.Screen name="mispedidos" component={MisPedidos} />

        <Stack.Screen name="seguros" component={Seguros} />




      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
