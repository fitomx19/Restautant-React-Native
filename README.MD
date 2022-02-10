# React Native Restaurante

Esta es una aplicacion creada con el fin de administrar los pedidos, donde en esta los usuarios podran
realizarr pedidos de alimentos a un restaurante donde este creado el menu.
Funciona con FIrebase en la parte de los datos , a continuacion hablare de como ejecutarlo e instalarlo correctamente

## Instalacion

Requerimos Node.js
Xcode con emulador de iOS

Tambien puede funcionar Android Studio con su respectivo sdk
Recuerden instalar las dependencias una vez estando en el directorio raiz
```bash
npm i
```
Importante: 
Crear con tus respectivas credenciales de firebase un archivo llamado config.js en la carpeta firebase para su correcto uso.

Un ej es como este
```javascript
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// firebase/config.js

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };

  export default firebaseConfig
```

## Uso
Se desarrollo y probo en un entorno ubuntu, por lo cual necesito de ejecutar dos pestañas,
una con el Metro y otra con el launcher de Android

```javascript


# Iniciar METRO
npm run start

# Iniciar androinpx react-native run-android

# Renderizar app 
Haz los pasos necesarios para obtener tu clave 
cd android && ./gradlew assembleRelease
```
Este es unicamente el entorno de desarrollo
## Contribucion
Se aceptan pull request! 

## License
[MIT](https://choosealicense.com/licenses/mit/)