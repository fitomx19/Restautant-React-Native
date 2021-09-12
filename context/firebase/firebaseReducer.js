import {OBTENER_PRODUCTOS_EXITO,OBTENER_PEDIDOS_EXITO} from '../../types/index'

export default (state,action) =>{
    switch (action.type){
        case OBTENER_PRODUCTOS_EXITO:
            return{
                ...state,
                menu: action.payload
            }
            case OBTENER_PEDIDOS_EXITO:
            return{
                ...state,
                menu: action.payload,
                pedidos: action.payload
            }
        default:    
            return state;

    }
}