

//this creates a carousel menu that is scrollable and has a list of stops for each route    
//this is the code for the carousel menu
//this is the code for the carousel menu

import { Button, Icon, List, ListItem, Text } from '@ui-kitten/components';
import { Callout, Marker, Overlay, Polyline } from 'react-native-maps'
import MapView, { Animated, AnimatedRegion } from 'react-native-maps';

import BusFetch from '../components/BusFetch';
import React from 'react';
import { StyleSheet } from 'react-native';
import { getRoutes } from '../assets/gtfs/route';

export const MapMenu = () => {
const [route, setRoute] = React.useState(null) // selectedRoute
const [stop, setStop] = React.useState(null) //selectedStop
const [trip, setTrip] = React.useState(null) //selectedTripActive
const [hideTrip, setHideTrip] = React.useState(true) //hide Trip Ticket
const [hideStop, setHideStop] = React.useState(true) //hide Stop Review
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
    <MapView
    style={styles.map}
    initialRegion={{
      latitude: 18.203273,
      longitude: -67.14139,
      latitudeDelta: 0.082,
      longitudeDelta: 0.082,
    }}
    showsUserLocation={true}
    userInterfaceStyle={'dark'}
  >
  
  
  </MapView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: '50%',
    width: '80%',
  },
});
