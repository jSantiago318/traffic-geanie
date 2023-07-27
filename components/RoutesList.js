import { Box, FlatList, HStack, Icon, Text, VStack } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';

import {Colors} from '../config/theme'
import { StopRender } from './OBAFetches/StopRender';

export const RoutesList = ({route}) => {
  const colorScheme = useColorScheme();
  const [stp, setStp] = useState([]);
  const memo = useMemo(() => getURL(route), [route]);
  async function getURL(url) {
    const response = await fetch("https://proba.live/api/where/stops-for-route/"+url+".json?key=TEST");
    const data = await response.json();
    const stops = data.data.entry.stopGroupings[0].stopGroups[0].stopIds
    setStp(stops)
    return stops;
  }


  const renderItem = ({ item, index }) => (
    <StopRender stop={item} />
    )

  if (route.includes('TIM')) {
    route = route.substring( 4, route.length)
  } 

  
  return (
  <Box style={colorScheme == "dark" ? darkMode.Card : lightMode.Card} >
<FlatList
      data={stp}
      renderItem={renderItem} />
</Box >
  )
}



const darkMode = StyleSheet.create({
  Card:{
    width: '90%',
    // backgroundColor: '##046C1C',#046C1C
    backgroundColor: Colors.primaryDark,
    borderRadius: 10,
    margin: 10, 
    padding: 10,
    maxHeight: '60%',
  },
  
})

const lightMode = StyleSheet.create({
  Card:{
    width: '90%',
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    margin: 10, 
    padding: 10,
    maxHeight: '60%',
  } 
})