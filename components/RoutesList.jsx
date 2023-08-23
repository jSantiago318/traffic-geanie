import { Box, FlatList, HStack, Icon, Text, VStack } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';

import { StopRender } from './OBAFetches/StopRender';

export const RoutesList = ({route}) => {
  const colorScheme = useColorScheme();
  const [stp, setStp] = useState([]);
  const [stp1, setStp1] = useState([]);
  const memo = useMemo(() => getURL(route), [route]);
  async function getURL(url) {
    const response = await fetch("https://proba.live/api/where/stops-for-route/"+url+".json?key=TEST");
    const data = await response.json();
    const stops = data.data.entry.stopGroupings[0].stopGroups[0].stopIds
    const stops1 = data.data.entry.stopGroupings[0].stopGroups[1].stopIds
    setStp(stops)
    setStp1(stops1)
    return stops, stops1;
  }

  const renderItem = ({ item, index }) => (
    <StopRender stop={item} index={index} />
    )

  if (route.includes('TIM')) {
    route = route.substring( 4, route.length)
  } 

  
  return (
  <Box style={colorScheme == "dark" ? darkMode.Card : lightMode.Card} >
    <Text style={colorScheme == "dark" ? darkMode.Title : lightMode.Title} >{route} - 0</Text>
<FlatList
      style={colorScheme == 'dark' ? darkMode.routeList : lightMode.routeList}
      data={stp}
      renderItem={renderItem} />
      
     <Text style={colorScheme == "dark" ? darkMode.Title : lightMode.Title} >{route} - 1</Text>
 <FlatList
       style={colorScheme == 'dark' ? darkMode.routeList : lightMode.routeList}
       data={stp1}
       renderItem={renderItem} />
     </Box > 
  )
}



const darkMode = StyleSheet.create({
  Card:{
    width: '90%',
    // backgroundColor: '##046C1C',#046C1C
    backgroundColor: '#8CCCF4',
    borderRadius: 10,
    margin: 5, 
    padding: 10,
    maxHeight: '60%',
  },
  Title:{
    fontSize: 18,
    fontWeight: 'bold',
  },
  routeList:{
    maxHeight: '50%',
    width: '100%',
    borderRadius: 10,
    margin: 5,
    backgroundColor: '#8FCFF9',
  }
})

const lightMode = StyleSheet.create({
  Card:{
    width: '90%',
    backgroundColor: '#8CCCF4',
    borderRadius: 10,
    margin: 5, 
    padding: 10,
    maxHeight: '60%',
  } ,
  Title:{
    fontSize: 18,
    fontWeight: 'bold',
  }
})