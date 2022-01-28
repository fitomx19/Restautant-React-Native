import React, {useContext,useEffect,useState} from 'react'

import PedidoContext from '../context/pedidos/pedidosContext'
import {Alert, StyleSheet,TextInput,Picker} from 'react-native'
import { Container,Content,List,ListItem, Thumbnail,Text,Left,Body,Button,H1,Footer,FooterTab } from 'native-base'
import  globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';
import firebase from '../firebase';

import moment from 'moment' 


const ResumenPedido = () =>{
    const navigation = useNavigation();
    const [text, setText] = useState('');
    const [mesa, setMesa] = useState('');
    const [comensales, setComensales] = useState('');
    const [bebidas, setBebidas] = useState('');

    const [selectedValue, setSelectedValue] = useState("-seleccione mesa-");
    const [selectedValue2, setSelectedValue2] = useState("-¿hay bebidas?-");
    const [selectedValue3, setSelectedValue3] = useState("-Numero de comensales-");
    //context pedido
    const {pedido,total,mostrarResumen,eliminarProducto,pedidoRealizado} = useContext(PedidoContext)
    useEffect(()=>{
        calcularTotal();
    },[pedido])
    const calcularTotal = () =>{
        let nuevoTotal = 0;
        nuevoTotal = pedido.reduce((nuevoTotal,articulo) => nuevoTotal + articulo.total, 0)
        console.log(nuevoTotal)
        mostrarResumen(nuevoTotal)
    }

    //redireccion a progreso de pedido
    const progresoPedido = () =>{
        Alert.alert(
            'Revisa tu pedido',
            'Una vez que realizas tu pedido, no podras cambiarlo',
            [
                {
                    text: 'Confirmar',
                    onPress: async() =>{
                        //escribir en firebase 
                        //crear un objeto
                        const pedidoObj = {
                            tiempoentrega: 0,
                            completado:false,
                            total: Number(total),
                            orden: pedido,
                            detalles: text,
                            mesa:mesa,
                            bebidas:bebidas,
                            comensales:comensales,
                            creado: moment().valueOf()
                        }
                        try {
                            const pedido = await firebase.db.collection('ordenes').add(pedidoObj);
                            pedidoRealizado(pedido.id)
                        } catch (error) {
                            console.log(error)
                        }
                        //redireccionar a progreso
                        navigation.navigate("ProgresoPedido")
                    }
                },
                {
                    text: 'Revisar' , style: 'cancel'
                }
            ]
        )
    }
    //Elimina el producto de el arreglo de productos
    const confirmarEliminacion = id =>{
        Alert.alert(
            '¿Deseas Eliminar este articulo=',
            'Una vez eliminado , tienes que ir al menú para agregarlo',
            [
                {
                    text: 'Confirmar',
                    onPress: () =>{
                      //Elimar del state
                      eliminarProducto(id);
                      //calcular
                    }
                },
                {
                    text: 'Cancelar' , style: 'cancel'
                }
            ]
        )

    }

    return(
       <Container style={globalStyles.contenedor}>
           <Content style={globalStyles.contenido}>
               <H1 style={globalStyles.titulo}>Resumen Pedido</H1>
               {pedido.map( (platillo, i) => {
                    const {cantidad,nombre,imagen,id,precio} = platillo
                    return(
                        <List key={id + i}>
                            <ListItem thumbnail>
                                <Left>
                                    <Thumbnail large square source={{uri: imagen}}/>
                                </Left>
                                <Body>
                                    <Text>{nombre}</Text>
                                    <Text>Cantidad: {cantidad} </Text>
                                    <Text>Precio: $ {precio}</Text>
                                    <Button onPress={() => confirmarEliminacion(id)} full danger style={{marginTop:20}}>
                                        <Text style={globalStyles.botonTexto, {color: '#FFF'}} >Eliminar</Text>
                                    </Button>
                                </Body>
                            </ListItem>
                        </List>
                    )
               })}
                <TextInput
        style={{height: 40}}
        placeholder="Escribe los detalles de el pedido!"
        onChangeText={text => setText(text)}
        defaultValue={text}
      />
<Text>¿Qué mesa estan usando?</Text>
<Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => setMesa(itemValue)}
      >
           
        <Picker.Item label="Mesa 1" value="1" />
        <Picker.Item label="Mesa 2" value="2" />
        <Picker.Item label="Mesa 3" value="3" />
        <Picker.Item label="Mesa 4" value="4" />
        <Picker.Item label="Mesa 5" value="5" />
        <Picker.Item label="Mesa 6" value="6" />
        <Picker.Item label="Mesa 7" value="7" />
        <Picker.Item label="Mesa 8" value="8" />
        <Picker.Item label="Mesa 9" value="9" />
        <Picker.Item label="Mesa 10" value="10" />
        <Picker.Item label="Mesa 11" value="11" />
        <Picker.Item label="Mesa 12" value="12" />
        <Picker.Item label="Mesa 13" value="13" />
        <Picker.Item label="Mesa 14" value="14" />
        <Picker.Item label="Mesa 15" value="15" />
      </Picker>
      <Text>¿El pedido lleva bebidas?</Text>
      <Picker
        selectedValue={selectedValue2}
        style={{ height: 50, width: 250 }}
        onValueChange={(itemValue2, itemIndex) => setBebidas(itemValue2)}
      >
        <Picker.Item label="Si hay bebidas" value="1" />
        <Picker.Item label="No hay bebidas" value="2" />
      </Picker>
    <Text>¿Cuántos comensales?</Text>
      <Picker
        selectedValue={selectedValue3}
        style={{ height: 50, width: 250 }}
        onValueChange={(itemValue3, itemIndex) => setComensales(itemValue3)}
      >
        <Picker.Item label="1" value="1" />
        <Picker.Item label="2" value="2" />
        <Picker.Item label="3" value="3" />
        <Picker.Item label="4" value="4" />
        <Picker.Item label="5" value="5" />
        <Picker.Item label="6" value="6" />
        <Picker.Item label="7" value="7" />
        <Picker.Item label="8" value="8" />
      </Picker>

                <Text style={globalStyles.cantidad}>Total a Pagar: $ {total}</Text>

<Button
    onPress={ () => navigation.navigate('Menu') }
    style={ {marginTop: 30}}
    full
    dark
>
    <Text style={[globalStyles.botonTexto, { color: '#FFF'}]}>Seguir Pidiendo</Text>
</Button>
</Content>

<Footer>
<FooterTab>
    <Button
        onPress={ () => progresoPedido()  }
        style={[globalStyles.boton ]}
        full
    >
        <Text style={globalStyles.botonTexto}>Ordenar Pedido</Text>
    </Button>
</FooterTab>
</Footer>

</Container>
    )
}

export default ResumenPedido;