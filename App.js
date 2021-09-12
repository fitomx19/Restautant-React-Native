import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator();

import NuevaOrden from './views/NuevaOrden'
import Menu from './views/Menu'
import DetallePlatillo from './views//DetallePlatillo'
import FormularioPlatillo from './views/FormularioPlatillo'
import ResumenPedido from './views/ResumenPedido'
import ProgresoPedido from './views/ProgresoPedido'
import ImprimirOrdenes from './views/ImprimirOrdenes'
import DetallePedido from './views/DetallePedido'
//Componentes
import BotonResumen from './components/BotonResumen'

//importar state de context
import  FirebaseState from './context/firebase/firebaseState'
import  PedidoState from './context/pedidos/pedidosState'

const App = () => {

  return (
    <>
    <FirebaseState>
      <PedidoState>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerStyle:{backgroundColor: '#FFDA00'},headerTitleStyle:{fontWeight: 'bold'},headerTintColor: '#000'}}>
          <Stack.Screen name="Nueva Orden" component={NuevaOrden} options={{title: "Nueva Orden"}} />
          <Stack.Screen name="ImprimirOrdenes" component={ImprimirOrdenes} options={{title: "ImprimirOrdenes"}} />
          <Stack.Screen name="Menu" component={Menu} options={{title: "Menu", headerRight: props => <BotonResumen/>}} />
          <Stack.Screen name="DetallePlatillo" component={DetallePlatillo} options={{title: "Detalle Pedido"}} />
          <Stack.Screen name="FormularioPlatillo" component={FormularioPlatillo} options={{title: "Formulario Platillo"}} />
          <Stack.Screen name="ResumenPedido" component={ResumenPedido} options={{title: "Resumen Pedido"}} />
          <Stack.Screen name="ProgresoPedido" component={ProgresoPedido} options={{title: "Progreso Pedido"}} />
          <Stack.Screen name="DetallePedido" component={DetallePedido} options={{title: "DetallePedido"}} />
      </Stack.Navigator>
    </NavigationContainer>
    </PedidoState>
    </FirebaseState>
    </>
  );
};



export default App;
