import * as BackgroundFetch from 'expo-background-fetch'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'

import {
  Button,
  Card,
  Layout,
  List,
  Modal,
  Select,
  SelectItem,
  Tab,
  TabBar,
} from '@ui-kitten/components'
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import { Divider, Text } from '@ui-kitten/components'
import MapView, { Callout, Circle, Marker, Overlay, Polyline } from 'react-native-maps'
import React, { useEffect, useState } from 'react'
import {
  getDeviceCoords,
  getOnline,
  getPosition,
} from '../components/URLFetcher'
import { getRouteByCat, getRouteColor, getRoutes } from '../assets/gtfs/route'
import { getStops, getStopsByRouteId } from '../assets/gtfs/stops'

import { TouchableOpacity } from 'react-native-gesture-handler'
import { getDeviceAccuracy } from '../components/URLFetcher'
import { setInter } from 'react'
import { useNavigation } from '@react-navigation/native'

const Shapes = require('../assets/gtfs/shapes.json')
const BACKGROUND_FETCH_TASK = 'background-fetch'
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now()

  console.log(
    `Got background fetch call at date: ${new Date(now).toISOString()}`,
  )

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData
})
async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  })
}
async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK)
}

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
    <View style={styles.container}>
      <MapView
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
              key={index}
              coordinate={{
                latitude: stop.lat,
                longitude: stop.lon,
              }}
              title={stop.id}
              description={stop.name}
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
                key={index}
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
              key={index}
              coordinates={getShapeByRouteId(route.id)}
              strokeColor={getRouteColor(route.id)}
              strokeWidth={4}
            />
          )
        })}

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
