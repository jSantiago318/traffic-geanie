import * as React from 'react';

import {Auth} from '../screens/Auth';
import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// const Stack = createStackNavigator();

// import { FeedbackScreen, ForgotPasswordScreen, HomeScreen, IntroScreen, LoginScreen, SignupScreen } from '../screens';



const Tab = createBottomTabNavigator();

export const AuthStack = () => {
  return (
    <Tab.Navigator
screenOptions={{ headerShown: false , 
  tabBarShowLabel: false,
  tabBarActiveTintColor: '#68B0AB',
  tabBarHideOnKeyboard: true,
 
}}
  >
    {/* <Drawer.Screen      name='About' component={IntroScreen} /> */}
    <Tab.Screen
    // no bottom tab
 

     name='Login' component={Auth} />
    {/* <Drawer.Screen name='Home' component={HomeScreen}   /> */}
    {/* <Drawer.Screen name='Settings' component={SettingsScreen} /> */}
    {/* <Drawer.Screen name='Login' component={LoginScreen} />
      <Drawer.Screen name='Register' component={SignupScreen} />
    <Drawer.Screen name='Feedback' component={FeedbackScreen} /> */}
      {/* <Drawer.Screen name='ForgotPassword' component={ForgotPasswordScreen} /> */}

  </Tab.Navigator>
  );
};
