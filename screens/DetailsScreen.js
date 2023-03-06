import { Button, FlatList, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';

import CameraBtn from "../components/CameraBtn";
import DataFetcher from "../components/DataFetcher";
import React from 'react';
import { getRandomStop } from '../assets/gtfs/stops'
import {useNavigation} from "@react-navigation/native";
import useStore from "../store/useStore";

export const DetailsScreen = () => {
  const logout = useStore(state => state.logout)
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
    <Button onPress={logout}>
      <Text>
        Logout
      </Text>
    </Button>
      <Text>
        name
      </Text>
      <Text>
        email
      </Text>
      <Text>
        Bus Taken
      </Text>
    </View>
  )};

const styles = StyleSheet.create({
  button: {
    marginTop: 5
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});
