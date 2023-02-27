import { StyleSheet, View } from 'react-native';
import { getOnlineActiveTripsCount, getOnlineCount } from '../components/URLFetcher';
import {useNavigation, useTheme} from "@react-navigation/native";

import CameraBtn from "../components/CameraBtn";
import DataFetcher from "../components/DataFetcher";
import React from 'react';
import {RoutesList} from "../components/RoutesList.js";
import { Text } from 'native-base';
import useStore from "../store/useStore";

export const HomeScreen = () => {
  const navigation = useNavigation();
  
 
  return (
    <View style={styles.container}>
      {/* <DataFetcher/> */}
      <Text category='h1'>Mayaguez Bus Tracker</Text>
      <View style={styles.card} status='primary'>
        <Text style={styles.subtitle} >Online Buses: {getOnlineCount()}</Text>
        <Text style={styles.subtitle} >Active Routes: {getOnlineActiveTripsCount()}
        </Text>
      </View>
      <RoutesList/>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginTop: 5,
    width: '40%',
    backgroundColor: '#93e1d8',
    tintColor: '#93e1d8',
    borderRadius: 5,
    borderColor: 'transparent',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddfff7',
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
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#93e1d8',

  }
  
  
});
