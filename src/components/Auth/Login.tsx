import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation: any = useNavigation();
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [code, setCode] = useState('');
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const signInWithPhoneNumber = async () => {
    try {
      // Validate phone number
      const phoneregex = /$/;
      if (!phoneregex.test(phoneNumber)) {
        alert('Please enter a valid phone number');
        return;
      }
      // Send OTP
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (e:any) {
      alert('Error sending OTP' + e.message);
      console.log('Error sending OTP', e);
    }
  };

  const confirmCode = async () => {
    // Validate OTP
    try {
      if (!code || code.length !== 6) {
        alert('Please enter a valid 6 digit OTP');
        return;
      }

      const userCredential = await confirm?.confirm(code);
      const user: any = userCredential?.user;

      // Check if user is already registered or new
      const userDocument = await firestore().collection('users').doc(user?.uid).get();

      if (userDocument.exists) {
        // User is already registered
        navigation.navigate('Dashboard');
      } else {
        // User is new
        navigation.navigate('Detail', { user: user.uid });
      }
    } catch (e) {
      alert('Error verifying OTP');
      console.log('Error verifying OTP', e);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000', position: 'relative' }}>
      <View style={{ flex: 1, backgroundColor: '#000', position: 'absolute', top: 0, left: 0, right: 0, height: '25%' }} />
      <View style={{ flex: 1, backgroundColor: '#ADD8e6', padding: 20, position: 'absolute', borderTopLeftRadius: 100, top: '25%', left: 0, right: 0, bottom: 0 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 40, marginTop: 20, textAlign: 'center' }}>DEXWireNews ChatApp</Text>
        {/* Logo */}
        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
          <Image source={require('../../../assets/images/dex2.png')} style={{ width: 150, height: 150 }} />
        </View>

        <View>
          {!confirm ? (
            <>
              <Text style={{ marginBottom: 20, fontSize: 18, color: '#808080' }}>
                Enter your phone number with country code
              </Text>
              <TextInput
                placeholder="e.g, +1 655-333 4444"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                style={{
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderColor: 'black',
                  marginBottom: 30,
                  height: 50,
                  width: '100%',
                  borderRadius: 10,
                }}
              />
              <TouchableOpacity
                onPress={signInWithPhoneNumber}
                style={{
                  backgroundColor: '#007BFF',
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 20,
                  alignItems: 'center',
                }}>
                <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Verify Phone number</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={{ marginBottom: 20, fontSize: 18, color: '#808080' }}>
                Enter the OTP you received
              </Text>
              <TextInput
                placeholder="Enter OTP"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                style={{
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderColor: 'black',
                  marginBottom: 30,
                  height: 50,
                  width: '100%',
                  borderRadius: 10,
                }}
              />
              <TouchableOpacity
                onPress={confirmCode}
                style={{
                  backgroundColor: '#007BFF',
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 20,
                  alignItems: 'center',
                }}>
                <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Verify OTP</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
