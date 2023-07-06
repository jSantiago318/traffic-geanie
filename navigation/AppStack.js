import * as React from 'react';

import { FeedbackScreen, HomeScreen, MapScreen, SettingsScreen, TicketScreen } from '../screens';

import { Entypo } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();



export const AppStack = () => {

  return (
    <Drawer.Navigator>

      <Drawer.Screen name='Map' component={MapScreen} />
      <Drawer.Screen name='Home' component={HomeScreen}   />
      <Drawer.Screen name='Ticket' component={TicketScreen} />
      <Drawer.Screen name='Settings' component={SettingsScreen} />
      <Drawer.Screen name='Feedback' component={FeedbackScreen} />

    </Drawer.Navigator>
  );
};
