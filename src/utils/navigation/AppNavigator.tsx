import React,{useState,useEffect} from "react";
import {createStackNavigator} from "@react-navigation/stack";
import auth from "@react-native-firebase/auth";
import Login from "../../components/Auth/Login";
import Detail from "../../components/Auth/Detail";
import Dashboard from "../../components/Dashboard/Dashboard";
import ChatScreen from "../../components/Chat/ChatScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    // Handle user state changes
    const onAuthStateChanged = (result:any) => {
        setUser(result);
        if (initializing) setInitializing(false);
    };

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    return (
        <Stack.Navigator initialRouteName={user ? "Dashboard" : "Login"}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Detail" component={Detail} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>
    );
}

export default AppNavigator;