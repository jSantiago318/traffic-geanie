import { Box, Button, Center, FlatList, FormControl, HStack, Input, Modal, SafeAreaView, Select, Stack, Text } from 'native-base';
import { Colors, darkMode, lightMode } from '../config';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { addDoc, collection, doc, getDoc, setDoc, where } from 'firebase/firestore';
import { getOnlineActiveTripsCount, getOnlineCount } from '../components/URLFetcher';

import { CheckIcon } from 'native-base';
import { DarkTheme } from '@react-navigation/native';
import {RoutesList} from "../components/RoutesList.js";
import {database} from '../config/firebase';
import { getAuth } from 'firebase/auth';

// import BouncingPreloader from 'react-native-bouncing-preloader';






export const HomeScreen = () => {
  const [selectedRoute, setSelectedRoute] = React.useState('TIM_RR102');
  const [busCount, setBusCount] = React.useState(0);
  const [activeTripCount, setActiveTripCount] = React.useState(0);
  const colorScheme = useColorScheme();
// show modal 
const [alarmModalVisible, setAlarmModalVisible] = useState(false);
  
  setInterval(() => {
    setBusCount(getOnlineCount());
    setActiveTripCount(getOnlineActiveTripsCount());
    
  }, 2000);

  

  return (
    <View style={ colorScheme == 'dark' ? darkMode.View : lightMode.View }>
      {/* <DataFetcher/> */}
      <Center style={{
        width: '100%',
        borderRadius: 10,
        }} >

    </Center>
      <View style={stylesLayout.app}>
      <Center>

      <Text fontSize="xl" bold style={ colorScheme == 'dark' ? darkMode.Title : lightMode.Title }  >Mayaguez Bus Tracker</Text>
      </Center>

        <View style={ colorScheme == 'dark' ? darkMode.CardView : lightMode.CardView } >
        <HStack>
        <Stack>

        <Text style={ colorScheme == 'dark' ? darkMode.Text : lightMode.Text } bold >Online Buses: {busCount}</Text>
        <Text style={ colorScheme == 'dark' ? darkMode.Text : lightMode.Text } bold >Connected Routes: {activeTripCount}
        </Text>
        </Stack>


</HStack>
 <Box  style={colorScheme == 'dark' ? darkMode.Card : lightMode.Card}>
      <Text> 
      Select Route: </Text>
        <Select  style={{
        width: '100%',
        borderRadius: 10,
        borderColor: 'transparent',
        }} selectedValue={selectedRoute}  accessibilityLabel="Choose a route" placeholder="Choose a route" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={itemValue => {
        setSelectedRoute(itemValue) 
        
        }}>
      <Select.Item label="Route 105" value="TIM_RR105" />
      <Select.Item label="Route 102" value="TIM_RR102" />
      <Select.Item label="Route 108" value="TIM_RR108" />
      <Select.Item label="Route 106" value="TIM_RR106" />
      <Select.Item label="Route 348" value="TIM_RR348" />
      <Select.Item label="Route 349" value="TIM_RR349" />
      
        </Select>
      </Box>
      </View>
        
    </View>
   
      {
        selectedRoute.length > 0 ? (
          <RoutesList route={selectedRoute}  />
        ) : (
       
        <Text> Lading ... </Text>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  routeLists: {
    width: '90%',
    borderRadius: 10,
    padding: 10,
    backgroundColor: Colors.backgroundColor,
  }, 
  
  button: {
    marginTop: 5,
    width: '40%',
    backgroundColor: Colors.secondary,
    borderRadius: 5,
    borderColor: 'transparent',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    padding: 10
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
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
  }, selectRoute :{
    width: '100%',
    borderRadius: 10,
    padding: 10,
    backgroundColor: Colors.secondary,
  },
  alertBtn: {
    backgroundColor:'transparent',
    marginLeft: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,

  }
  
  
  
});

// Styles
const stylesLayout = {
  app: {
    paddingTop: 20,
    marginHorizontal: "auto",
    width: "100%",
    borderColor: 'transparent',
  },
  row: {
    flexDirection: "row",
    borderColor: 'transparent',
  },
  "1col":  {
    borderWidth:  1,
    flex:  1,
    borderColor: 'transparent',
  },
  "2col":  {
    borderWidth:  1,
    flex:  2,
    borderColor: 'transparent',
  },
}