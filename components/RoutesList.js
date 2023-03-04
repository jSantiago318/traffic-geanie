import { FlatList, HStack, Icon, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';
import { getRouteColor, getRoutes } from '../assets/gtfs/route';

import React, { } from 'react';
import { getStopsByRouteId } from '../assets/gtfs/stops';
import {useNavigation} from "@react-navigation/native";

export const RoutesList = ({route}) => {
  // route = route.substring( 4, route.length)

  const renderItemAccessory = (props) => (
    <Text category='h6' >12:50</Text>
  );

  const renderItem = ({ item, index }) => (
    
    <View style={styles.card}>
    <HStack space={2} alignItems="center">
      <Text style={styles.route}>🟢 🚌</Text>
      <Text style={styles.route}>{item.id} -</Text>
      <Text style={styles.route}>{item.name}</Text>
      {/* <Text style={styles.timePred}>12:50</Text> */}
    </HStack>
    </View>
  );
  if (route.includes('TIM')) {
    route = route.substring( 4, route.length)
  } 
  return (
  <>
    <FlatList
      style={styles.container}
      data={getStopsByRouteId(route)}
      renderItem={renderItem} />
  </>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: '50%',
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#93e1d8',
  }, timePred:{
    fontSize: 20,
    fontWeight: 'bold',
  }, card: {
    margin: 5,
    padding: 5,
    borderRadius: 10,
    justifyContent: 'center',
  }
  
});
