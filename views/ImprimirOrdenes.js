import React, {useContext,useEffect,Fragment} from 'react'
import { useNavigation } from '@react-navigation/native'
import {
    Container,
    Separator,
    Content,
    List,
    ListItem,
    Thumbnail,
    Text,
    Left,
    Body
} from 'native-base'

import globalStyles  from '../styles/global'
import FirebaseContext from '../context/firebase/firebaseContext'
import PedidoContext from '../context/pedidos/pedidosContext'
import { StyleSheet } from 'react-native'
import pedidosReducer from '../context/pedidos/pedidosReducer'

const ImprimirOrdenes = () =>{
   
    

    // Context de firebase
    const {pedidos, obtenerPedidos} = useContext(FirebaseContext);
    const {menu, obtenerProductos} = useContext(FirebaseContext);
    const {imprimir, ImprimirPedido} = useContext(PedidoContext)
    const {limpiar, LimpiarPedido} = useContext(PedidoContext)
    //Hook para reedireccionar
    const navigation = useNavigation();
    useEffect(() =>{
        obtenerPedidos();
        obtenerProductos();
        
    },[]);
    

    return(
       <Container style={globalStyles.contenedor}>
          
          <Content style={{ backgroundColor: '#FFF'}}>
                   <List >
                       
                        {pedidos?.map((ordenes,i) =>{
                            const {creado,completado,orden,total,id} = ordenes
                            var date = new Date(creado * 1000);
                            var hours = date.getHours();
                            var minutes = "0" + date.getMinutes();
                            var seconds = "0" + date.getSeconds();
                            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                            //console.log(orden[0])
                            return(
                                
                                <Fragment key={id}>
                                    
                                    <ListItem onPress ={ () =>{
                                         const ticket = {
                                            orden,total,id,creado,imprimir
                                        }
                                        //console.log(pedido)
                                        //Navegar hacia el Resumen
                                        ImprimirPedido(ticket)
                                        navigation.navigate("DetallePedido");
                                    }}>
                                       
                                        <Body>
                                            <Text>id: {id}</Text>
                                            <Text>Pedido: {orden[0].nombre}</Text>
                                            <Text>Cantidad: {orden[0].cantidad}</Text>
                                            <Text note nomberOfLines={4}>
                                              {formattedTime}
                                             
                                            </Text>
                                           
                                           
                                            
                                            <Text>Total ${total}</Text>
                                        </Body>
                                    </ListItem>

                                </Fragment>
                            )
                        })}
                   </List>
               </Content>
       </Container>
    )
}

const styles = StyleSheet.create({
    Separator:{
        backgroundColor: '#000'
    },
    separadorTexto:{
        color: '#FFDA00',
        fontWeight: 'bold'
    }
})

export default ImprimirOrdenes;