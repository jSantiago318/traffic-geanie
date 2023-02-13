import 'react-native-reanimated';

import * as Location from 'expo-location'

import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native'
import { Divider, Text } from '@ui-kitten/components';
import MapView,{Marker, Polyline} from 'react-native-maps'
import {getRouteColor, getRoutes} from '../assets/gtfs/route'
import { useEffect, useState } from 'react'

import Carousel from 'react-native-reanimated-carousel';
import React from 'react'
import csvToJson from 'convert-csv-to-json';
import { getStops } from '../assets/gtfs/stops'

export const MapScreen = () => {
  const [location, setLocation] = useState(null)
  //[1 == lat], [2 == long], [3 == altitude], [4 == accuracy], [5 == heading], [6 == speed]
  const [errorMsg, setErrorMsg] = useState(null)

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
let RouteShapes = csvToJson.getJsonFromCsv("../assets/gtfs/shapes.csv");

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
      {
        RouteShapes.map((shape, index) => {
            return(
                <Polyline
                    key={index}
                    coordinates={[
                        {latitude: shape.lat, longitude: shape.lon},
                    ]}
                    strokeColor={getRouteColor(shape.id)}
                    strokeWidth={3}
                />

            )})
      }
      
      {/* { getStops().map((stop, index) => {
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
        }
        )
      }    */}
      <Carousel
                loop
                width={Dimensions.get('window').width  }
                height={Dimensions.get('window').height * 0.3}
                autoPlay={true}
                data={getRoutes()}
                style={styles.carousel}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index }) => (
                    <View
                        style={{
                            ...styles.stopListContainer,
                            backgroundColor: getRouteColor(getRoutes()[index].id),
                        }}
                    >
                        <Text style={styles.stopListTitle}>
                            {getRoutes()[index].id}
                        </Text>
                        <Text style={styles.stopListDescription}>
                            {getRoutes()[index].cat}
                        </Text>
                        <Text style={styles.stopListDescription}>
                            {getRoutes()[index].route}
                        </Text>
                        <Divider />
                        
                        
                    </View>
                )}
            />
       </MapView>
       
    </View>
  )
}

const styles = StyleSheet.create({
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
    left: Dimensions.get('window').width * 0.1,
    top: Dimensions.get('window').height - Dimensions.get('window').height * 0.3,
  },
  contentContainer: {
    paddingVertical: 20,
  },

  scrollView: {
    marginHorizontal: 20,
    paddingTop: 10,
  },
  cardContainer: {
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 10,
    height: 100,
    width: 300,
  },
})
