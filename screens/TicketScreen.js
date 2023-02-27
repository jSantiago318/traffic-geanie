import { Select, SelectItem, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';
import { getOnlineActiveTripsCount, getOnlineCount } from '../components/URLFetcher';
import {useNavigation, useTheme} from "@react-navigation/native";

import CameraBtn from "../components/CameraBtn";
import DataFetcher from "../components/DataFetcher";
import React from 'react';
import { getRoutesCat } from '../assets/gtfs/route';

export const TicketScreen = () => {
  const data = ['Ruta Rural', 'Ruta Urbana', 'Rutal Colegio']
  const [routes, setRoutes] = React.useState(null);
  const [stops, setStops] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [selectedStopIndex, setSelectedStopIndex] = React.useState(null);
  const displayValue = data[selectedIndex];
  const displayValueStop = data[selectedIndex];
  return (
  <View style={styles.container} >
  
    <Text category='h1' style={styles.title}>Mayaguez Bus Tracker</Text>
    <Text>Categoria</Text>
    <Select style={styles.select}
      selectedIndex={selectedIndex}
      value={displayValue}
      onSelect={index => setSelectedIndex(index)}>
      <SelectItem title='Ruta Rural'/>
      <SelectItem title='Ruta Urbana'/>
      <SelectItem title='Ruta Colegio'/>
    </Select>
    <Text>Ruta</Text>
    <Select style={styles.select}
      selectedIndex={selectedStopIndex}
      value={displayValueStop}
      onSelect={index => setSelectedStopIndex(index)}>
      {
        getRoutesCat(displayValue).map((route, index) => {
          return (
            <SelectItem key={index} title={route.id}/>
          )
        }
        )
      }
      </Select>
      <Text> Parada</Text>
      <Select style={styles.select}
      selectedIndex={selectedStopIndex}
      value={displayValueStop}
      onSelect={index => setSelectedStopIndex(index)}>
      {
        getRoutesCat(displayValue).map((route, index) => {
          return (
            <SelectItem key={index} title={route.id}/>
          )
        }
        )
      }
      </Select>
      
  </View>
  )
}

const styles = StyleSheet.create({
  select: {
    width: '80%',
    height: '10%',
    marginTop: 5,
    marginBottom: 5,
  },
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
