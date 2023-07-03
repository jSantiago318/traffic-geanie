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
  View,
} from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";

// import {darkMode, lightMode} from '../config/theme'

export const IntroScreen = async () => {

  const colorScheme = useColorScheme();

  return (
    <View style={colorScheme == "dark" ? darkMode.View : lightMode.View}>
    <Center>
      <Box
        style={colorScheme == "dark" ? darkMode.CardView : lightMode.CardView}
      >
        <Text fontSize="xl" fontWeight="bold" marginBottom={'4'} >
          Welcome to Travel Transit Tracker
        </Text>
        <Text fontSize="md" marginBottom={'2'} >
          This app is designed to help and research the public transportation system in Mayaguez, PR. 
        </Text>
        <Text fontSize="md" marginBottom={'2'} >
          This app is designed for users near the Mayaguez area. But, any user from any region can use this app. This app is not limited by any company or organization. It is being developed by a group of researchers from the University of Puerto Rico at Mayaguez.
        </Text>
        <Text fontSize="md" fontWeight="bold" marginBottom={'2'} >
        App usage 
        </Text>
        <Text fontSize="md" marginBottom={'1'} >
        In order to use all the features provided by the app you have to be looged in. Such features include:   
         </Text>
          <Text fontSize="md" marginBottom={'0.5'} >
          - Keep a travel trip history 
          </Text>
          <Text fontSize="md" marginBottom={'0.5'} >
          - Provide feedback from a trip, bus stop, or routes
          </Text>
          <Text fontSize="md" marginBottom={'0.5'} >
          - Get notifications about your trip
          </Text>
        
        <Text fontSize="md" fontWeight="bold" marginBottom={'2'} >
        Location and Privacy 
        </Text>
        <Text fontSize="md" marginBottom={'2'} >
        Users are able to delete their accounts and the data associated with it. The data collected by the app is not shared with any third party. The data is only used for research purposes.
        </Text>

    </Box>
    
   
      </Center>
      <Text fontSize="md" marginBottom={'2'} >
      Made with ❤️ in Puerto Rico 🇵🇷
        </Text>
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
    width:'90%',
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

const lightMode = StyleSheet.create({
  View:{
    flex: 1,
      // justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      width:'100%',
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
  }
})