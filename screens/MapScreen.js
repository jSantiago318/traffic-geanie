import * as FileSystem from 'expo-file-system'
import * as Location from 'expo-location'

import {
  Button,
  Card,
  Icon,
  Layout,
  List,
  ListItem,
  Text,
} from '@ui-kitten/components'
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { FlatList, TouchableHighlight } from 'react-native'
import MapView, { Callout, Marker, Overlay, Polyline } from 'react-native-maps'
import { getOnline, getPosition, getRouteArrivalTime, getTrip } from '../components/URLFetcher'
import { useEffect, useState } from 'react'

import Carousel from 'react-native-snap-carousel/src/carousel/Carousel'
import { MapIcon } from '../assets/icons'
import React from 'react'
import getRoutes from './gtfs'
import { getStops } from '../assets/gtfs/stops'

export const MapScreen = () => {
 

   const [hideTrip, setHideTrip] = React.useState(true)
  const [location, setLocation] = useState(null)
  //[1 == lat], [2 == long], [3 == altitude], [4 == accuracy], [5 == heading], [6 == speed]
  const [errorMsg, setErrorMsg] = useState(null)
  const [selected, SetSelected] = React.useState(null)

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
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 18.203273,
          longitude: -67.14139,
          latitudeDelta: 0.082,
          longitudeDelta: 0.082,
        }}
      >
        {location != null && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            pinColor={'black'}
            title={'user'}
            description={text}
          />
        )}
        {
          getPosition().map((trip, index) => {
            return (
              <Marker 
                key={index}
                title={trip.deviceId}
                coordinate={{
                  latitude: trip.latitude,
                  longitude: trip.longitude,
                }}
                pinColor={'yellow'}
                // icon={MapIcon}
                opacity={0.5}
              >
                <Callout>
                  <Text>{trip.attributes.batteryLevel}</Text>
                  </Callout>
              </Marker>
            )
          })

        }
        
        {getStops().map((stop, index) => {
          const routes = getRoutes()
          const color = stop.title.includes(routes[0].route)
            ? routes[0].color
            : stop.title.includes(routes[1].route)
            ? routes[1].color
            : stop.title.includes(routes[2].route)
            ? routes[2].color
            : stop.title.includes(routes[3].route)
            ? routes[3].color
            : stop.title.includes(routes[4].route)
            ? routes[4].color
            : routes[5].color

          return (
            <>
              <Marker
                opacity={0.3}

                key={index}
                coordinate={{
                  latitude: stop.latitude,
                  longitude: stop.longitude,
                }}
                pinColor={color}
                title={stop.title}
                description={stop.description}
                icon={MapIcon}
              />
            </>
          )
        })}
      </MapView>

      <Carousel
        layout={'default'}
        data={getRoutes()}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={
          Dimensions.get('window').width - Dimensions.get('window').width * 0.2
        }
        containerCustomStyle={styles.carousel}
        removeClippedSubviews={false}
        renderItem={({ item, index }) => {
          return (
            <Layout
              style={{
                backgroundColor: item.color,
                borderRadius: 10,
                padding: 10,
                // margin: 10,
              }}
              key={index}
            >
              <Text
                style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}
              >
                {item.routeCode}
              </Text>
              <Text
                style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}
              >
                {item.route}
              </Text>

              <List
                data={getStops().filter((stop) =>
                  stop.title.includes(item.route)
                )}
                style={{ backgroundColor: 'transparent', marginTop: 10 }}
                keyExtractor={(item) => item.title}
                
                renderItem={({ item, index }) => (
                  <ListItem
                    style={styles.stopListContainer}
                    key={index}
                    >
                    <Icon name="pin" fill="black" style={{ width: 20, height: 20 }} />
                    <View style={{ paddingLeft:10, flexDirection: 'column', justifyContent: 'space-between'}}>

                    <Text style={styles.stopListTitle}>{item.title}</Text>
                    <Text style={styles.stopListDescription}>
                      {item.description}
                    </Text>
                    </View>
                    <Text style={styles.stopListArrival}>
                      {'12:50'}
                    </Text>

                    </ListItem>
                )}/>
            </Layout>
          )
        }}
      />

      {/* <BusFetch/> */}
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
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 2,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    // width: '100%',
    // height: '100%', //50%
    ...StyleSheet.absoluteFillObject,
  },
  carousel: {
    position: 'absolute',
    left: 0,
    marginBottom: 48,
    top: Dimensions.get('window').height - Dimensions.get('window').height / 2,
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
