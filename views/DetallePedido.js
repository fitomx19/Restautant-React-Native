 import React, {Component,useContext,Fragment} from 'react';
 import moment from 'moment';
 import 'moment/locale/es';
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
     TextInput,
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
    import { img64 } from '../components/img64';
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
             debugMsg: '',
             propina: 0
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
            let mesa = ticket.imprimir[0].mesa
            console.log(ticket.imprimir[0])
            let hora = ticket.imprimir[0].creado
            let identificador = ticket.imprimir[0].id
            let img32 = img64
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
                     TOTAL: ${total}.00 sin IVA
                     TOTAL: ${total+total*0.16}.00 con IVA
                 </Text>
                
                 <Text style={{flex:1}}>
                    Mesa: ${mesa} 
                    Fecha: {moment(hora).locale('es').format('LLL')} 
                     
                 </Text>
                 </View>
                 
              
                
                    <Button   onPress={async () => {
                  await  BluetoothEscposPrinter.printPic(img32, {width: 400});
            await  BluetoothEscposPrinter.printText("\r\n",{});
            //await  BluetoothEscposPrinter.printText("Horario: ", {});
            await  BluetoothEscposPrinter.printText("Direccion: Puerto Acapulco numero 8 col ampl. Casas Aleman", {});
            await  BluetoothEscposPrinter.printText("\r\n",{});
    
            await  BluetoothEscposPrinter.printText("\r\n",{});
            await  BluetoothEscposPrinter.printText("Fecha: " + moment(hora).locale('es').format('LLL'), {});
            await  BluetoothEscposPrinter.printText("\r\n",{});
            await  BluetoothEscposPrinter.printText("# Pedido " + identificador, {});
            //await  BluetoothEscposPrinter.printText("Mesa " + mesa, {});
            await  BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {});
            
            
            for (let i = 0; i < aux.length; i++) {
                await  BluetoothEscposPrinter.printText("Nombre producto: " + aux[i].nombre,{});
                await  BluetoothEscposPrinter.printText("\r\n",{});
                await  BluetoothEscposPrinter.printText("Cantidad: " + aux[i].cantidad,{});
                await  BluetoothEscposPrinter.printText("\r\n",{});
                await  BluetoothEscposPrinter.printText("Precio: $" + aux[i].precio + ".00",{});
                await  BluetoothEscposPrinter.printText("\r\n\r\n\r\n",{});
            }
            await  BluetoothEscposPrinter.printText("Subtotal: $" + parseInt(total)-(parseInt(total)*0.16) + ".00", {});
            await  BluetoothEscposPrinter.printText("\r\n",{});
            await  BluetoothEscposPrinter.printText("IVA: $" + parseInt((total*0.16)) + ".00", {});
            await  BluetoothEscposPrinter.printText("\r\n",{});
         
          
            if(this.state.propina){
                await  BluetoothEscposPrinter.printText("Propina: $" + parseFloat((total)*(parseFloat(this.state.propina)/100)) + ".00", {});
                await  BluetoothEscposPrinter.printText("Total: $" + parseFloat((total))+parseFloat((total)*(parseFloat(this.state.propina)/100)) + ".00", {});
            }else{
                await  BluetoothEscposPrinter.printText("Total: $" + parseFloat((total)) + ".00", {});
            }

            await  BluetoothEscposPrinter.printText("\r\n",{});
            await  BluetoothEscposPrinter.printText("GRACIAS POR SU VISITA!", {});
            await  BluetoothEscposPrinter.printText("\r\n",{});
            await  BluetoothEscposPrinter.printText("SIGUENOS EN NUESTRAS", {});
            await  BluetoothEscposPrinter.printText("\r\n",{});
            await  BluetoothEscposPrinter.printText("REDES SOCIALES", {});
            await  BluetoothEscposPrinter.printText("\r\n",{});
            await  BluetoothEscposPrinter.printText("Facebook|Instagram|TikTok", {});
            await  BluetoothEscposPrinter.printText("\r\n",{});
            await  BluetoothEscposPrinter.printText("@snacksville.mx", {});
            await  BluetoothEscposPrinter.printText("\r\n",{});
            await  BluetoothEscposPrinter.printText("www.snacksville.com.mx", {});
            await  BluetoothEscposPrinter.printText("\r\n\r\n\r\n",{});
            await  BluetoothEscposPrinter.printText("\r\n\r\n\r\n",{});
            
           
        }} 
     
        
        title="Imprimir ticket"
        
        
            />
        <Text style={styles.title}> <Text>  Insertar Propina</Text> </Text>
        <TextInput style={styles.margen}
        onChangeText={(text) => this.setState({ propina: text})}
        
      />
        <Text> {this.state.propina ? <Text>Propina: {this.state.propina}%</Text>: null}</Text>
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
     margen:{
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
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