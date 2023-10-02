import * as Location from "expo-location";

import {
  Box,
  Button,
  Center,
  Container,
  HStack,
  Heading,
  Select,
  Stack,
  Text,
  VStack,
} from "native-base";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import { colorsDark, colorsLight, darkMode, lightMode } from "../config";
import {
  getOnlineActiveTripsCount,
  getOnlineCount,
} from "../components/URLFetcher";

import { CheckIcon } from "native-base";
import { RoutesList } from "../components/RoutesList";
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

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
    <View 
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
          colorScheme == "dark"
            ? colorsDark.backgroundColor
            : colorsLight.backgroundColor,
        width: "100%",
      }}
    >
      <Container
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
          // paddingBottom: '5%',
          marginTop: '10%',
          backgroundColor:
            colorScheme == "dark"
              ? colorsDark.backgroundColor
              : colorsLight.backgroundColor,
          width: "100%",
        }}
       >
        <Center 
        //  flex start
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          borderRadius: 10,
          width: "100%",
          backgroundColor: colorScheme == "dark" ? colorsDark.primaryColor : colorsLight.primaryColor,
          padding: 10,
          // margin: 2,
        }
        }
         
          >
          <Center
            width={'100%'}
          >

          <Heading
            padding={1}
          >
            Travel Transit Tracker
          </Heading>
          </Center>
        
            <HStack>
              <Stack>
                <Text
                  fontSize={16}
                  padding={1}
                >
                  Online Buses: {busCount}
                </Text>
                <Text
                   fontSize={16}
                  padding={1}
                >
                  Active predictions: {activeTripCount}
                </Text>
              </Stack>
            </HStack>

            <Box
              style={{
                width: "100%",
                
              }
              }
             >
              <Text
                bold
                fontSize={16}
                padding={1}
               >Select Route: </Text>
   
      {
        tracking && Platform.OS == "ios" ? (
          <Button
        onPress={
          allowTracking
        }
        style={
          colorScheme == "dark" ? darkMode.Button : lightMode.Button
        }
      ><Text
      style={colorScheme == "dark" ? lightMode.Text : darkMode.Text}
      >Allow and Start Tracking</Text> </Button>
        ):null
      }
   
              <Select
                // style={colorScheme == 'dark' ? darkMode.Select : lightMode.Select}
                backgroundColor={colorScheme == 'dark' ? colorsDark.secondaryColor : colorsLight.secondaryColor}
                selectedValue={selectedRoute}
                size={'lg'}
                accessibilityLabel="Choose a route"
                placeholder="Choose a route"
                _selectedItem={{
                  // bg: colorScheme == 'dark' ? 'blueGray.400' : 'blueGray.400',
                  endIcon: <CheckIcon size="5" />,
                }}
                color={
                  colorScheme == "dark"
                    ? colorsDark.textColor
                    : colorsLight.textColor
                }
                borderColor={'transparent'}
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

          
        </Center>
      </Container>
      {selectedRoute.length > 0 ? (
        <RoutesList route={selectedRoute} />
      ) : (
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginTop: "1%",
            marginBottom: "1%",
            padding: 2,
            color:
              colorScheme == "dark"
                ? colorsDark.textColor
                : colorsLight.textColor,
          }}
        > Finding Stops ... </Text>
      )}

    </View>
  )
}


