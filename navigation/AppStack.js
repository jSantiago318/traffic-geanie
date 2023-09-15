import * as React from 'react';

import { HomeScreen } from '../screens/HomeScreen';
import { MapScreen } from '../screens/MapScreen';
import {MaterialIcons} from '@expo/vector-icons';
import { SettingsScreen } from '../screens/SettingsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export const AppStack = () => {

  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home'
        } else if (route.name === 'Profile') {
          // iconName = focused ? 'settings' : 'settings';
          iconName = 'account-circle'
        }else if (route.name === 'Map') {
          // iconName = focused ? 'settings' : 'settings';
          iconName = 'directions-bus'
        }

        // You can return any component that you like here!
        return <MaterialIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
  >

      <Tab.Screen
       name='Map' component={MapScreen} />
      <Tab.Screen name='Home' component={HomeScreen}   />
      <Tab.Screen name='Profile' component={SettingsScreen} />

    </Tab.Navigator>
  );
};
