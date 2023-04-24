import * as React from 'react';

import { HomeScreen, MapScreen, SettingsScreen, TicketScreen } from '../screens';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const AppStack = () => {
  return (

    <Drawer.Navigator >
      <Drawer.Screen name='Map' component={MapScreen} />
      <Drawer.Screen name='Settings' component={SettingsScreen} />
      <Drawer.Screen name='Home' component={HomeScreen} />
      <Drawer.Screen name='Ticket' component={TicketScreen} />
    </Drawer.Navigator>
    
  );
};
