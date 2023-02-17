import * as Location from 'expo-location'

import { Button, Card, Layout, List, Modal, Select, SelectItem, Tab, TabBar } from '@ui-kitten/components';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import { Divider, Text } from '@ui-kitten/components';
import MapView,{Callout, Marker, Overlay, Polyline} from 'react-native-maps'
import {getRouteByCat, getRouteColor, getRoutes} from '../assets/gtfs/route'
import { getStops, getStopsByRouteId } from '../assets/gtfs/stops'
import { useEffect, useState } from 'react'

import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getOnlineLocation } from '../components/URLFetcher';
import { useNavigation } from '@react-navigation/native';

const Shapes = require('../assets/gtfs/shapes.json');


export const MapScreen = () => {
  const [location, setLocation] = useState(null)
  //[1 == lat], [2 == long], [3 == altitude], [4 == accuracy], [5 == heading], [6 == speed]
  const navigation = useNavigation();
  function goToTicket() {
    navigation.navigate('Ticket')
  }
  const [errorMsg, setErrorMsg] = useState(null)
  const [currStop, setCurrStop] = React.useState([]);
  const [currRoute, setCurrRoute] = React.useState([]);
 
  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })()
  }, [])

  let text = 'Waiting..'
  if (errorMsg) {
    text = errorMsg
  } else if (location) {
    text = JSON.stringify(location)
  }

  function getShapeByRouteId(routeId) {
    let coord = []
    Shapes.map((shape) => {
      if (shape.id.includes(routeId)) {
        coord.push({
          latitude: shape.lat,
          longitude: shape.lon,
        })
      }
    })
    
    return coord
  }
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 18.207329,
          longitude: -67.140823,
          latitudeDelta: 0.022,
          longitudeDelta: 0.022,
        }}
        followsUserLocation={true}
      >     
      { getStops().map((stop, index) => {      
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: stop.lat,
                longitude: stop.lon,
              }}
              title={stop.id}
              description={stop.name}
              pinColor={getRouteColor(stop.id)}
            />
          )
        })}

        
      {
        getOnlineLocation().map((stop, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: stop.latitude,
                longitude: stop.longitude,
              }}
              title={stop.id}
              description={stop.name}
              pinColor={'black'}
              onSelect={() => {
                setCurrStop(stop)
              }}
            />
          )
          
        } )
      }
      {
        getRoutes().map((route, index) => {
          return (
            <Polyline
              key={index}
              coordinates={getShapeByRouteId(route.id)}
              strokeColor={getRouteColor(route.id)}
              strokeWidth={4}
            />
          )
        }
        )
      }
      
      <Callout style={styles.cardContainer} >
        
        <Button onPress={goToTicket}>Buy Ticket</Button>
        
      </Callout>
 
    
                   
       </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  containerScroll: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  stopListTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },

  stopListDescription: {
    fontSize: 10,
    color: 'black',
  },

  stopListContainer: {
    padding: 10,
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.8,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  carousel: {
    position: 'absolute',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 10,
    left: 10,
    width: '90%',

  },
  contentContainer: {
    paddingVertical: 20,
  },

  scrollView: {
    marginHorizontal: 20,
    paddingTop: 10,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: 300,
    top: Dimensions.get('window').height * 0.5,
    left: Dimensions.get('window').width * 0.1,
  },
  
})
