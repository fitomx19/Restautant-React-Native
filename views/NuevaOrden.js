import React from 'react'
import {View, StyleSheet} from 'react-native'
import {Button,Text, Container } from 'native-base'
import globalStyles  from '../styles/global'
import {  useNavigation } from '@react-navigation/native'

const NuevaOrden = () =>{
    const navigation = useNavigation();
    return(
      

       <Container style={globalStyles.contenedor}>
           <View style={[globalStyles.contenido,styles.contenido]}>
               <Button 
                    style={globalStyles.boton} 
                    rounded 
                    onPress={ () => navigation.navigate('Menu')}
                    block >
                        <Text style={globalStyles.botonTexto}>
                            Nueva Orden
                        </Text>
               </Button>
           </View>

           <View style={[globalStyles.contenido,styles.contenido]}>
               <Button 
                    style={globalStyles.boton} 
                    rounded 
                    onPress={ () => navigation.navigate('ModificarPedido')}
                    block >
                        <Text style={globalStyles.botonTexto}>
                           Modificar Ordenes
                        </Text>
               </Button>
           </View>

           <View style={[globalStyles.contenido,styles.contenido]}>
               <Button 
                    style={globalStyles.boton} 
                    rounded 
                    onPress={ () => navigation.navigate('ImprimirOrdenes')}
                    block >
                        <Text style={globalStyles.botonTexto}>
                           Imprimir Ordenes
                        </Text>
               </Button>
           </View>


          
       </Container>
     

    )
}

const styles = StyleSheet.create({
    contenido:{
        flexDirection: 'column',
        justifyContent: 'center'
    }
})
export default NuevaOrden;