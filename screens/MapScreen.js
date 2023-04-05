import * as Location from 'expo-location'

import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  HStack,
  Icon,
  Select,
  Spacer,
  Stack,
  Text,
  VStack,
} from 'native-base'
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import MapView, {
  Animated,
  AnimatedRegion,
  Callout,
  Circle,
  Marker,
  Overlay,
  Polyline,
} from 'react-native-maps'
import React, { Component, useEffect, useState } from 'react'
import {
  checkOnline,
  getDeviceCoords,
  getOnline,
  getOnlineById,
  getPosition,
  getRouteIdforAgency
} from '../components/URLFetcher'
import { getFirstOfRoute, getRouteByStopId, getStopsByRouteId } from '../assets/gtfs/stops'
import {
  getRouteByCat,
  getRouteById,
  getRouteColor,
  getRoutes
} from '../assets/gtfs/route'

import { StopRender } from '../components/OBAFetches/StopRender'
import { getStops } from '../assets/gtfs/stops'
import { useNavigation } from '@react-navigation/native'

const Shapes = require('../assets/gtfs/shapes.json')

let ticketStop = null
export function getTicketStop() {
  return ticketStop
}

export const MapScreen = () => {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const navigation = useNavigation()
  const [onlyShowOnline, setOnlyShowOnline] = useState(false)
  const [stops, setStops] = useState([])


  const navigateToTicket = () => {
    navigation.navigate('Ticket')
  }
 
  const setOnlyShowOnlineHelper = () => {
    if(onlyShowOnline){
      setOnlyShowOnline(false)
  } else{
    setOnlyShowOnline(true)
  }
}
  useEffect(() => {
   
    ;(async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }
      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)

      const interval = setInterval(async () => {
        setLocation(await Location.getCurrentPositionAsync({}))
      }, 5000)
      return () => clearInterval(interval)
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
      if (shape.shape_id.includes(routeId)) {
        coord.push({
          latitude: shape.shape_pt_lat,
          longitude: shape.shape_pt_lon,
        })
      }
    })
    return coord
  }

  return (
    <View style={styles.container}>
      <MapView
        showsUserLocation={true}
        style={styles.map}
        ref = {(mapView) => { _mapView = mapView; }}

        initialRegion={
          location != null
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : {
                latitude: 18.2009063,
                longitude: -67.1281423,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
        }
      >

{
  getPosition().map((device, index) => {
    const isOnline = getOnlineById(device.deviceId)
    if(onlyShowOnline && isOnline == 'online'){
      return (
      <Marker
        key={index}
        coordinate={{
          latitude: device.latitude,
          longitude: device.longitude,
        }}
        title={device.deviceId}
        description={device.deviceId}
        pinColor={'green'}>  
          <Image source={require('../assets/car-online.png')} style={{height: 35, width:35 }} />
          <Callout style={{
            width : 200
          }}>
          <Text>Bus {device.deviceId} - {isOnline}</Text>
            <Text> {device.accuracy}</Text>
          </Callout>
      </Marker>
    )
    } else if (!onlyShowOnline){
      if (isOnline == 'online'){
      return (
      <Marker
        key={index}
        coordinate={{
          latitude: device.latitude,
          longitude: device.longitude,
        }}
        title={device.deviceId}
        description={device.deviceId}
        pinColor={'green'}>  
          <Image source={require('../assets/car-online.png')} style={{height: 35, width:35 }} />
          <Callout style={{
            width : 200
          }}>
          <Text>Bus {device.deviceId} - {isOnline}</Text>
            <Text> {device.accuracy}</Text>
          </Callout>
      </Marker>
    )
    } else {
      return (
        <Marker
        key={index}
        coordinate={{
          latitude: device.latitude,
          longitude: device.longitude,
        }}
        title={device.deviceId}
        description={device.deviceId}
        pinColor={'red'}>  
          <Image source={require('../assets/car-default.png')} style={{height: 35, width:35 }} />
          <Callout style={{
            width : 200
          }}>
          <Text>Bus {device.deviceId} - {isOnline}</Text>
            <Text> {device.accuracy}</Text>
          </Callout>
      </Marker>
      )
    }
  }
  })
}
        {
          getStops().map((stop, index) => {
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
              >
                <Callout>
                <Text>
                  {stop.id}
                </Text>
                <Text>
                {stop.name}
                </Text>
                {/* <StopRender stopId={stop.id} /> */}
                </Callout>
              </Marker>
            )
          })
        } 
        

        {
          getPosition().map((device, index) => {
            const isOnline = getOnlineById(device.deviceId)
            if(onlyShowOnline && isOnline == 'online'){
              return (
              <Marker
                key={index}
                coordinate={{
                  latitude: device.latitude,
                  longitude: device.longitude,
                }}
                title={device.deviceId}
                description={device.deviceId}
                pinColor={'green'}>  
                  <Image source={require('../assets/car-online.png')} style={{height: 35, width:35 }} />
                  <Callout style={{
                    width : 200
                  }}>
                  <Text>Bus {device.deviceId} - {isOnline}</Text>
                    <Text> {device.accuracy}</Text>
                  </Callout>
              </Marker>
            )
            } else if (!onlyShowOnline){
              if (isOnline == 'online'){
              return (
              <Marker
                key={index}
                coordinate={{
                  latitude: device.latitude,
                  longitude: device.longitude,
                }}
                title={device.deviceId}
                description={device.deviceId}
                pinColor={'green'}
              >              
                  <Image source={require('../assets/car-default.png')} style={{height: 35, width:35 }} />
                  <Callout style={{
                    width : 200
                  }}>
                  <Text>Bus {device.deviceId} - {isOnline}</Text>
                    <Text> {device.accuracy}</Text>
                    
                  </Callout>
                  
                    
              </Marker>
            )
            } else{
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: device.latitude,
                    longitude: device.longitude,
                  }}
                  title={device.deviceId}
                  description={device.deviceId}
                  pinColor={'green'}
                >              
                    <Image source={require('../assets/car-default.png')} style={{height: 35, width:35 }} />
                    <Callout style={{
                      width : 200
                    }}>
                    <Text>Bus {device.deviceId} - {isOnline}</Text>
                      <Text> {device.accuracy}</Text>
                      
                    </Callout>
                    
                      
                </Marker>
              )}
            }
            
          }
          )
        }
        

       {
        getRoutes().map((route, index) => {
          return (
            <Polyline
              key={index}
              coordinates={getShapeByRouteId(route.id)}
              strokeColor={getRouteColor(route.id)}
              strokeWidth={3}
            />
          )
        })
       }
       
        
      </MapView>
    
      <View style={styles.carousel}>
      <HStack space={4} >    
      <Button onPress={ setOnlyShowOnlineHelper  } >
        Online Bus
      </Button>
      <Button  >
        🧭
      </Button>
      </HStack>
      </View>
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
    fontSize: 15, //hykj8LmMrfnx
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
    bottom: 15,
    left: 0,
    width: '100%',
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
