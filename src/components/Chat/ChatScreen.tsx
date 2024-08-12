import React,{useEffect,useState} from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Button,KeyboardAvoidingView, Platform, StyleProp, ViewStyle } from "react-native";
import firestore, { onSnapshot } from '@react-native-firebase/firestore';
import { Bubble,GiftedChat ,IMessage} from "react-native-gifted-chat";
import auth from '@react-native-firebase/auth';
import { useNavigation,useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { formatTimestamp } from "../../utils/helpers";


export default function ChatScreen() {
    const [messages, setMessages] = useState([]);
    const {userId ,userName} = useRoute().params as { userId: any, userName: any };
    const navigation = useNavigation();
    const currentUser:any = auth().currentUser;

    useEffect(() => {
        const chatId = [currentUser.uid,userId].sort().join('_');
        const chatRefence = firestore().collection('chats').doc(chatId);

        const unsubscribe= chatRefence.onSnapshot((snapshot)=>{
            if(snapshot.exists){
                const chatData:any = snapshot.data();
                setMessages(chatData.messages);
            }
        }
        );
    return () => unsubscribe();
    },[userId,currentUser.uid]);

    const onSend = async (newMessages: IMessage[] = []) => {
        const chatId = [currentUser.uid,userId].sort().join('_');
        const chatRefence = firestore().collection('chats').doc(chatId);

        const formattedMessages = newMessages.map((message:any) => ({
            
                ...message,
                createdAt: new Date(message.createdAt),
            
        }));
        try{
            await chatRefence.set({
                messages: GiftedChat.append(messages,formattedMessages),
            },
        {merge:true}
        );
        }
        catch(e){
            console.log('Error sending message',e);
        }
    };
     
    const  renderBubble = (props:any) => {
        const { currentMessage } = props;
        const isReceived = currentMessage.user._id === currentUser.uid;
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#4CAF50',
                    },
                    left: {
                        backgroundColor: '#2196F3',
                        marginLeft: isReceived ? 0 : 10,
                    },
                    containerStyle: {
                        left: {
                            marginLeft: isReceived ? -40 : 0,
                        },
                    },
                }}
            />
        );
    };

    const renderChatFooter = () => {   
        return <View style={{height:20}}/>
              
    };

    return (    
        <LinearGradient colors={['#000', '#fff']} style={{flex:1}}>
            <GiftedChat
                messages={messages}
                onSend={(newMessages) => onSend(newMessages)}
                user={{
                    _id: currentUser.uid,
                    name: currentUser.displayName,
                  
                }}
                renderTime={(props) => (
                    <View style={props.containerStyle as StyleProp<ViewStyle> }>
                    <Text style={{marginHorizontal:10,marginBottom:5,fontSize:10,marginTop:40,
                        color:props.position==="left"?"black":"white"
                    }}>
                    
                        {
                            props.currentMessage?.createdAt instanceof Date
                            ? props.currentMessage.createdAt.toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,})
                            : formatTimestamp(props.currentMessage?.createdAt)

                            }
                    

                    </Text>
                    </View>
                )  }
                renderDay={ () => null}
                renderBubble={renderBubble}
                renderChatFooter={renderChatFooter}
                placeholder="Type your message here..."
                
                renderUsernameOnMessage
                messagesContainerStyle={{
                    backgroundColor: 'transparent',
                    padding: 5,
                    // height:170,
                    // multiline: true,

                }}
            />
            {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />}

        </LinearGradient>
    );
}