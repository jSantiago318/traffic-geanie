import { Button, Select, SelectItem, Text } from 'native-base';
import React, {useEffect, useState} from 'react';
import { StyleSheet, View } from 'react-native';
import { getOnlineActiveTripsCount, getOnlineCount } from '../components/URLFetcher';
import {useNavigation, useTheme} from "@react-navigation/native";

import CameraBtn from "../components/CameraBtn";
import DataFetcher from "../components/DataFetcher";
import { Pedometer } from 'expo-sensors';
import { getRoutesCat } from '../assets/gtfs/route';
import {getTicketStop} from '../screens/MapScreen';

export const TicketScreen = () => {
  const data = ['Ruta Rural', 'Ruta Urbana', 'Rutal Colegio']
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }

      return Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
      });
    }
  };

  useEffect(() => {
    const subscription = subscribe();
    return () => subscription && subscription.remove();
  }, []);
  
  return (
  <View style={styles.container} >
  
    <Text fontSize='xl' >Mayaguez Bus Tracker</Text>
    <Text fontSize='xl' >Ticket</Text>
    <Text fontSize='xl' >Stop: {getTicketStop()}</Text>
    
    <Text>Pedometer Active: {isPedometerAvailable}</Text>
      <Text>Steps in last 24 hours: {pastStepCount}</Text>
      <Text>Current stesps taken: {currentStepCount}</Text>
      <Button>
        <Text>Start Trip</Text>
      </Button>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});
