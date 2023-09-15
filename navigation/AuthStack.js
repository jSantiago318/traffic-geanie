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
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Login') {
          iconName = 'account-circle'
        }

        // You can return any component that you like here!
        return <MaterialIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    {/* <Drawer.Screen      name='About' component={IntroScreen} /> */}
    <Tab.Screen
    screenOptions={{ headerShown: false }}
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
