import { Avatar, Badge, Button, Center, Container, Divider, Heading, Stack, Text } from 'native-base';
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
    
    <Avatar bg="purple.600" alignSelf="center" size="2xl" source={{
        uri: "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80"
      }}>
          RB
        </Avatar>
        <Stack space={4} padding={4} justifyContent="center">
      <Center  flexDir="row">
        <Text fontSize="lg" bold>Steps Taken Today: </Text>
        <Text fontSize="lg" bold>{' 0'} </Text>
      </Center>
    <Button onPress={logout}>
      <Text>
        Logout
      </Text>
    </Button>
    <Divider />
    <Center  flexDir="row">
        <Text fontSize="lg" bold>Ticket History </Text>
      </Center>
    </Stack>
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
