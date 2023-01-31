import * as Location from 'expo-location';

import { Layout, Text } from '@ui-kitten/components';
import MapView, {Callout, Marker, Polyline} from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';

import BusFetch from '../components/BusFetch';
import { MapIcon } from '../assets/icons';
import React from 'react';
import getRoutes from './gtfs';
import getStops from '../assets/gtfs/stops';
import { render } from 'react-dom';

export const MapScreen = () => {
  const [hideTrip, setHideTrip] = React.useState(true);
  const [location, setLocation] = useState(null); //[1 == lat], [2 == long], [3 == altitude], [4 == accuracy], [5 == heading], [6 == speed]
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  return (
    <View style={styles.container}>
    
      <MapView style={styles.map}
      initialRegion={{ 
      latitude: 18.203273,
      longitude: -67.141390,
      latitudeDelta: 0.082,
      longitudeDelta: 0.082,
    }}
       >
       
  {
    getStops().map((stop, index) => {
      const routes = getRoutes();
      const color = stop.title.includes(routes[0].route) ? routes[0].color : stop.title.includes(routes[1].route) ? routes[1].color : stop.title.includes(routes[2].route) ? routes[2].color : stop.title.includes(routes[3].route) ? routes[3].color : stop.title.includes(routes[4].route) ? routes[4].color : stop.title.includes(routes[5].route) ? routes[5].color : 'yellow';
      
      
      return (
        <>
        <Marker key={index} coordinate={{ latitude: stop.latitude, longitude: stop.longitude }} pinColor={color} title={stop.title} description={stop.description} icon={MapIcon} />
        
        
        
        </>
        
      )
    })
  }
    
  {
          location != null && (
            <Marker  coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} pinColor={'black'} title={'user'}  
              description={text}
            icon={MapIcon} />
          )
        }

       </MapView> 
       <BusFetch/>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    
  },
  map: {
    width: '100%',
    height: '70%', //50%
    zIndex: -1,
    
  },
});