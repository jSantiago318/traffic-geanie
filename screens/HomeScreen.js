import { Box, Button, Center, FlatList, HStack, Select, Text } from 'native-base';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { getCurrentTime, getOnlineActiveTripsCount, getOnlineCount, getRouteIdforAgency, getScheduleForStop } from '../components/URLFetcher';
import {useNavigation, useTheme} from "@react-navigation/native";

import { CheckIcon } from 'native-base';
import DataFetcher from "../components/DataFetcher";
import {RoutesList} from "../components/RoutesList.js";
import useStore from "../store/useStore";

// RN Code
const Col = ({ numRows, children }) => {
  return  (
    <View style={stylesLayout[`${numRows}col`]}>{children}</View>
  )
}

const Row = ({ children }) => (
  <View style={stylesLayout.row}>{children}</View>
)


export const HomeScreen = () => {
  const [routes, setRoutes] = React.useState(null);
  const [selectedRoute, setSelectedRoute] = React.useState();
  useEffect(() => {
      if (routes == null) {
        fetch('https://pr-oba.live/api/where/route-ids-for-agency/TIM.json?key=TEST').then((response) => response.json()).then((data) => {
      setRoutes(data.data.list);
      setSelectedRoute(data.data.list[0]);
      })
    }
  }, [routes, selectedRoute]);

  

  return (
    <View style={styles.container}>
      {/* <DataFetcher/> */}
      <Text fontSize="2xl" bold>Mayaguez Bus Tracker</Text>

      <View style={stylesLayout.app}>
      <Row>
        <Col numRows={2}>
        <View style={styles.card} >
        <Text fontSize={'md'} bold >Online Buses: {getOnlineCount()}</Text>
        <Text fontSize={'md'} bold >Active Routes: {getOnlineActiveTripsCount()}
        </Text>
      </View>
        </Col>
        <Col numRows={2}>
      <View style={styles.card} >
        <Text fontSize={'md'} bold >Alerts</Text>
      </View>
        </Col>
      </Row>
    </View>
    <Center>
      <Box maxW="300">
        <Select selectedValue={selectedRoute} minWidth="200" accessibilityLabel="Choose a route" placeholder="Choose a route" _selectedItem={{
        bg: "#93e1d8",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={itemValue => {
        setSelectedRoute(itemValue) }}>
      {
        routes != null ? (
            routes.map((item, index) => {
              return (
                <Select.Item label={item} value={item} key={index}   />
              )
            }
          )) : null
      }
         
        </Select>
      </Box>
    </Center>
      <Text fontSize={'md'} bold >{selectedRoute}</Text>
      {
        selectedRoute != null ? (
          <RoutesList route={selectedRoute} />
        ) : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  routeLists: {
    width: '90%',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#93e1d8',
  },
  
  button: {
    marginTop: 5,
    width: '40%',
    backgroundColor: '#93e1d8',
    tintColor: '#93e1d8',
    borderRadius: 5,
    borderColor: 'transparent',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddfff7',
    padding: 20,
  },
  layout: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#93e1d8',
  }
  
  
});

// Styles
const stylesLayout = {
  app: {
    paddingTop: 20,
    marginHorizontal: "auto",
    width: "100%",
    borderColor: 'transparent',
  },
  row: {
    flexDirection: "row",
    borderColor: 'transparent',
  },
  "1col":  {
    borderWidth:  1,
    flex:  1,
    borderColor: 'transparent',
  },
  "2col":  {
    borderWidth:  1,
    flex:  2,
    borderColor: 'transparent',
  },
}