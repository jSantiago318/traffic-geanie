import {Button, Divider, Layout, List, Text} from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';

import AppLoading from 'expo-app-loading';
import CameraBtn from "../components/CameraBtn";
import DataFetcher from "../components/DataFetcher";
import { HistoricalView } from '../components/TabView';
import React from 'react';
import { faker } from '@faker-js/faker'
import { getRandomStop } from '../assets/gtfs/stops'
import {useNavigation} from "@react-navigation/native";
import useStore from "../store/useStore";

const data = new Array(10).fill({
  title: 'Item',
  color: faker.internet.color(),
  departureTime: faker.date.future(),
  arrivalTime: faker.date.future(),
  stop1: getRandomStop(),
  stop2: getRandomStop(),
  stepsToBus: 44,
  stepsAtDestination: 47,
  stepsDestToBus: 588,
})
export const DetailsScreen = () => {
  const logout = useStore(state => state.logout)
  const navigation = useNavigation();

  const navigateDetails = () => {
    navigation.navigate('Details');
  };

  return (
    <Layout style={styles.container}>

    <View style={styles.container}>
      <Text category='h1'>Details</Text>
      <Button style={styles.button} >Logout</Button>
    </View>

     
      <Text>
        Tickets
      </Text>
      <List
            data={data}
            renderItem={({ item }) => (
                <Layout
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 10,
                        backgroundColor: item.color,
                        margin: 5,
                        borderRadius: 10,
                    }}
                >
                    <Layout>
                        <Text category="h6">{item.title}</Text>
                        <Text category="s1">{item.stop1}</Text>
                        <Text category="s1">{item.stop2}</Text>
                    </Layout>
                    <Layout>
                        <Text category="s1">{item.stepsToBus}</Text>
                        <Text category="s1">{item.stepsAtDestination}</Text>
                        <Text category="s1">{item.stepsDestToBus}</Text>
                    </Layout>
                </Layout>
                    
            )}
          />
    </Layout>
  );
};

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
