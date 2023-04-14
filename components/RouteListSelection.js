import { FlatList, HStack, Icon, ScrollView, Text } from 'native-base';
import React, { useEffect, useState, } from 'react';
import { StyleSheet, View, } from 'react-native';

import { StopRender } from './OBAFetches/StopRender';
import {getStopsByRouteId} from "./URLFetcher";
import {useNavigation} from "@react-navigation/native";

export const RouteListSelection = ({route}) => {
  const [stp, setStp] = useState([]);
  const [currentTime, setCurrentTime] = useState([]);


   useEffect(() => {
   const dataFetch = async () => {
    const url = "https://pr-oba.live/api/where/stops-for-route/TIM_"+route+".json?key=TEST"
    await  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data.data.entry.stopGroupings[0].stopGroups[0].stopIds)
      const stops = data.data.entry.stopGroupings[0].stopGroups[0].stopIds
      setStp(stops)
        // setStp(data.data.entry.stopGroupings[0].stopGroups[0].stopIds)
    })} 
    dataFetch();
   }, [stp]);

  const renderItem = ({ item, index }) => (
    <StopRender stop={item} />
    )

  if (route.includes('TIM')) {
    route = route.substring( 4, route.length)
  } 

  
  return (
  <ScrollView>
  
    <FlatList
      style={styles.container}
      data={stp}
      renderItem={renderItem} />
  </ScrollView>
  
  );
}

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
