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
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  where,
} from "firebase/firestore";
import {
  getOnlineActiveTripsCount,
  getOnlineCount,
} from "../components/URLFetcher";

import { CheckIcon } from "native-base";
import { Colors, } from "../config";
import { DarkTheme } from "@react-navigation/native";
import { RoutesList } from "../components/RoutesList.js";
import { database } from "../config/firebase";
import { getAuth } from "firebase/auth";

export const HomeScreen = () => {
  const [selectedRoute, setSelectedRoute] = React.useState("TIM_RR102");
  const [busCount, setBusCount] = React.useState(0);
  const [activeTripCount, setActiveTripCount] = React.useState(0);
  const colorScheme = useColorScheme();
  // show modal
  const [alarmModalVisible, setAlarmModalVisible] = useState(false);
  setInterval(() => {
    setBusCount(getOnlineCount());
    setActiveTripCount(getOnlineActiveTripsCount());
  }, 1000);

  return (
    <View style={colorScheme == "dark" ? darkMode.View : lightMode.View}>
    
      <View style={colorScheme == "dark" ? darkMode.CardView : lightMode.CardView}>
        <Center>
          <Text
            fontSize="xl"
            bold
            style={colorScheme == "dark" ? darkMode.Title : lightMode.Title}
          >
            Mayaguez Bus Tracker
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
                style={colorScheme == 'dark' ? darkMode.Select : lightMode.Select}
                selectedValue={selectedRoute}
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
  CardView:{
    width:'90%',
    backgroundColor: '#5F86C5',
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
    backgroundColor: '#8CCCF4',
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