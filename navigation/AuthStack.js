import * as React from 'react';

import { FeedbackScreen, ForgotPasswordScreen, HomeScreen, IntroScreen, LoginScreen, SignupScreen } from '../screens';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

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
    <Drawer.Screen 
      headerShown={false}
      headerMode={'none'}
     name='Intro' component={IntroScreen} />
    <Drawer.Screen name='Routes' component={HomeScreen}   />
    <Drawer.Screen name='Feedback' component={FeedbackScreen} />
    {/* <Drawer.Screen name='Settings' component={SettingsScreen} /> */}

    <Drawer.Screen name='Login' component={LoginScreen} />
      <Drawer.Screen name='Signup' component={SignupScreen} />
      {/* <Drawer.Screen name='ForgotPassword' component={ForgotPasswordScreen} /> */}

  </Drawer.Navigator>
  );
};
