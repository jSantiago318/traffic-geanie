import * as React from 'react';

import { FeedbackScreen, HomeScreen, MapScreen, SettingsScreen, TicketScreen } from '../screens';

import { Entypo } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const AppStack = () => {
  React.useEffect(() => {
    (
      async () => {
        const { status } = await requestTrackingPermissionsAsync();
        if (status === 'authorized') {
          console.log('Tracking permission granted');
        }
      }
    )
   }, []);
  return (

    <Drawer.Navigator  >
      <Drawer.Screen name='Map' component={MapScreen} />
      <Drawer.Screen name='Home' component={HomeScreen}   />
      <Drawer.Screen name='Ticket' component={TicketScreen} />
      <Drawer.Screen name='Settings' component={SettingsScreen} />
      <Drawer.Screen name='Feedback' component={FeedbackScreen} />

    </Drawer.Navigator>
    
  );
};
