import {Button, Divider, Layout, StyleService} from '@ui-kitten/components';

import AppLoading from 'expo-app-loading';
import CameraBtn from "../components/CameraBtn";
import DataFetcher from "../components/DataFetcher";
import React from 'react';
import {useNavigation} from "@react-navigation/native";
import useStore from "../store/useStore";

export const TripScreen = () => {
  const TripScreen = useStore(state => state.trip)
  const navigation = useNavigation();

 
  return (
    <Layout style={{flex: 1}}>
      <Divider/>
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <DataFetcher/>
      {/* <CameraBtn /> */}
      </Layout>
    </Layout>
  );
};

const styles = StyleService.create({
  button: {
    marginTop: 5
  }
});
