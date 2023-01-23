import {Button, Divider, Icon, Input, Layout, StyleService, Text} from '@ui-kitten/components';
import {LoginScreen, RegisterScreen} from "../screens/auth";

import {BottomTabsNavigator} from "./BottomTabsNavigator";
import {DetailsScreen} from "../screens/DetailsScreen";
import { HomeScreen } from '../screens/HomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import useStore from "../store/useStore";
import { MapScreen } from '../screens/MapScreen';
import { TripScreen } from '../screens/TripScreen';
const {Navigator, Screen} = createStackNavigator();
const leftIcon = (props) => (
  <Icon {...props} name='arrow-left-outline'/>
);
export const AppNavigator = () => {
  const isSignedIn = useStore(state => state.isSignedIn)

  return (
    <NavigationContainer>
      <Navigator>
        {isSignedIn ? (
          <>
            <Screen options={{headerShown: false}} name={'TabsNavigation'} component={BottomTabsNavigator}/>
            <Screen name='Details' component={DetailsScreen}/>
            <Screen name='Home' component={HomeScreen}/>
            <Screen options={{headerShown: false}}  name='Map' component={MapScreen}/>
            <Screen options={{headerShown: false}}  name='Trip' component={TripScreen}/>
          </>
        ) : (
          <>
            <Screen options={{headerShown: false}} name={'Login'} component={LoginScreen}/>
            <Screen  name={'SignUp'} component={RegisterScreen} />
          </>
        )}
      </Navigator>
    </NavigationContainer>
  )
};


const styles = StyleService.create({
  button: {
    margin: 4,
    fontSize: 12,
  },
});
