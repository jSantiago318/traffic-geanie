import * as React from 'react';

import { FeedbackScreen, HomeScreen, MapScreen, SettingsScreen, TicketScreen } from '../screens';

import { Entypo } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const AppStack = () => {
  return (

    <Drawer.Navigator  >
      <Drawer.Screen name='Feedback' component={FeedbackScreen} />
      <Drawer.Screen name='Map' component={MapScreen} />
      <Drawer.Screen name='Home' component={HomeScreen}   />
      <Drawer.Screen name='Ticket' component={TicketScreen} />
      <Drawer.Screen name='Settings' component={SettingsScreen} />

    </Drawer.Navigator>
    
  );
};
