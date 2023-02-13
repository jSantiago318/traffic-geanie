import {Button, Divider, Icon, Layout, StyleService, Text} from '@ui-kitten/components';
import { Image, View } from 'react-native';

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
      <Layout style={styles.layout1}>
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
         <Button appearance='ghost' status='basic' onPress={navigateCredits}   style={styles.button2}>Credits </Button>
          
      </Layout>
  );
};

const styles = StyleService.create({
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
