import 'react-native-reanimated';

import * as Location from 'expo-location'

import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native'
import { Divider, Text } from '@ui-kitten/components';
import { IndexPath, Layout, Select, SelectItem } from '@ui-kitten/components';
import MapView,{Marker, Overlay, Polyline} from 'react-native-maps'
import {getRouteColor, getRoutes} from '../assets/gtfs/route'
import { getStops, getStopsByRouteId } from '../assets/gtfs/stops'
import { useEffect, useState } from 'react'

import React from 'react'

export const SelectRoutes = () => {

  const [selectedIndex, setSelectedIndex] = React.useState([]);
  const groupDisplayValues = selectedIndex.map(index => getRoutes()[index.row].route  );
  return (
    <Layout style={{width:'80%'}} >
      <Select
        multiSelect={true}
        value={groupDisplayValues.join(', ')}
        selectedIndex={selectedIndex}
        placeholder='Select Routes'
        onSelect={index => setSelectedIndex(index)}>
        
        { getRoutes().map((stop, index) => {
          return (
            <SelectItem title={stop.route}/>
          )
        }
        )
      }
      </Select>
    </Layout>
  );
};



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
          
        }
        )
      }  
      <View style={{ position: 'absolute', bottom: 10, width: '100%' }}>     
        
              <SelectRoutes/>
      </View>
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
