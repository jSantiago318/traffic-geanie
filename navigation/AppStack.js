import * as React from 'react';

import { FeedbackScreen, HomeScreen, MapScreen, SettingsScreen, TicketScreen } from '../screens';

import { Entypo } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>

      <Drawer.Screen name='Map' component={MapScreen} />
      <Drawer.Screen name='Home' component={HomeScreen}   />
      <Drawer.Screen name='Ticket' component={TicketScreen} />
      <Drawer.Screen name='Settings' component={SettingsScreen} />
      <Drawer.Screen name='Feedback' component={FeedbackScreen} />

    </Drawer.Navigator>
  );
}

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
    // <NavigationContainer independent={true}>
    //   <MyDrawer />
    // </NavigationContainer>  

    <Drawer.Navigator>

      <Drawer.Screen name='Map' component={MapScreen} />
      <Drawer.Screen name='Home' component={HomeScreen}   />
      <Drawer.Screen name='Ticket' component={TicketScreen} />
      <Drawer.Screen name='Settings' component={SettingsScreen} />
      <Drawer.Screen name='Feedback' component={FeedbackScreen} />

    </Drawer.Navigator>
  );
};
