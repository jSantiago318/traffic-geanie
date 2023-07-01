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
import React, { useEffect, useState } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
// import {darkMode, lightMode} from '../config/theme'
import {
  getOnlineActiveTripsCount,
  getOnlineCount,
} from "../components/URLFetcher";

import { CheckIcon } from "native-base";
import { RoutesList } from "../components/RoutesList.js";

export const IntroScreen = () => {
  const [selectedRoute, setSelectedRoute] = React.useState("TIM_RR105");
  const [busCount, setBusCount] = React.useState(0);
  const [activeTripCount, setActiveTripCount] = React.useState(0);
  const colorScheme = useColorScheme();
  // show modal
  setInterval(() => {
    setBusCount(getOnlineCount());
    setActiveTripCount(getOnlineActiveTripsCount());
  }, 1000);

  

  return (
    <View style={colorScheme == "dark" ? darkMode.View : lightMode.View}>
    <Center>
      <Box
        style={colorScheme == "dark" ? darkMode.CardView : lightMode.CardView}
      >
        <Text fontSize="xl" fontWeight="bold">
          Welcome to Travel Transit Tracker
        </Text>
    </Box>
      </Center>

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