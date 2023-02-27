import {LoginScreen, RegisterScreen} from "../screens/auth";

import { CreditsScreen } from "../screens/CreditsScreen";
import {DetailsScreen} from "../screens/DetailsScreen";
import { HomeScreen } from '../screens/HomeScreen';
import { MapScreen } from '../screens/MapScreen';
import {NavigationContainer} from '@react-navigation/native';
// import { TripScreen } from '../screens/TripScreen';
import {TicketScreen} from "../screens/TicketScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import useStore from "../store/useStore";

const Drawer = createDrawerNavigator();
export const AppNavigator = () => {
  const isSignedIn = useStore(state => state.isSignedIn)

  return (
    <NavigationContainer >
      <Drawer.Navigator  options = {{headerShown: false}}
      
        >
        {isSignedIn ? (
          <>
            
            <Drawer.Screen name='Details' component={DetailsScreen}/>
            <Drawer.Screen options={{headerBackTitleVisible: true}} name='Home' component={HomeScreen}/>
            <Drawer.Screen options={{headerBackTitleVisible: true}}  name='Map' component={MapScreen}/>
            <Drawer.Screen name='Ticket'  options={{headerBackTitleVisible: true}} component={TicketScreen}/>
          </>
        ) : (
          <>
            <Drawer.Screen options={{headerShown: false}} name={'Login'} component={LoginScreen}/>
            <Drawer.Screen   name={'Credits'} component={CreditsScreen}/>
            <Drawer.Screen  name={'SignUp'} component={RegisterScreen} />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  )
};

