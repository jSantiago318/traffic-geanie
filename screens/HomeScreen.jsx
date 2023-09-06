// import {darkMode, lightMode} from '../config/theme'
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

import {
  Box,
  Button,
  Center,
  HStack,
  Select,
  Stack,
  Text,
  VStack,
} from "native-base";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import {
  getOnlineActiveTripsCount,
  getOnlineCount,
} from "../components/URLFetcher";

import { CheckIcon } from "native-base";
import { RoutesList } from "../components/RoutesList";
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

const TASK_NAME = "BACKGROUND_LOCATION_TASK"

TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
		/* Data object example:
      {
        locations: [
          {
            coords: {
              accuracy: 22.5,
              altitude: 61.80000305175781,
              altitudeAccuracy: 1.3333333730697632,
              heading: 0,
              latitude: 36.7384187,
              longitude: 3.3464008,
              speed: 0,
            },
            timestamp: 1640286402303,
          },
        ],
      };
    */
    const { locations } = data;
    const location = locations[0];

    if (location) {
      // Do something with location...
      console.log(location);
    }
  }
});


export const HomeScreen = () => {
  
  const [selectedRoute, setSelectedRoute] = React.useState("TIM_RR105");
  const [busCount, setBusCount] = React.useState(0);
  const [activeTripCount, setActiveTripCount] = React.useState(0);
  const colorScheme = useColorScheme();
  const [location, setLocation] = useState(null);
  const [session, setSession] = useState(null);
  let foregroundSubscription = null;
  // show modal
  setInterval(() => {
    setBusCount(getOnlineCount());
    setActiveTripCount(getOnlineActiveTripsCount());
  }, 1000);

   // Define position state: {latitude: number, longitude: number}
  const [position, setPosition] = useState(null)
  const [tracking, setTracking] = useState(false)

  // Request permissions right after starting the app
  useEffect(() => {
    const requestPermissions = async () => {
      const foreground = await Location.requestForegroundPermissionsAsync()
    }
    requestPermissions()
  }, [])



  // Start location tracking in foreground
  const startForegroundUpdate = async () => {
    // Check if foreground permission is granted
    const { granted } = await Location.getForegroundPermissionsAsync()
    if (!granted) {
      console.log("location tracking denied")
      return
    }

    // Make sure that foreground location tracking is not running
    foregroundSubscription?.remove()

    // Start watching position in real-time
    foregroundSubscription = await Location.watchPositionAsync(
      {
        // For better logs, we set the accuracy to the most sensitive option
        accuracy: Location.Accuracy.BestForNavigation,
      },
      location => {
        setPosition(location.coords)
      }
    )
  }

  const allowTracking = async () => {
    // Check if third party tracking is allowed
    const { status } = await requestTrackingPermissionsAsync();
    if (status === 'granted') {
      console.log('Yay! I have user permission to track data');
    }
    }


  return (
    <View style={colorScheme == "dark" ? darkMode.View : lightMode.View}>
      <View style={colorScheme == "dark" ? darkMode.CardView : lightMode.CardView}>
        <Center>
          <Text
            fontSize="xl"
            bold
            style={
              colorScheme == "dark" ? darkMode.Text : lightMode.Text
            }
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
                  
                >
                  Online Buses: {busCount}
                </Text>
                <Text
                  style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}
                  
                >
                  Connected Routes: {activeTripCount}
                </Text>
              </Stack>
            </HStack>

            <Box >
             
              <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>Select Route: </Text>
      {
        position && (
          <Button
        onPress={startForegroundUpdate}
        style={
          colorScheme == "dark" ? darkMode.button : lightMode.button
        }
      ><Text
      style={colorScheme == "dark" ? lightMode.Text : darkMode.Text}
      >Start Tracking</Text> </Button>
        )
      }
      {
        tracking && Platform.OS == "ios" ? (
          <Button
        onPress={
          allowTracking
        }
        style={
          colorScheme == "dark" ? darkMode.button : lightMode.button
        }
      ><Text
      style={colorScheme == "dark" ? lightMode.Text : darkMode.Text}
      >Allow and Start Tracking</Text> </Button>
        ):null
      }
   
              <Select
                style={colorScheme == 'dark' ? darkMode.Select : lightMode.Select}
                selectedValue={selectedRoute}
                size={'lg'}
                accessibilityLabel="Choose a route"
                placeholder="Choose a route"
                _selectedItem={{
                  // bg: colorScheme == 'dark' ? 'blueGray.400' : 'blueGray.400',
                  endIcon: <CheckIcon size="5"   />,
                }}
                mt={1}
                onValueChange={(itemValue) => {
                  setSelectedRoute(itemValue);
                }}
              >
                <Select.Item label="Route 105" value="TIM_RR105" />
                <Select.Item label="Route 102" value="TIM_RR102" />
                <Select.Item label="Route 108" value="TIM_RR108" />
                <Select.Item label="Route 106" value="TIM_RR106" />
                <Select.Item label="Route 348" value="TIM_RR348" />
                <Select.Item label="Route 349" value="TIM_RR349" />
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


const darkMode = StyleSheet.create({
  View:{
    flex: 1,
      // justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#293241',
      width:'100%',
  },
  Select:{
    backgroundColor: '#fff',
  },
  CardView:{
    width:'90%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  Card:{
    width:'100%',
    backgroundColor: '#8CCCF4',
  },
  Text:{
    color: '#fff',
  },
  button:{
    backgroundColor: '#8CCCF4',
    color: '#fff',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    height: 50,
    borderRadius: 10,
  }
})

const lightMode = StyleSheet.create({
  View:{
    flex: 1,
      // justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      width:'100%',
  },
  Text:{
    color: 'black',
  },
  Select:{
    backgroundColor: '#fff',
  },
  CardView:{
    width:'90%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  Card:{
    width:'100%',
    backgroundColor: '#8CCCF4',
  },
  
})


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginTop: 15,
  },
  separator: {
    marginVertical: 8,
  },
})