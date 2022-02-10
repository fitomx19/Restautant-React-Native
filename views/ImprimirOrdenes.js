import React, {useContext,useEffect,Fragment,useState} from 'react'
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
    const [pedidoOrdenado, setordenarPedido] = useState([]);

    //Hook para reedireccionar
    const navigation = useNavigation();
    useEffect(() =>{
        obtenerPedidos();
        obtenerProductos();
        ordenarPedidos();
        
    },[]);

    let auxiliar = []
    let arregloOrdenado = []
    let items = []

    var ordenarPedidos = function () {
        for (let i = 0; i < pedidos.length; i++) {
            auxiliar.push(pedidos[i].creado)
         }
 
         console.log(auxiliar)
         auxiliar.sort(function(a, b){return b - a});
         console.log(auxiliar)
 
         arregloOrdenado = auxiliar.map(orden => {
             return pedidos.find(x => x.creado === orden)
           })
         setordenarPedido(arregloOrdenado);
  };

  console.log(pedidoOrdenado)
      /*
    objs = [
    { order: 1, id: 121 },
    { order: 2, id: 122 },
    { order: 3, id: 123 },
    { order: 4, id: 124 },
    { order: 5, id: 125 },]
    
    orden = [5, 3, 2, 4, 1]

                let items = orden.map(orden => {
            return objs.find(x => x.order === orden)
            })
      */

    return(
       <Container style={globalStyles.contenedor}>
          <Content style={{ backgroundColor: '#FFF'}}>
                   <List >


                        {pedidoOrdenado?.map((ordenes,i) =>{
                            let {creado,orden,total,id} = ordenes
                            //later
                            let formattedTime = moment(creado).format('LLL');

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