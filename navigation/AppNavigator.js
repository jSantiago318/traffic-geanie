import {LoginScreen, RegisterScreen} from "../screens/auth";

import {BottomTabsNavigator} from "./BottomTabsNavigator";
import { CreditsScreen } from "../screens/CreditsScreen";
import {DetailsScreen} from "../screens/DetailsScreen";
import { HomeScreen } from '../screens/HomeScreen';
import { MapScreen } from '../screens/MapScreen';
import {NavigationContainer} from '@react-navigation/native';
import { TripScreen } from '../screens/TripScreen';
import {createStackNavigator} from '@react-navigation/stack';
import useStore from "../store/useStore";

const {Navigator, Screen} = createStackNavigator();
export const AppNavigator = () => {
  const isSignedIn = useStore(state => state.isSignedIn)

  return (
    <NavigationContainer >
      <Navigator  options = {{headerShown: false}}
      
        >
        {isSignedIn ? (
          <>
            <Screen options={{headerShown: false}} name={'TabsNavigation'} component={BottomTabsNavigator}/>
            <Screen name='Details' component={DetailsScreen}/>
            <Screen options={{headerBackTitleVisible: false}} name='Home' component={HomeScreen}/>
            <Screen options={{headerBackTitleVisible: false}}  name='Map' component={MapScreen}/>
            <Screen options={{headerShown: false}}  name='Trip' component={TripScreen}/>
          </>
        ) : (
          <>
            <Screen options={{headerShown: false}} name={'Login'} component={LoginScreen}/>
            <Screen   name={'Credits'} component={CreditsScreen}/>
            <Screen  name={'SignUp'} component={RegisterScreen} />
          </>
        )}
      </Navigator>
    </NavigationContainer>
  )
};

