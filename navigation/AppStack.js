import * as React from 'react';

import { HomeScreen } from '../screens/HomeScreen';
import { MapScreen } from '../screens/MapScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TripsScreen } from '../screens/TripsScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();



export const AppStack = () => {

  return (
    <Drawer.Navigator>

      <Drawer.Screen name='Home' component={HomeScreen}   />
      <Drawer.Screen name='Map' component={MapScreen} />
      <Drawer.Screen name='Trips' component={TripsScreen} />
      <Drawer.Screen name='Settings' component={SettingsScreen} />

    </Drawer.Navigator>
  );
};
