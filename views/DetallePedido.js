 import React, {Component,useContext,Fragment} from 'react';
 import {ActivityIndicator,
     Platform,
     StyleSheet,
     Text,
     View,
     Button,
     ScrollView,
     DeviceEventEmitter,
     NativeEventEmitter,
     Switch,
     TouchableOpacity,
     Dimensions,
     ToastAndroid} from 'react-native';

     import {
        Container,
        Separator,
        Content,
        List,
        ListItem,
        Thumbnail,
        Left,
        Body
    } from 'native-base';
 import {BluetoothEscposPrinter, BluetoothManager, BluetoothTscPrinter} from "react-native-bluetooth-escpos-printer";
 import { useNavigation } from '@react-navigation/native'
 import PedidoContext from '../context/pedidos/pedidosContext'
import firebase from '../firebase';

import FirebaseContext from '../context/firebase/firebaseContext'


 var {height, width} = Dimensions.get('window');

 export default class DetallePedido extends Component {
 
    static contextType = PedidoContext
   

     _listeners = [];
 
     constructor(props) {
       
         super(props);
         this.state = {
             devices: null,
             pairedDs:[],
             foundDs: [],
             bleOpend: false,
             loading: true,
             boundAddress: '',
             debugMsg: ''
         }
     }
     
     

     componentDidMount() {

            
            
         BluetoothManager.isBluetoothEnabled().then((enabled)=> {
             this.setState({
                 bleOpend: Boolean(enabled),
                 loading: false
             })
         }, (err)=> {
             err
         });
 
         if (Platform.OS === 'ios') {
             let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
             this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
                 (rsp)=> {
                     this._deviceAlreadPaired(rsp)
                 }));
             this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, (rsp)=> {
                 this._deviceFoundEvent(rsp)
             }));
             this._listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, ()=> {
                 this.setState({
                     name: '',
                     boundAddress: ''
                 });
             }));
         } else if (Platform.OS === 'android') {
             this._listeners.push(DeviceEventEmitter.addListener(
                 BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, (rsp)=> {
                     this._deviceAlreadPaired(rsp)
                 }));
             this._listeners.push(DeviceEventEmitter.addListener(
                 BluetoothManager.EVENT_DEVICE_FOUND, (rsp)=> {
                     this._deviceFoundEvent(rsp)
                 }));
             this._listeners.push(DeviceEventEmitter.addListener(
                 BluetoothManager.EVENT_CONNECTION_LOST, ()=> {
                     this.setState({
                         name: '',
                         boundAddress: ''
                     });
                 }
             ));
             this._listeners.push(DeviceEventEmitter.addListener(
                 BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, ()=> {
                     ToastAndroid.show("Device Not Support Bluetooth !", ToastAndroid.LONG);
                 }
             ))
         }
     }
 
     componentWillUnmount() {
         //for (let ls in this._listeners) {
         //    this._listeners[ls].remove();
         //}
     }
 
     _deviceAlreadPaired(rsp) {
         var ds = null;
         if (typeof(rsp.devices) == 'object') {
             ds = rsp.devices;
         } else {
             try {
                 ds = JSON.parse(rsp.devices);
             } catch (e) {
             }
         }
         if(ds && ds.length) {
             let pared = this.state.pairedDs;
             pared = pared.concat(ds||[]);
             this.setState({
                 pairedDs:pared
             });
         }
     }
 
     _deviceFoundEvent(rsp) {//alert(JSON.stringify(rsp))
         var r = null;
         try {
             if (typeof(rsp.device) == "object") {
                 r = rsp.device;
             } else {
                 r = JSON.parse(rsp.device);
             }
         } catch (e) {//alert(e.message);
             //ignore
         }
         //alert('f')
         if (r) {
             let found = this.state.foundDs || [];
             if(found.findIndex) {
                 let duplicated = found.findIndex(function (x) {
                     return x.address == r.address
                 });
                 //CHECK DEPLICATED HERE...
                 if (duplicated == -1) {
                     found.push(r);
                     this.setState({
                         foundDs: found
                     });
                 }
             }
         }
     }
 
     _renderRow(rows){
         let items = [];
         for(let i in rows){
             let row = rows[i];
             if(row.address) {
                 items.push(
                     <TouchableOpacity key={new Date().getTime()+i} style={styles.wtf} onPress={()=>{
                     this.setState({
                         loading:true
                     });
                     
                     BluetoothManager.connect("86:67:7A:01:44:08")
                         .then((s)=>{
                             this.setState({
                                 loading:false,
                                 boundAddress:"86:67:7A:01:44:08",
                                 name:row.name || "MTP-II"
                             })
                         },(e)=>{
                             this.setState({
                                 loading:false
                             })
                             alert(e);
                         })
 
                 }}><Text style={styles.name}>{row.name || "UNKNOWN"}</Text><Text
                         style={styles.address}>{row.address}</Text></TouchableOpacity>
                 );
             }
         }
         return items;
     }
    
 
     render() {
            let ticket = this.context;
            
            
            let aux = ticket.imprimir[0].orden;
           
           
           
            let nombre = ticket.imprimir[0].orden[0].nombre
            let cantidad = ticket.imprimir[0].orden[0].cantidad
            let total = ticket.imprimir[0].total
            let identificador = ticket.imprimir[0].id
            let img64 = "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"
         return (
           
             <ScrollView style={styles.container}>
                
                 <Text>{this.state.debugMsg}</Text>
              
                 <Text style={styles.title}> <Text>  Encender Bluetooth antes de escanear</Text> </Text>
                 <View>
             
                     <Button  disabled={this.state.loading || !this.state.bleOpend} onPress={()=>{
                         this._scan();
                     }} title="Escanear Impresoras"/>
                 </View>
                 <Text  style={styles.title}>Conectado a:<Text style={{color:"blue"}}>{!this.state.name ? 'Ningun Dispositivo' : this.state.name}</Text></Text>
                 <Text  style={styles.title}>Encontrados (tocar  para  conectar):</Text>
                 {this.state.loading ? (<ActivityIndicator animating={true}/>) : null}
                 <View style={{flex:1,flexDirection:"column"}}>
                 {
                     this._renderRow(this.state.foundDs)
                 }
                 </View>
                 <Text  style={styles.title}>Enlazados:</Text>
                 {this.state.loading ? (<ActivityIndicator animating={true}/>) : null}
                 <View style={{flex:1,flexDirection:"column"}}>
                 {
                     this._renderRow(this.state.pairedDs)
                 }
                 </View>
 
                 <View style={{flexDirection:"row",justifyContent:"space-around",paddingVertical:30}}>
                 <Text style={{flex:1}}>
                     id pedido: {identificador}
                 </Text>
                
                
                 <Text style={{flex:1}}>
                     total: {total}
                 </Text>
                 </View>
                 
              
                
                    <Button  onPress={async () => {
            await  BluetoothEscposPrinter.printText(" LOS MISERABLES ", {});
            await  BluetoothEscposPrinter.printText("\r\n",{});
            await  BluetoothEscposPrinter.printPic(img64, {width: 200, left: 80});
            await  BluetoothEscposPrinter.printText("\r\n",{});
            await  BluetoothEscposPrinter.printText("# Pedido " + identificador, {});
            await  BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {});
            
            
            for (let i = 0; i < aux.length; i++) {
                await  BluetoothEscposPrinter.printText("Nombre producto: " + aux[i].nombre,{});
                await  BluetoothEscposPrinter.printText("\r\n",{});
                await  BluetoothEscposPrinter.printText("Cantidad: " + aux[i].cantidad,{});
                await  BluetoothEscposPrinter.printText("\r\n",{});
                await  BluetoothEscposPrinter.printText("Precio: $" + aux[i].precio + ".00",{});
                await  BluetoothEscposPrinter.printText("\r\n\r\n\r\n",{});
            }
            await  BluetoothEscposPrinter.printText("Total: $" + total + ".00", {});
            await  BluetoothEscposPrinter.printText("\r\n\r\n\r\n",{});
          
            
           
        }} title="Imprimir ticket"/>
             </ScrollView>
         );
     }
    
     
 
     _selfTest() {
         this.setState({
             loading: true
         }, ()=> {
             BluetoothEscposPrinter.selfTest(()=> {
             });
 
             this.setState({
                 loading: false
             })
         })
     }
 
     _scan() {
         this.setState({
             loading: true
         })
         BluetoothManager.scanDevices()
             .then((s)=> {
                 var ss = s;
                 var found = ss.found;
                 try {
                     found = JSON.parse(found);//@FIX_it: the parse action too weired..
                 } catch (e) {
                     //ignore
                 }
                 var fds =  this.state.foundDs;
                 if(found && found.length){
                     fds = found;
                 }
                 this.setState({
                     foundDs:fds,
                     loading: false
                 });
             }, (er)=> {
                 this.setState({
                     loading: false
                 })
                 alert('error' + JSON.stringify(er));
             });
     }
 
 
 }





  


 
 const styles = StyleSheet.create({
     container: {
         flex: 1,
         backgroundColor: '#F5FCFF',
     },
 
     title:{
         width:width,
         backgroundColor:"#eee",
         color:"#232323",
         paddingLeft:8,
         paddingVertical:4,
         textAlign:"left"
     },
     wtf:{
         flex:1,
         flexDirection:"row",
         justifyContent:"space-between",
         alignItems:"center"
     },
     name:{
         flex:1,
         textAlign:"left"
     },
     address:{
         flex:1,
         textAlign:"right"
     }
 });

 /*
   <Button onPress={async () =>{
                    for (let i = 0; i < aux.length; i++) {
                        let element = aux[i];
                        alert(aux[i].nombre)
                       alert(aux[i].cantidad)
                        alert(aux[i].precio)
                        
                    }
                }} title="Test"/>
                */