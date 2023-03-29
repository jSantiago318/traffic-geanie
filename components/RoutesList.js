import { FlatList, HStack, Icon, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, } from 'react-native';

import { StopRender } from './OBAFetches/StopRender';
import {getStopsByRouteId} from "../components/URLFetcher";
import {useNavigation} from "@react-navigation/native";

export const RoutesList = ({route}) => {



  const [stp, setStp] = useState([]);
  const [currentTime, setCurrentTime] = useState([]);
  useEffect(() => {
  const dataFetch = async () => {
    await  fetch("https://pr-oba.live/api/where/stops-for-route/TIM_"+route+".json?key=TEST")
    .then((response) => response.json())
    .then((data) => {

        setStp(data.data.entry.stopGroupings[0].stopGroups[0].stospIds)
        setCurrentTime(data.currentTime)
    })
      } 
      if(stp && stp.length === 0 ) {
        dataFetch();
      }
    }, [currentTime, stp]);


  const renderItem = ({ item, index }) => (
    <StopRender stop={item} currentTime={currentTime} />
    )

  if (route.includes('TIM')) {
    route = route.substring( 4, route.length)
  } 

  
  return (
  <>
    <FlatList
      style={styles.container}
      data={setStp}
      renderItem={renderItem} />
  </>
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
