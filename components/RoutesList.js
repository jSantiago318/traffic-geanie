import { Box, FlatList, HStack, Icon, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';

import { StopRender } from './OBAFetches/StopRender';

export const RoutesList = ({route}) => {
  const [stp, setStp] = useState([]);
  const colorScheme = useColorScheme();
   useEffect(() => {
    const interval = setInterval(() => {
         const dataFetch = async () => {
    const url = "https://proba.live/api/where/stops-for-route/TIM_"+route+".json?key=TEST"
    await  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data.data.entry.stopGroupings[0].stopGroups[0].stopIds)
      const stops = data.data.entry.stopGroupings[0].stopGroups[0].stopIds
      setStp(stops)
        // setStp(data.data.entry.stopGroupings[0].stopGroups[0].stopIds)
    })} 
    dataFetch();
  }, 1000);

  return () => clearInterval(interval);
   }, [stp]);

  const renderItem = ({ item, index }) => (
    <StopRender stop={item} />
    )

  if (route.includes('TIM')) {
    route = route.substring( 4, route.length)
  } 

  
  return (
  <Box style={colorScheme == "dark" ? darkMode.Card : lightMode.Card} >
<FlatList
      style={colorScheme == 'dark' ? darkMode.routeList : lightMode.routeList}
      data={stp}
      renderItem={renderItem} />
</Box >

  
  );
}
const darkMode = StyleSheet.create({
  Card:{
    width: '90%',
    backgroundColor: '#5F86C5',
    borderRadius: 10,
    margin: 10, 
    padding: 10,
    maxHeight: '60%',
  },
  
})

const lightMode = StyleSheet.create({
  Card:{
    width: '90%',
    backgroundColor: '#8CCCF4',
    borderRadius: 10,
    margin: 10, 
    padding: 10,
    maxHeight: '60%',
  } 
})