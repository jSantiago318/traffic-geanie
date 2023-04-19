import * as React from 'react';

import { HomeScreen, MapScreen, SettingsScreen, TicketScreen } from '../screens';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const AppStack = () => {
  return (
    <NavigationContainer>

    <Drawer.Navigator >
      <Drawer.Screen name='Home' component={HomeScreen} />
      <Drawer.Screen name='Map' component={MapScreen} />
      <Drawer.Screen name='Ticket' component={TicketScreen} />
      <Drawer.Screen name='Settings' component={SettingsScreen} />
      {
        getAuth().currentUser ? (
          <Drawer.Screen name='Logout' component={HomeScreen} />
        ) : (
          <Drawer.Screen name='Login' component={HomeScreen} />
            
        )
      }
    </Drawer.Navigator>
    </NavigationContainer>
    
  );
};
