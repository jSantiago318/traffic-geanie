import * as Location from "expo-location";
import * as TaskManager from 'expo-task-manager';

import {
  Box,
  Button,
  Center,
  FlatList,
  FormControl,
  HStack,
  Input,
  Modal,
  Select,
  Stack,
  Text,
  VStack,
} from "native-base";
import {DeviceMotion, Pedometer} from "expo-sensors";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { darkMode, lightMode } from "../config/theme";
// import {darkMode, lightMode} from '../config/theme'
import {
  getOnlineActiveTripsCount,
  getOnlineCount,
} from "../components/URLFetcher";

import { CheckIcon } from "native-base";
import { RoutesList } from "../components/RoutesList.js";
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

const LOCATION_TASK_NAME = 'background-location-task';

const requestPermissions = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === 'granted') {
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
      });
      console.log("Location updates started!");
    }
  }
};

requestPermissions();
export const HomeScreen = () => {
  const [selectedRoute, setSelectedRoute] = React.useState("TIM_RR105");
  const [busCount, setBusCount] = React.useState(0);
  const [activeTripCount, setActiveTripCount] = React.useState(0);
  const colorScheme = useColorScheme();
  // show modal
  setInterval(() => {
    setBusCount(getOnlineCount());
    setActiveTripCount(getOnlineActiveTripsCount());
  }, 1000);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  useEffect(() => {
    (async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status !== 'granted') {
        console.log('Ni! I have ni user permission to track data');
      }
    })();
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, [location]);

  return (
    <View style={colorScheme == "dark" ? darkMode.View : lightMode.View}>
    
      <View style={colorScheme == "dark" ? darkMode.CardView : lightMode.CardView}>
        <Center>
          <Text
            fontSize="xl"
            bold
            style={colorScheme == "dark" ? darkMode.Title : lightMode.Title}
          >
            Travel Transit Tracker
          </Text>
          <View
            style={
              colorScheme == "dark" ? darkMode.CardView : lightMode.CardView
            }
          >
            <HStack>
              <Stack>
                <Text
                  style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}
                  bold
                >
                  Online Buses: {busCount}
                </Text>
                <Text
                  style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}
                  bold
                >
                  Connected Routes: {activeTripCount}
                </Text>
              </Stack>
            </HStack>
            <Box >
              <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>Select Route: </Text>
              <Select
                // style={colorScheme == 'dark' ? darkMode.Select : lightMode.Select}
                selectedValue={selectedRoute}
                size={'lg'}
                accessibilityLabel="Choose a route"
                placeholder="Choose a route"
                _selectedItem={{
                  // bg: colorScheme == 'dark' ? 'blueGray.400' : 'blueGray.400',
                  endIcon: <CheckIcon size="5"  />,
                }}
                mt={1}
                onValueChange={(itemValue) => {
                  setSelectedRoute(itemValue);
                }}
              >
                <Select.Item   label="Route 105" value="TIM_RR105" />
                <Select.Item  label="Route 102" value="TIM_RR102" />
                <Select.Item  label="Route 108" value="TIM_RR108" />
                <Select.Item  label="Route 106" value="TIM_RR106" />
                <Select.Item  label="Route 348" value="TIM_RR348" />
                <Select.Item  label="Route 349" value="TIM_RR349" />
              </Select>
            </Box>

          </View>
        </Center>
      </View>
      {selectedRoute.length > 0 ? (
        <RoutesList route={selectedRoute} />
      ) : (
        <Text> Finding Stops ... </Text>
      )}

    </View>
  );
};


// const darkMode = StyleSheet.create({
//   View:{
//     flex: 1,
//       // justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: '#293241',
//       width:'100%',
//   },
//   CardView:{
//     width:'90%',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//     marginTop: 20,
//   },
//   Card:{
//     width:'100%',
//     backgroundColor: '#8CCCF4',
//   }
  
// })

// const lightMode = StyleSheet.create({
//   View:{
//     flex: 1,
//       // justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: '#fff',
//       width:'100%',
//   },
//   CardView:{
//     width:'90%',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//     marginTop: 20,
//   },
//   Card:{
//     width:'100%',
//     backgroundColor: '#8CCCF4',
//   }
// })