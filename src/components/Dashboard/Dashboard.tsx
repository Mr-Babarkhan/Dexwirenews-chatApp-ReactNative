import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Button } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import auth from '@react-native-firebase/auth';
import { useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

type User = {
  id: string;
  name: string;
  [key: string]: any; // Adjust this type based on your user document fields
};

type RootStackParamList = {
  ChatScreen: { userId: string; userName: string };
  Login: undefined;
  // Add other routes here if needed
};

export default function Dashboard({ route }: any) {
  const [users, setUsers] = useState<User[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [userName, setUserName] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await firestore().collection('users').get();
        const userdata:any= usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(userdata);
      } catch (e) {
        console.log('Error fetching users', e);
      }
    }

    //fetch current username name from firebase
    const fetchUserName = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userDocument = await firestore().collection('users').doc(currentUser.uid).get();
          setUserName(userDocument.data()?.name || '');
        }
      } catch (e) {
        console.log('Error fetching username', e);
      }
    }

    //fetch users and username when the screen is focused
    if (isFocused) {
      fetchUsers();
      fetchUserName();
    }
  }, [isFocused])

  const navigateToChat = (userId: string, userName: string) => {
    //navigate to chat screen with user id and user name
    navigation.navigate('ChatScreen', { userId, userName });
  }

  const handlelogout = async() => {
    try {
     await auth().signOut();
     //navigate to login screen after logout
        navigation.navigate("Login");
    } catch (e) {
        console.log('Error signing out', e);
        }
    }

  return (
    <View style={{
        flex: 1,
        backgroundColor: '#000',
        position: 'relative',
    }}>
      <View style={{flex:1,backgroundColor:'#000',position:'absolute'
        ,top:0,left:0,right:0,height:'20%',justifyContent:'center'}}>
        <Text style={{fontSize:32,fontWeight:'bold',margin:10,color:'#fff'}}>Home</Text>

        <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
        }}>
                <Text style={{
                    fontSize:20,
                    color:'#fff',
                    margin:10,
                }}>Welcome,{userName}</Text>
                <TouchableOpacity onPress={handlelogout}>
                    <Text style={{
                        fontSize:24,
                        color:'#43A047',
                        margin:10,
                        fontWeight:'bold'
                    }}>Logout</Text>
                </TouchableOpacity>
        </View>
      </View>

      <View style={{
            flex:1,
            backgroundColor:'#ADD8E6',
            position:'absolute',
            top:'20%',
            left:0,
            right:0,
            bottom:0,
      }}>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            marginBottom:5,
                            overflow:'hidden',
                            borderRadius:10,
                        }}
                        onPress={() => navigateToChat(item.id, item.name)}
                    >
                        <LinearGradient
                            colors={['rgba(0,0,0,1)', 'rgba(128,128,128,0)']}
                            style={{
                                padding:15,
                                borderRadius:10,
                            }}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                        <Text style={{fontSize:20,color:'white',fontWeight:'bold'}}>{item.name}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            />
      </View>
    </View>
  );
}
