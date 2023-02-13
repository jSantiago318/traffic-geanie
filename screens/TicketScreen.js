import {Button, Card, Divider, Layout, Text, TopNavigation, TopNavigationAction} from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { getOnlineActiveTripsCount, getOnlineCount } from '../components/URLFetcher';
import {useNavigation, useTheme} from "@react-navigation/native";

import AppLoading from 'expo-app-loading';
import CameraBtn from "../components/CameraBtn";
import DataFetcher from "../components/DataFetcher";
import React from 'react';
import { faker } from '@faker-js/faker'
import useStore from "../store/useStore";

const data = new Array(10).fill({
    tripId: faker.random.numeric(5),
    title: 'Route 1',
    color: faker.internet.color(),
    departureTime: faker.date.future(),
    arrivalTime: faker.date.future(),
    stepsToBus: 44,
    distanceTraveled: 47,
  })

 
export const TicketScreen = () => {
    
  return (
  <View style={styles.container} >
  
    <Text category='h1' style={styles.title}>Mayaguez Bus Tracker</Text>
        <Text category='h1' style={styles.subtitle}>Trip ID: </Text>
        <Text category='h1' style={styles.subtitle}>Route: </Text>
        <Text style={styles.subtitle}>Departure Time: </Text>
        <Text style={styles.subtitle}>Arrival Time: </Text>
        <Text style={styles.subtitle}>Steps to Bus: </Text>
        <Text style={styles.subtitle}>Distance Traveled: </Text>        
  </View>
  )
}

const styles = StyleSheet.create({
    ticketScanBtn: {
        marginTop: 5,
        width: '40%',
        height: '10%',
        borderRadius: 5,
        borderColor: 'transparent',
        },

  button: {
    marginTop: 5,
    width: '40%',
    height: '10%',
    backgroundColor: '#93e1d8',
    borderRadius: 5,
    borderColor: 'transparent',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  layout: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    margin: 2,
    backgroundColor: '#93e1d8',

  },
  title:{
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30,
    
  }
  
  
});
