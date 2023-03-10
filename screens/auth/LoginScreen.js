import {
 Button,
 Stack,
 Text
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
        <Image
          style={styles.logo}
          source={logo}
          resizeMode={'contain'}
        />
        <Text style={styles.title}>
          Mayaguez Bus Tracker
        </Text>
        

        <Button size={'medium'} style={styles.button}
        onPress={navigateRegister}> Sign Up </Button>

        <Button size={'medium'} style={styles.button}
        onPress={login} >Login </Button>
         
        
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
