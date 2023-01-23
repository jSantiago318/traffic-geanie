import {Button, Divider, Icon, Input, Layout, StyleService, Text} from '@ui-kitten/components';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { HomeScreen } from '../HomeScreen';
import React from 'react';
import {useNavigation} from "@react-navigation/native";
import useStore from "../../store/useStore";

const useInputState = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);
  return { value, onChangeText: setValue };
};
export const RegisterScreen = () => {
  const navigation = useNavigation();
  const basicInputState = useInputState();
  const [value, setValue] = React.useState('');
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
  const navigateHome = () => {
    navigation.navigate('Home');
  };
  const StarIcon = (props) => (
    <Icon {...props} name='arrow-circle-right-outline'/>
  );
  return (
    
      <View
        style={[
          styles.container,
          {
            // Try setting `flexDirection` to `"row"`.
            flexDirection: 'column',
          },
        ]}>
        <View style={{flex: 1, justifyContent:'center' }} >
            <Text style={styles.title}>
            Sign Up
          </Text>
       </View>
        <View style={{flex: 2, justifyContent:'center', alignItems: 'center' }} >
        <Input
        style={styles.input}
        placeholder='email'
        {...basicInputState}
      />
      <Input
          style={styles.input}
          placeholder='password'
          value={value}
          secureTextEntry={secureTextEntry}
          onChangeText={setValue}
          accessoryRight={renderInputIcon}
        />
        </View>
        <View style={{flex: 3, justifyContent:'center', alignItems: 'center' }} >
        <Button style={styles.buttonBack} accessoryRight={StarIcon} onPress={login} >
        Sign Up
      </Button>
      </View>
      </View>
    
    
  );
};

const styles = StyleService.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title:{
    fontSize: 24,
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
    margin: 2,
    borderRadius: 4,
    padding: 10,
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
