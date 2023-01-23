import {Button, Divider, Icon, Layout, StyleService, Text} from '@ui-kitten/components';
import { Image, View } from 'react-native';

import React from 'react';
import logo from '../../assets/logo-uprm.png'
import {useNavigation} from "@react-navigation/native";
import useStore from "../../store/useStore";

const FacebookIcon = (props) => (
  <Icon name='facebook' {...props} />
);

export const LoginScreen = () => {
  const login = useStore(state => state.login)
  const navigation = useNavigation();

  const navigateRegister = () => {
    navigation.navigate('SignUp');
  };

  return (
      <Layout style={styles.layout1}>
        <Image
          style={styles.logo}
          source={logo}
        />
        <Text style={styles.title}>
          Welcome to the UPRM App!
        </Text>

        <Button style={styles.button}
        onPress={navigateRegister} >Sign Up </Button>

        <Button style={styles.button}
        onPress={login} >Login </Button>
          
      </Layout>
  );
};

const styles = StyleService.create({
  logo:{
    width: 200,
    height: 200,
    marginBottom: 20,
    marginTop: 70,
  },
  title:{
    fontSize: 24,
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
    
    fontSize: 20,
    minWidth: '60%',
    fontWeight: 'bold',
    borderColor: 'transparent',
  }
    
  
});
