// import {darkMode, lightMode} from '../config/theme'
import * as Location from 'expo-location';

import {
  Box,
  Button,
  Center,
  Checkbox,
  HStack,
  ScrollView,
  Text,
  VStack,
  View,
} from "native-base";
import { Camera, CameraType } from 'expo-camera';
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";

import { Pedometer } from 'expo-sensors';
import {requestTrackingPermissionsAsync} from 'expo-tracking-transparency';

export const IntroScreen =  () => {
  const LOCATION_TASK_NAME = 'background-location-task';
 
  const colorScheme = useColorScheme();
  const [location, setLocation] = useState(null);



  // TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  //   if (error) {
  //     // Error occurred - check `error.message` for more details.
  //     return;
  //   }
  //   if (data) {
  //     const { locations } = data;
  //     // do something with the locations captured in the background
  //   }
  // });
  
  
  const [permission, requestPermission] = Camera.useCameraPermissions();
  return (
    <View  style={colorScheme == "dark" ? darkMode.View : lightMode.View}>
    <ScrollView>
    <Center>
      <Box
        style={colorScheme == "dark" ? darkMode.CardView : lightMode.CardView}
      >
       
        <Text fontSize="xl" fontWeight="bold" marginBottom={'4'}  style={colorScheme == "dark" ? darkMode.Text : lightMode.Text} >
          Welcome to Travel Transit Tracker
        </Text>

        <Text fontSize="md" marginBottom={'2'}   style={colorScheme == "dark" ? darkMode.Text : lightMode.Text} >

          App Permissions
        </Text>
        <Button marginBottom={'2'}  style={colorScheme == "dark" ? darkMode.Button : lightMode.Button}  onPress={
             async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(location);
      console.log(
        "Location: " + location.coords.latitude + " " + location.coords.longitude
      )
          }
          } >
          Allow Location
        </Button>
    
        <Button marginBottom={'2'}  style={colorScheme == "dark" ? darkMode.Button : lightMode.Button}
         onPress={
             async () => {
      let { status } = await Pedometer.requestPermissionsAsync();
      if (status == 'granted') {
        console.log('Permission for activity tracking was accepted');
        return;
      }
          }
          }
         >
          Allow Pedometer
        </Button>
       
        <Button marginBottom={'2'}  style={colorScheme == "dark" ? darkMode.Button : lightMode.Button}
         onPress={
              async () => {
      let { status } = await Camera.requestCameraPermissionsAsync();
      if (status == 'granted') {
        console.log('Permission to camera location was accepted');
        return;
      }
              }
         }
         >
          Enable Camera
        </Button>
        <Button marginBottom={'2'}  style={colorScheme == "dark" ? darkMode.Button : lightMode.Button}
          onPress={
            async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === 'granted') {
        console.log('Yay! I have user permission to track data');
      }
    }
          }
          >
          Enable Tracking
        </Button>

        <Text fontSize="md" marginBottom={'2'}   style={colorScheme == "dark" ? darkMode.Text : lightMode.Text} >
          For the app to work properly, you must allow the app the following permissions:
        </Text>
        <Text fontSize="md" marginBottom={'2'}   style={colorScheme == "dark" ? darkMode.Text : lightMode.Text} >
          This app is designed to help and research the public transportation system in Mayaguez, PR. 
        </Text>
        <Text fontSize="md" marginBottom={'2'}   style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
          This app is designed for users near the Mayaguez area. But, any user from any region can use this app. This app is not limited by any company or organization. It is being developed by a group of researchers from the University of Puerto Rico at Mayaguez.
        </Text>
        <Text fontSize="md" fontWeight="bold" marginBottom={'2'}   style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
        App usage 
        </Text>
        <Text fontSize="md" marginBottom={'1'}   style={colorScheme == "dark" ? darkMode.Text : lightMode.Text} >
        In order to use all the features provided by the app you have to be looged in. Such features include:   
         </Text>
          <Text fontSize="md" marginBottom={'1'}   style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
          - Keep a travel trip history 
          </Text>
          <Text fontSize="md" marginBottom={'1'}   style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
          - Provide feedback from a trip, bus stop, or routes
          </Text>
          <Text fontSize="md" marginBottom={'1'}   style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
          - Get notifications about your trip
          </Text>
        
        <Text fontSize="md" fontWeight="bold" marginBottom={'2'}   style={colorScheme == "dark" ? darkMode.Text : lightMode.Text} >
        Location and Privacy 
        </Text>
        <Text fontSize="md" marginBottom={'2'}   style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
        Users are able to delete their accounts and the data associated with it. The data collected by the app is not shared with any third party. The data is only used for research purposes.
        </Text>

      {/* <Text fontSize="md" marginBottom={'2'} bold   style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
      Made with ❤️ in Puerto Rico 🇵🇷
        </Text> */}
    </Box>
    
   
      </Center>
    </ScrollView>

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
  CardView:{
    width:'95%',
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
  }
  
})

const lightMode = StyleSheet.create({
  Text:{
    color: 'black',
  },
  View:{
    flex: 1,
      // justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      width:'100%',
  },
  CardView:{
    width:'95%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  Card:{
    width:'100%',
    backgroundColor: '#8CCCF4',
  }
})