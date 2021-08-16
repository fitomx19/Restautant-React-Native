import React, {useContext,useState,useEffect} from 'react'

import PedidoContext from '../context/pedidos/pedidosContext'
import {Image} from 'react-native'
import { Container,Content,Form,Icon,Input,Grid,Col,Button,Text,Footer,FooterTab } from 'native-base'
import  globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

const FormularioPlatillo = () =>{

    //state para cantidad
    const [cantidad,guardarCantidad] = useState(1);
    const [total,guardarTotal] = useState(0);
    
    const {platillo,guardarPedido} = useContext(PedidoContext);
    const {precio} = platillo;

    const navigation = useNavigation();

    //en cuanto el componente carga, calcular la cantidad a pagar
    useEffect(()=>{
        calculartotal();
    },[cantidad]);

    //calcular el total del platillo por su cantidad
    const calculartotal = () =>{
        const totalPagar = precio * cantidad
        guardarTotal(totalPagar)
    }

    //Almacenar cantidad en input
    const calcularCantidad = cantidad =>{

    }

    const incrementarUno = () => {
        const nuevaCantidad = parseInt(cantidad) + 1;
        guardarCantidad(nuevaCantidad);
    }

    const decrementarUno = () => {
       
        if (cantidad > 1){
            const nuevaCantidad = parseInt(cantidad) - 1;
            guardarCantidad(nuevaCantidad);
        }

       
    }

    const confirmarOrden = () => {
        Alert.alert(
            '¿Deseas confirmar tu pedido?',
            'Un pedido modificado ya no se podrá monificar',
            [{
                text: 'Confirmar',
                onPress:()=>{
                    //Almacenar el pedido al pedido principal
                    const pedido = {
                        ...platillo,cantidad,total
                    }
                    //console.log(pedido)
                    //Navegar hacia el Resumen
                    guardarPedido(pedido)
                    navigation.navigate("ResumenPedido");
                },
            },{
                text: 'Cancelar',
                style: 'cancel'
            }]
        )
    }
    return(
        <Container>
            <Content>
                <Form>
                    <Text style={globalStyles.cantidad}></Text>
                        <Grid>
                            <Col>
                                    <Button onPress={ () => decrementarUno()} props dark style={{ height: 80, justifyContent: 'center', width:'100%' }}>
                                        <Icon style={{fontSize: 40}} name="remove" />
                                    </Button>
                            </Col>
                            <Col>
                                    <Input style={{textAlign: 'center', fontSize:20}} onChangeText={(cantidad)=>guardarCantidad(cantidad)} keyboardType="numeric" value={cantidad.toString()} />
                            </Col>
                            <Col>
                            <Button  onPress={ () => incrementarUno()} props dark style={{ height: 80, justifyContent: 'center', width:'100%' }}>
                                        <Icon style={{fontSize: 40}}name="add" />
                                    </Button>
                            </Col>
                        </Grid>
                        <Text style={globalStyles.cantidad}>
                            Subtotal: $ {total}
                        </Text>
                    
                </Form>
            </Content>
            <Footer>
               <FooterTab>
                   <Button style={globalStyles.boton} onPress={ () => confirmarOrden()}>
                       <Text style={globalStyles.botonTexto}>Agregar al pedido</Text>
                   </Button>
               </FooterTab>
           </Footer>
        </Container>
    )
}

export default FormularioPlatillo;