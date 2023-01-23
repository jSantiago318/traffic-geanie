import { Layout, Text } from '@ui-kitten/components';
import MapView, {Callout, Marker, Polyline} from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

import BusFetch from '../components/BusFetch';
import React from 'react';
import getStops from '../assets/gtfs/stops';
import getRoutes from './gtfs';
import { MapIcon } from '../assets/icons';
import { render } from 'react-dom';

export const MapScreen = () => {
  const [hideTrip, setHideTrip] = React.useState(true);
  
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
      const color = stop.title.includes(routes[0].route) ? routes[0].color : stop.title.includes(routes[1].route) ? routes[1].color : stop.title.includes(routes[2].route) ? routes[2].color : stop.title.includes(routes[3].route) ? routes[3].color : stop.title.includes(routes[4].route) ? routes[4].color : '#000000';
      
      return (
        <Marker key={index} coordinate={{latitude: stop.latitude, longitude: stop.longitude}} pinColor={color} title={stop.title} description={stop.description}/>
      )
    })
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