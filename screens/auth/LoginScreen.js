import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import {
 Box,
 Button,
 Center,
 FormControl,
 HStack,
 Heading,
 Input,
 Link,
 Stack,
 Text,
 VStack
} from 'native-base';
import { Image, StyleSheet, View } from 'react-native';
import React, {useEffect, useState} from 'react';

import logo from '../../assets/NICRlogo.png'
import { makeRedirectUri } from 'expo-auth-session';
import {useNavigation} from "@react-navigation/native";
import useStore from "../../store/useStore";

WebBrowser.maybeCompleteAuthSession()

export const LoginScreen = () => {
  const login = useStore(state => state.login)
  const navigation = useNavigation();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const navigateHome = () => {
    navigation.navigate('Home');
  };
  const navigateRegister = () => {
    navigation.navigate('SignUp');
  };
  const navigateCredits = () => {
    navigation.navigate('Credits');
  };



  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '927083664739-r93lmpreeoonjjfie4svvule96n7d6v1.apps.googleusercontent.com',
    androidClientId: "927083664739-0eq799mreu14ghsh5bhakogg3usfnrvb.apps.googleusercontent.com",
    iosClientId: "927083664739-m6p6p0vl0302jh5hdol6sco5ldao9fki.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    redirectUri: makeRedirectUri({
      redirect: "com.joshua.mayabus",
    }),
  })

  

  useEffect(() => {
    if (response?.type === "success") {
      setToken(response.authentication.accessToken);
      getUserInfo();
    }
  }, [response, token]);

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };

 
  return (
      <View style={styles.layout1}>
        <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Image
          style={styles.logo}
          source={logo}
          resizeMode={'contain'}
        />
        
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }}>
          Mayaguez Bus Tracker
        </Heading>
        <Heading mt="1" _dark={{
        color: "warmGray.200"
      }} color="coolGray.600" fontWeight="medium" size="xs">
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input autoCapitalize='none' onChangeText={text => setEmail(text)}
               />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input onChangeText={text => setPassword(text)} type="password" />
            <Link _text={{
            fontSize: "xs",
            fontWeight: "500",
            color: "indigo.500"
          }} alignSelf="flex-end" mt="1">
              Forget Password?
            </Link>
          </FormControl>

          {userInfo === null ? (
        <Button
          title="Sign in with Google"
          mt="2" colorScheme="indigo"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        > 
        <Text>Sign in with Google</Text>
        </Button>
      ) : (
        <Text >{userInfo.name}</Text>
      )}





          <Button mt="2" colorScheme="indigo"
           onPress={
            async () => {
      try {
        const url = 'https://www.api.pr-oba.live/getUser?email='+email + '&password='+password
        // console.log(url)
        const response = await fetch(url);
        const json = await response.json();
        if(json.length > 0){
          console.log(json)
          // useStore.setState({userId: json[0].userId})
          login
        }
   
      } catch (error) {
        console.error(error);
      }
         }
           }
           >
            Sign in
          </Button>
      
          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="coolGray.600" _dark={{
            color: "warmGray.200"
          }}>
              I'm a new user.
            </Text>
            <Link _text={{
            color: "indigo.500",
            fontWeight: "medium",
            fontSize: "sm"
          }} onClick={() => {
              navigateRegister
          }} onPress={() => {
              navigateRegister
          }} >
              Sign Up
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
        
      </View>
  );
};

const styles = StyleSheet.create({
  logo:{
    width: '80%',
    height: '20%',
    marginBottom: 20,
    marginTop: 70,
  },
  title:{
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 60,
    marginTop: 40,
    padding: 10,
  },
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  layout1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 5,
    backgroundColor: '#046C1C',
    borderRadius: 5,
    height: '6%',
    width: '60%',
    fontWeight: 'bold',
    borderColor: 'transparent',
  },
  button2: {
    margin: 5,
    backgroundColor: 'transparent',
    borderRadius: 5,
    height: '2%',
    width: '60%',
    fontWeight: 'bold',
    borderColor: 'transparent',
  }
    
  
});
