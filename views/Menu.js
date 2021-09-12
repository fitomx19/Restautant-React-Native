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

const Menu = () =>{

    // Context de firebase
    const {menu, obtenerProductos} = useContext(FirebaseContext);
    //context pedido
    const {seleccionarPlatillo} = useContext(PedidoContext)
    //Hook para reedireccionar
    const navigation = useNavigation();
    useEffect(() =>{
        obtenerProductos();
       // console.log(menu)
    },[]);
    const mostrarHeading = (categoria, i) => {
        if(i > 0){
        const categoriaAnterior = menu[i-1].categoria;
        if(categoriaAnterior !== categoria){
            return(
                <Separator style={styles.Separator}>
                    <Text style={styles.separadorTexto}>{categoria}</Text>
                </Separator>
                )
             }
        }else{
            return(
                <Separator style={styles.Separator} >
                    <Text style={styles.separadorTexto} >{categoria}</Text>
                </Separator>
                )
        }
        
        
    }
    return(
       <Container style={globalStyles.contenedor}>
          
               <Content style={{ backgroundColor: '#FFF'}}>
                   <List>
                        {menu?.map((platillo,i) =>{
                            const {imagen,descripcion,categoria,id,nombre,precio} = platillo
                            return(
                                <Fragment key={id}>
                                    {mostrarHeading(categoria, i)}
                                    <ListItem onPress ={ () =>{
                                        const {existencia, ...platillo2} = platillo;
                                        seleccionarPlatillo(platillo2);
                                        //SE COLOCA 
                                        navigation.navigate("DetallePlatillo");
                                    }}>
                                        <Thumbnail large square source={{uri: imagen}}/>
                                        <Body>
                                            <Text>{nombre}</Text>
                                            <Text note nomberOfLines={2}>
                                                {descripcion}
                                            </Text>
                                            <Text>Precio ${precio}</Text>
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

export default Menu;