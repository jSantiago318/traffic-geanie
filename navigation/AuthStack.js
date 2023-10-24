import * as React from "react";

import { Auth } from "../screens/Auth";
import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

// const Stack = createStackNavigator();

// import { FeedbackScreen, ForgotPasswordScreen, HomeScreen, IntroScreen, LoginScreen, SignupScreen } from '../screens';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
export const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#68B0AB",
        tabBarHideOnKeyboard: true,
        headerShadowVisible: false,
      }}
    >
      {/* <Drawer.Screen      name='About' component={IntroScreen} /> */}
      <Stack.Screen
        // no bottom tab
        tabBarShowLabel={false}
        name="Login"
        component={Auth}
        
       
      />
      {/* <Drawer.Screen name='Home' component={HomeScreen}   /> */}
      {/* <Drawer.Screen name='Settings' component={SettingsScreen} /> */}
      {/* <Drawer.Screen name='Login' component={LoginScreen} />
      <Drawer.Screen name='Register' component={SignupScreen} />
    <Drawer.Screen name='Feedback' component={FeedbackScreen} /> */}
      {/* <Drawer.Screen name='ForgotPassword' component={ForgotPasswordScreen} /> */}
    </Stack.Navigator>
  );
};
