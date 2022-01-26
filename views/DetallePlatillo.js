import React, {useContext,useState} from 'react'
import PedidoContext from '../context/pedidos/pedidosContext'
import {Image,ScrollView} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';             
import { Container,Content,Footer,FooterTab,Button,Body,Text,H1,Card,CardItem } from 'native-base'
import  globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';

const DetallePlatillo = () =>{
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState([
      {label: 'Salsa 1', value: 'Salsa 1'},
      {label: 'Salsa 2', value: 'Salsa 2'},
      {label: 'Salsa 3', value: 'Salsa 3'},
      {label: 'Salsa 4', value: 'Salsa 4'}
    ]);

    const {platillo} = useContext(PedidoContext);
    const { nombre,imagen, descripcion,precio,categoria} = platillo;
    //redireccionar
    const navigation = useNavigation();
    return(
       <Container style={globalStyles.contenedor}>
           <Content style={globalStyles.contenido}>
               <H1 style={globalStyles.titulo}>{nombre}</H1>
               <Card>
                   <CardItem>
                       <Body>
                       
                           <Image style={globalStyles.imagen} source={{uri: imagen}}/>
                           <Text style={{marginTop:20}}>{descripcion}</Text>
                           <Text style={globalStyles.cantidad}>Precio: ${precio}.00</Text>
                    {//aqui va el sistema para listar los posibles datos a editar
                    }           
               {categoria === "MEOW" ? 
                        
                        <DropDownPicker 
                        multiple={true}
                        min={0}
                        max={5}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        listMode="SCROLLVIEW"  
                     />
          
                :null}
            <Text>
            {"\n\n\n\n\n\n"}
            </Text>
            </Body>
                   </CardItem>
               </Card>
              
             
           </Content>
           <Footer>
               <FooterTab>
                   <Button style={globalStyles.boton} onPress={ () => navigation.navigate("FormularioPlatillo")}>
                       <Text style={globalStyles.botonTexto}>Ordenar Platillo</Text>
                   </Button>
               </FooterTab>
           </Footer>
       </Container>
    )
}

export default DetallePlatillo;