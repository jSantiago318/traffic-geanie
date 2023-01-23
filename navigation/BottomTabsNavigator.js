import {BottomNavigation, BottomNavigationTab, Divider} from '@ui-kitten/components';
import {HomeIcon, MapIcon, VideoIcon} from '../assets/icons';
import { StyleSheet, View }  from 'react-native';

import { DetailsScreen } from '../screens/DetailsScreen';
import {HomeScreen} from '../screens/HomeScreen';
import { MapScreen } from '../screens/MapScreen';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const {Navigator, Screen} = createBottomTabNavigator();

const BottomTabBar = ({navigation, state}) => (
  <View>
    <Divider/>
    <BottomNavigation
      appearance='noIndicator'
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])} >
      <BottomNavigationTab title='Home' icon={HomeIcon} />
      <BottomNavigationTab title='Map' icon={MapIcon}/>
      {/* <BottomNavigationTab title='Details' icon={VideoIcon}/> */}
    </BottomNavigation>
  </View>
);

export const BottomTabsNavigator = () => (
  <Navigator tabBar={props => <BottomTabBar {...props} />}>
    <Screen name='Home' component={HomeScreen}  />
    <Screen name='Map' component={MapScreen}/>
    {/* <Screen name='Details' component={DetailsScreen}/> */}
  </Navigator>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor : 'green',
  }
})