import * as Location from 'expo-location'

import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import MapView, { Callout, Circle, Marker, Overlay, Polyline } from 'react-native-maps'
import React, { useEffect, useState } from 'react'
import {
  getDeviceCoords,
  getOnline,
  getPosition,
} from '../components/URLFetcher'
import { getRouteByCat, getRouteColor, getRoutes } from '../assets/gtfs/route'
import { getStops, getStopsByRouteId } from '../assets/gtfs/stops'

import { Text } from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { getDeviceAccuracy } from '../components/URLFetcher'
import { setInter } from 'react'
import { useNavigation } from '@react-navigation/native'

const Shapes = require('../assets/gtfs/shapes.json')

export const MapScreen = () => {
  
  
  const [location, setLocation] = useState(null)
  const navigation = useNavigation()
  function goToTicket() {
    navigation.navigate('Ticket')
  }
  const [errorMsg, setErrorMsg] = useState(null)
  const [showRural, setShowRural] = useState(false)
  const [showUrban, setShowUrban] = useState(false)
  const [showColegio, setShowColegio] = useState(false)

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
      }, 5000);
      return () => clearInterval(interval);
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
      <MapView
        key={location != null ? location.coords.latitude : 0}
        style={styles.map}
        initialRegion={{
          latitude: 18.207329,
          longitude: -67.140823,
          latitudeDelta: 0.022,
          longitudeDelta: 0.022,
        }}
      >
      {
        location != null ? (
          <>
          <Marker
          key={'location'}
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title={'You are here'}
          description={'Your current location'}
        />
          </>

        ) : null
      }
        {getStops().map((stop, index) => {
          return (
            <>
            <Marker
              key={stop.id}
              coordinate={{
                latitude: stop.lat,
                longitude: stop.lon,
              }}
              title={stop.name}
              description={stop.id}
              pinColor={getRouteColor(stop.id)}
            />
           
            </>
          )
        })}

        {getOnline().map((device, index) => {
          if (device.status == 'online') {
            return (
              <>
              <Marker
                key={device.uniqueId}
                coordinate={getDeviceCoords(device.id)}
                title={device.id}
                description={device.name}
                pinColor={'red'}
              />
              </>
            )
          }
          })}
        {getRoutes().map((route, index) => {
          return (
            <Polyline
              key={route.id}
              coordinates={getShapeByRouteId(route.id)}
              strokeColor={getRouteColor(route.id)}
              strokeWidth={4}
            />
          )
        })}
      </MapView>
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
    fontSize: 15,//hykj8LmMrfnx
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
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
