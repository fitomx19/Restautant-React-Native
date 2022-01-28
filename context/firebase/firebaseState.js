import React, {useReducer} from 'react'
import firebaseReducer from './firebaseReducer'
import FirebaseContext from './firebaseContext'
import firebase from '../../firebase';
import {OBTENER_PRODUCTOS_EXITO,OBTENER_PEDIDOS_EXITO} from '../../types/index'
import _ from 'lodash'
//pasarle un reducer

const FirebaseState = props => {
    console.log(firebase);

    const initialState = {
        menu: [],
        pedidos:[]
    }

    // use Reducer con dispatch para ejecutar las funciones

    const [state,dispatch] = useReducer(firebaseReducer,initialState);
    //funcion para traer los productos
    const obtenerProductos = () =>{
        dispatch({
            type: OBTENER_PRODUCTOS_EXITO
        });

        //consultar firebase
          firebase.db
        .collection('productos')
        .where('existencia', '==', true) // traer solo los que esten en existencia
        .onSnapshot(manejarSnapshot);

    function manejarSnapshot(snapshot) {
        let platillos = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });

        //ordenar por categoria con lodash
        platillos = _.sortBy(platillos, 'categoria');
        //console.log(platillos)
        //Tenemos resultados de la base de datos
            dispatch({
                type: OBTENER_PRODUCTOS_EXITO,
                payload: platillos
            });
       
        }

    }



    const obtenerPedidos = () =>{
        dispatch({
            type: OBTENER_PEDIDOS_EXITO
        });

        //consultar firebase
          firebase.db
        .collection('ordenes').orderBy('creado').startAt(1528445969388).endAt(9999999999999).limitToLast(20).
        onSnapshot(manejarSnapshotPedidos);
        
        

    function manejarSnapshotPedidos(snapshot) {
        let ordenes = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });

        //ordenar por categoria con lodash
        ordenes = _.sortBy(ordenes, 'creado');
        //console.log(platillos)
        //Tenemos resultados de la base de datos
            dispatch({
                type: OBTENER_PEDIDOS_EXITO,
                payload: ordenes
            });
       
        }

    }






    return (
        <FirebaseContext.Provider
            value={{
                menu: state.menu,
                pedidos: state.pedidos,
                firebase,
                obtenerProductos,
                obtenerPedidos
            }}
        >
            {props.children}
        </FirebaseContext.Provider>
    )
}

export default  FirebaseState