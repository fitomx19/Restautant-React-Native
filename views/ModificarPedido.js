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


const ModificarPedido = () => {

    const {pedidos, obtenerPedidos} = useContext(FirebaseContext);
    const {pedido,ContinuarPedido} = useContext(PedidoContext)
    const navigation = useNavigation();


    useEffect(() =>{
        obtenerPedidos();
        //obtenerProductos();
        
    },[]);

    return ( 
    <>
          <Container style={globalStyles.contenedor}>
           <Content style={globalStyles.contenido}>
               <Text style={globalStyles.titulo}>Continuar Pedido</Text>
               <List >
                       
                       {pedidos?.map((ordenes,i) =>{
                           let {creado,completado,orden,total,id,mesa} = ordenes
                           let formattedTime = moment(creado).format('LLL');
                           //console.log(orden[0])
                           return(
                               <Fragment key={id}>
                                   <Separator style={styles.Separator} >
                                       <Text style={styles.separadorTexto} >{formattedTime}</Text>
                                   </Separator>
                                   <ListItem onPress ={ () =>{
                                        const ticket = {
                                           orden
                                       }
                                       //console.log(pedido)
                                       //Navegar hacia el Resumen
                                       console.log(ticket)
                                       ContinuarPedido(ticket)
                                       navigation.navigate("Menu");
                                   }}>
                                       <Body>
                                            {mesa? <Text>Mesa: {mesa}</Text>:null}
                                            {orden[0] ? <Text> {orden[0].nombre}</Text> : null}
                                            {orden[1] ? <Text> {orden[0].nombre}</Text> : null}
                                            {orden[2] ? <Text> {orden[0].nombre}</Text> : null}
                                            <Text>Total ${total}</Text>
                                       </Body>
                                   </ListItem>
                               </Fragment>
                           )
                       })}
                  </List>
            </Content>
            </Container>  
    </> );
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

 
export default ModificarPedido;