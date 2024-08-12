import React , {useState } from "react";
import { View, Text, TextInput,TouchableOpacity,Dimensions } from "react-native";
import firestore from '@react-native-firebase/firestore';
import DatePicker from "react-native-date-picker";
import { Picker } from "@react-native-picker/picker";

export default function Detail({route, navigation}:any) {
    const {uid} = route.params;

    const [name, setName] = useState('');
    const [dob, setDob] = useState(new Date()); 
    const [gender, setGender ] = useState('Male')
    const [phone, setPhone] = useState('')

    const saveDetails = async () => {
        try {
            await firestore().collection('users').doc(uid).set({
                name,
                dob: dob.toISOString().slice(0,10),
                gender,
                displayName: name,
            });
            navigation.navigate('Dashboard');
        } catch (e) {
            alert('Error saving details');
            console.log('Error saving details', e);
        }
    }
    return (
        <View style={{flex: 1, backgroundColor:'#000',position:'relative'}}>
            <View style={{flex: 1, backgroundColor:'#000',position:'absolute',top:0,left:0,right:0,height:'25%'}}/>
            <View style={{flex:1,backgroundColor:'#ADD8E6',padding:20,borderTopLeftRadius:100,position:'absolute',top:'25%',left:0,right:0,bottom:0}}>
                <Text style={{fontSize:20,fontWeight:'bold',marginBottom:40,marginTop:150}}>Enter Your Details</Text>
                <TextInput
                    placeholder='Name'
                    style={{backgroundColor:'blacck',borderWidth:1,marginBottom:30,paddingHorizontal:10,borderRadius:10,height:50,width:'100%'}}
                    value={name}
                    onChangeText={setName}
                />
                <DatePicker
                    date={dob}
                    onDateChange={setDob}
                    mode='date'
                    style={
                        {height:80,width:Dimensions.get('window').width,marginBottom:30}
                    }
                />
                <Picker
                 style={
                    {height:80,width:Dimensions.get('window').width,marginBottom:30}
                }
                selectedValue={gender}
                onValueChange={setGender}
                >
                    <Picker.Item label='Male' value={'Male'}/>
                    <Picker.Item label='Female' value={'Female'}/>
                    <Picker.Item label='Others' value={'Others'}/>
                </Picker>
                    <TouchableOpacity
                        onPress={saveDetails}
                        style={{backgroundColor:'#007BFF',padding:10,borderRadius:5,marginBottom:20,alignItems:'center'}}
                    >
                        <Text style={{color:'white',fontSize:22,fontWeight:'bold'}}>Save Details</Text>
                    </TouchableOpacity>
            </View>
        </View>
    )
}


            
           