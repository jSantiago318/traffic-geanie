import {Button, Card, Divider, Layout, Text, TopNavigation, TopNavigationAction} from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { getOnlineActiveTripsCount, getOnlineCount } from '../components/URLFetcher';
import {useNavigation, useTheme} from "@react-navigation/native";

import AppLoading from 'expo-app-loading';
import CameraBtn from "../components/CameraBtn";
import DataFetcher from "../components/DataFetcher";
// import { Image } from 'expo-image';
import React from 'react';
import useStore from "../store/useStore";

export const CreditsScreen = () => {
    
  return (
  <View style={styles.container} >
    <Text category='h1' style={styles.title}>Mayaguez Bus Tracker</Text>
    {/* <Image
        style={styles.image}
        source="https://picsum.photos/seed/696/3000/2000"
        placeholder={blurhash}
        contentFit="cover"
        transition={1000}
      />  */}
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
