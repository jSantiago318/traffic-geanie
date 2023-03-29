import { FlatList, HStack, Icon, Text } from 'native-base';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { getRouteColor, getRoutes } from '../assets/gtfs/route';

import { WithLocalSvg } from 'react-native-svg';
import {getSchedule} from './URLFetcher';
import { getStopsByRouteId } from '../assets/gtfs/stops';
import {useNavigation} from "@react-navigation/native";

export const RoutesList = ({route}) => {
  // route = route.substring( 4, route.length)

// setInterval(() => {

//   const length = getStopsByRouteId(route).length
//   for(let i = 1; i < length; i++) {
//     if (i<10) {
//       fetch('https://pr-oba.live/api/where/arrivals-and-departures-for-stop/TIM_'+route+'S0'+i+'.json?key=TEST').then((response) => response.json()).then((data) => {
//       const exists =  data.data.entry.arrivalsAndDepartures
//       if (exists != undefined && exists.length > 0){
//         updateData(data.data.entry.arrivalsAndDepartures[0])
//       } else{
//         updateData({on: 'Off hours'})
//       }
//       })

//     }else{
//       fetch('https://pr-oba.live/api/where/arrivals-and-departures-for-stop/TIM_'+route+'S'+i+'.json?key=TEST').then((response) => response.json()).then((data) => {
//         const exists =  data.data.entry.arrivalsAndDepartures
//         if (exists != undefined && exists.length > 0){
//           updateData(data.data.entry.arrivalsAndDepartures[0])
//         }  else{
//           updateData({on: 'Off hours'})
//         }
//           })
//     }
//   }
// }, 6000);



  const renderItemAccessory = (props) => (
    <Text category='h6' >12:50</Text>
  );
  
   
  const renderItem = ({ item, index }) => (
    
    
    <View style={styles.card}>
    <HStack space={2} alignItems="center">
      <Text style={styles.route}>🟢</Text>
      <Text style={styles.route}>Stop #{index+1}</Text>
      <Text style={styles.route}>{item.name}</Text>
      <Text style={styles.route}>{getSchedule(route, index)}</Text>
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
