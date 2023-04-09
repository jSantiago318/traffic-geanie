import { Box, Button, Center, FormControl, Heading, Icon, Input, Text, VStack, } from 'native-base';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { HomeScreen } from '../HomeScreen.js';
import React from 'react';
import {useNavigation} from "@react-navigation/native";
import useStore from "../../store/useStore";

const useInputState = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};
export const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [phone, setPhone] = React.useState('');

  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const login = useStore(state => state.login)
  
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
 
  const renderInputIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={!secureTextEntry ? 'eye' : 'eye-off'}/>
    </TouchableWithoutFeedback>
  ); 
  
  const StarIcon = (props) => (
    <Icon {...props} name='arrow-circle-right-outline'/>
  )
  
  return (
    
      <View
        style={[
          styles.container,
          {
            flexDirection: 'column',
          },
        ]}>
     <Center w="100%">
      <Box safeArea p="2" w="90%" maxW="290" py="8">
        <Heading size="lg" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }} fontWeight="semibold">
          Welcome
        </Heading>
        <Heading mt="1" color="coolGray.600" _dark={{
        color: "warmGray.200"
      }} fontWeight="medium" size="xs">
          Sign up to continue!
        </Heading>
        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input />
          </FormControl>
          <FormControl>
            <FormControl.Label>Phone number</FormControl.Label>
            <Input />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input type="password" />
          </FormControl>
          <FormControl 
            passwordRules="required: lower; required: upper; required: digit; required: [-]; minlength: 8;"
            password
           >
            <FormControl.Label>Confirm Password</FormControl.Label>
            <Input type="password" />
          </FormControl>
          <Button mt="2" colorScheme="indigo"   onPress={() => {
            login(email, password, phone)
          }}
           >
            Sign up
          </Button>
        </VStack>
      </Box>
    </Center>
      </View>
    
    
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title:{
    fontSize: 24,
    padding: 10,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    marginTop: 5
  },
  buttonBack:{
    width: 300,
    top:0,
    backgroundColor: '#046C1C',
    borderColor: '#046C1C',
  },
  input: {
    borderRadius: 4,
    fontSize: 24,
    padding: 10,
    width: '100%',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }, subtitle: {
    alignItems: 'flex-start' ,
    width: '100%' ,
    marginTop: 10,    
  }
});
