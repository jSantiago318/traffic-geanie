import { FlatList, HStack, Icon, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';

import React, { } from 'react';
import { getRoutes } from '../assets/gtfs/route';
import {useNavigation} from "@react-navigation/native";

export const RoutesList = () => {

  const renderItemAccessory = (props) => (
    <Text category='h6' >12:50</Text>
  );

  const renderItem = ({ item, index }) => (
    // <ListItem
    //   title={<Text >{item.id}</Text>}
    //   description={<Text >{item.route}</Text>}
    //   accessoryLeft={<Text category='h6'  >🚌</Text>}
    //   accessoryRight={renderItemAccessory}
    // />
    <View style={styles.card}>
    <HStack space={2} alignItems="center">
      <Icon name="bus" size="sm" />

      <Text style={styles.route}>{item.id}</Text>
      <Text style={styles.route}>{item.route}</Text>
      <Text style={styles.timePred}>12:50</Text>
    </HStack>
    </View>
  );

  return (
  <>
    <FlatList
      style={styles.container}
      data={getRoutes()}
      renderItem={renderItem} />
  </>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: '50%',
    width: '80%',
    borderRadius: 10,
  }, timePred:{
    fontSize: 20,
    fontWeight: 'bold',
  }, 
  
});
