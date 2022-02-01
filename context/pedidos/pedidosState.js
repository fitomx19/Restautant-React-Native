import React, {useReducer} from 'react'
import PedidosReducer from './pedidosReducer'
import PedidosContext from './pedidosContext'
import {
    SELECCIONAR_PRODUCTO,
    CONFIRMAR_ORDENAR_PLATILLOS,LIMPIAR_TODO,
    MOSTRAR_RESUMEN,
    ELIMINAR_PRODUCTO,
    PEDIDO_ORDENADO,
    IMPRIMIR_PLATILLOS,LIMPIAR_PLATILLOS,CONTINUAR_PEDIDO
} from '../../types'

//pasarle un reducer

const PedidoState = props => {
  

    const initialState = {
        pedido: [],
        platillo: null,
        total:0,
        idPedido: '',
        id: '',
       
        }

    // use Reducer con dispatch para ejecutar las funciones

    const [state,dispatch] = useReducer(PedidosReducer,initialState);
    //Selecciona el producto que el usuario desea ordenar
    const seleccionarPlatillo = platillo =>{
        dispatch({
            type: SELECCIONAR_PRODUCTO,
            payload: platillo
            //payload cambia el state
        })
        console.log(platillo)
    } 

    //CUANDO EL USUARIO CONFIRMA UN PLATILLO
    const guardarPedido = pedido =>{
        console.log(pedido)
        dispatch({
            type: CONFIRMAR_ORDENAR_PLATILLOS,
            payload: pedido
        })
    }

    //CUANDO EL USUARIO CONFIRMA UNA ORDEN
    const ImprimirPedido = imprimir =>{
        dispatch({
            type: IMPRIMIR_PLATILLOS,
            payload: imprimir
        })
    }

    //CUando el usuario quiere continuar una orden
    const ContinuarPedido = pedido =>{
        console.log(pedido)
        console.log(pedido.id)
        if(pedido.id){
            dispatch({
                type: CONTINUAR_PEDIDO,
                payload: pedido
            })     
        }else{
            null
        }
       
    }
       //CUANDO EL USUARIO CONFIRMA UNA ORDEN
       const LimpiarPedido = limpiar =>{
        dispatch({
            type: IMPRIMIR_PLATILLOS,
            payload: limpiar
        })
    }



    //muestra el total a pagar en el resumen
    const mostrarResumen = total => {
        dispatch({
            type: MOSTRAR_RESUMEN,
            payload: total
        })

    }
    //elimina un articulo del carrito
    const eliminarProducto = id =>{
        dispatch({
            type: ELIMINAR_PRODUCTO,
            payload: id
        })
    }
    const pedidoRealizado = id =>{
        dispatch({
            type:PEDIDO_ORDENADO,
            payload:id
        })
    }
    const limpiar = limpiar =>{
        dispatch({
            type:PEDIDO_ORDENADO,
            payload:limpiar
        })
    }
    return (
        <PedidosContext.Provider
            value={{
                pedido: state.pedido,
                platillo: state.platillo,
                total: state.total,
                idPedido: state.idPedido,
                imprimir: state.imprimir,
                id: state.id,
                
                seleccionarPlatillo,
                ContinuarPedido,
                guardarPedido,
                mostrarResumen,
                limpiar,
                eliminarProducto,
                pedidoRealizado,
                ImprimirPedido,
                LimpiarPedido
            }}
        >
            {props.children}
        </PedidosContext.Provider>
    )
}

export default  PedidoState