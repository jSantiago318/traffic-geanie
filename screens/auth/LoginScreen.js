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

import React from 'react';
import logo from '../../assets/NICRlogo.png'
import {useNavigation} from "@react-navigation/native";
import useStore from "../../store/useStore";

export const LoginScreen = () => {
  const login = useStore(state => state.login)
  const navigation = useNavigation();

  const navigateRegister = () => {
    navigation.navigate('SignUp');
  };
  const navigateCredits = () => {
    navigation.navigate('Credits');
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
            <FormControl.Label>Email ID</FormControl.Label>
            <Input />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input type="password" />
            <Link _text={{
            fontSize: "xs",
            fontWeight: "500",
            color: "indigo.500"
          }} alignSelf="flex-end" mt="1">
              Forget Password?
            </Link>
          </FormControl>
          <Button mt="2" colorScheme="indigo" onPress={login}>
            Sign in
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="coolGray.600" _dark={{
            color: "warmGray.200"
          }}>
              I'm a new user.{" "}
            </Text>
            <Link _text={{
            color: "indigo.500",
            fontWeight: "medium",
            fontSize: "sm"
          }} onPress={navigateRegister} >
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
