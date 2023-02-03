import {Button, Divider, Layout, Text} from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import {useNavigation, useTheme} from "@react-navigation/native";

import AppLoading from 'expo-app-loading';
import CameraBtn from "../components/CameraBtn";
import DataFetcher from "../components/DataFetcher";
import React from 'react';
import useStore from "../store/useStore";

export const HomeScreen = () => {
 
  return (
    <View style={styles.container}>
      <DataFetcher/>
      <CameraBtn/>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginTop: 5
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddfff7',
  },
  layout: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
