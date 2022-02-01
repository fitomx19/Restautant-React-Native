import {
    SELECCIONAR_PRODUCTO,CONTINUAR_PEDIDO,LIMPIAR_TODO,
    CONFIRMAR_ORDENAR_PLATILLOS,MOSTRAR_RESUMEN,ELIMINAR_PRODUCTO,PEDIDO_ORDENADO,IMPRIMIR_PLATILLOS,LIMPIAR_PLATILLOS
} from '../../types'


export default (state,action) =>{
    switch (action.type){
        case SELECCIONAR_PRODUCTO:
            return{
                ...state,
                platillo: action.payload
            }
        case CONFIRMAR_ORDENAR_PLATILLOS:
            return{
                ...state,
                pedido: [...state.pedido, action.payload]
            }
        case IMPRIMIR_PLATILLOS:
                return{
                    ...state,
                    imprimir: [...state.pedido, action.payload]
        }
        case LIMPIAR_PLATILLOS:
            return{
                ...state,
                pedido: null
        }
        case CONTINUAR_PEDIDO:
            return{
                ...state,
                pedido: action.payload.orden,
                id: action.payload.id
        }
        case MOSTRAR_RESUMEN:
            return{
                ...state,
                total: action.payload
            }
        case ELIMINAR_PRODUCTO:
            return{
                ...state,
                pedido: state.pedido.filter(articulo => articulo.id !== action.payload)
            }
        case PEDIDO_ORDENADO:
            return{
                ...state,
                pedido: [],
                total:0,
                idPedido: null,
                id:""
            }
            case LIMPIAR_TODO:
                return{
                    ...state,
                    pedido: [],
                    total:0,
                    idPedido: "",
                    id: ""
                }

        default:    
            return state;

    }
}