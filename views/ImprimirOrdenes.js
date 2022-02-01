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
import moment from 'moment' 
let date = new Date;

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
                            let {creado,completado,orden,total,id} = ordenes
                            let formattedTime = moment(creado).format('LLL');
                            //console.log(orden[0])
                            return(
                                <Fragment key={id}>
                                    <Separator style={styles.Separator} >
                                        <Text style={styles.separadorTexto} >{formattedTime}</Text>
                                    </Separator>
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
                                            <Text>Pedido: {orden ? orden[0].nombre : null}</Text>
                                            <Text>Cantidad: {orden ? orden[0].cantidad:null}</Text>
                                            <Text>Total ${total}</Text>
                                        </Body>
                                    </ListItem>
                                </Fragment>
                            )})}
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