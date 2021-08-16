import React, {useReducer} from 'react'
import firebaseReducer from './firebaseReducer'
import FirebaseContext from './firebaseContext'
import firebase from '../../firebase';
import {OBTENER_PRODUCTOS_EXITO} from '../../types/index'
import _ from 'lodash'
//pasarle un reducer

const FirebaseState = props => {
    console.log(firebase);

    const initialState = {
        menu: []
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
    return (
        <FirebaseContext.Provider
            value={{
                menu: state.menu,
                firebase,
                obtenerProductos
            }}
        >
            {props.children}
        </FirebaseContext.Provider>
    )
}

export default  FirebaseState