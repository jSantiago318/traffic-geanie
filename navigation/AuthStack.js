import * as React from 'react';

import Auth from '../screens/Auth';
import HomeScreen from '../screens/HomeScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

// import { FeedbackScreen, ForgotPasswordScreen, HomeScreen, IntroScreen, LoginScreen, SignupScreen } from '../screens';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
export const AuthStack = () => {

  return (
    // <Stack.Navigator
    //   screenOptions={{ headerShown: false }}
    // >
    // <Stack.Screen name='Login' component={LoginScreen} />
    //   <Stack.Screen name='Signup' component={SignupScreen} 
        
    //   <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
    // </Stack.Navigator>
    <Drawer.Navigator  >
    {/* <Drawer.Screen      name='About' component={IntroScreen} /> */}
    <Drawer.Screen name='Login' component={Auth} />
    <Drawer.Screen name='Home' component={HomeScreen}   />
    {/* <Drawer.Screen name='Settings' component={SettingsScreen} /> */}
    {/* <Drawer.Screen name='Login' component={LoginScreen} />
      <Drawer.Screen name='Register' component={SignupScreen} />
    <Drawer.Screen name='Feedback' component={FeedbackScreen} /> */}
      {/* <Drawer.Screen name='ForgotPassword' component={ForgotPasswordScreen} /> */}

  </Drawer.Navigator>
  );
};
