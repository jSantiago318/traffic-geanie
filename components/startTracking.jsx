import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import { Box, Button, HStack, Stack } from 'native-base';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, {useEffect} from 'react';

// allow camera 
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { set } from 'react-native-reanimated';

const LOCATION_TRACKING = 'location-tracking';

var l1;
var l2;

function UserLocation() {

    const [locationStarted, setLocationStarted] = React.useState(false);
    const [cameraPermission, setCameraPermission] = React.useState(false);
    const [trackingPermission, setTrackingPermission] = React.useState(false);
    

    const startLocationTracking = async () => {
        await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 5000,
          distanceInterval: 10,
        });
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(
          LOCATION_TRACKING
        );
        console.log('tracking started?', hasStarted);
      };
    useEffect(() => {
        
        const config = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setLocationStarted(true);
                console.log('foreground allow');
            }
        
            const { status2 } = await Location.requestBackgroundPermissionsAsync();
            if (status2 === 'granted') {
                setLocationStarted(true);
                console.log('background allow');
            }
        
            const { status3 } = Camera.useCameraPermissions();
            if (status3 === 'granted') {
                setCameraPermission(true);
                console.log('camera allowed');
            }
        
            const { status4 } = await requestTrackingPermissionsAsync();
            if (status4 === 'granted') {
                setTrackingPermission(true);
                console.log('Yay! I have user permission to track data');
            }
        };
    
        config();
      }, []);
  

    return (
        <Stack space={4} alignItems="center" w="100%">
            <Text>Location Tracking</Text>
            <Text>Camera Permission: {cameraPermission ? 'Granted' : 'Not Granted'}</Text>
            <Text>Tracking Permission: {trackingPermission ? 'Granted' : 'Not Granted'}</Text>
            <Text>Location Started: {locationStarted ? 'Yes' : 'No'}</Text>
            <Button
                onPress={startLocationTracking}
             >
                Start Location Tracking
            </Button>
            <Button onPress={async () => await Camera.requestCameraPermissionsAsync()   }>
                Camera Permission
            </Button>
         </Stack>
        
    );
}

const styles = StyleSheet.create({
    btnText: {
        fontSize: 20,
        backgroundColor: 'green',
        color: 'white',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 10,
    },
});

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
        console.log('LOCATION_TRACKING task ERROR:', error);
        return;
    }
    if (data) {
        const { locations } = data;
        let lat = locations[0].coords.latitude;
        let long = locations[0].coords.longitude;

        l1 = lat;
        l2 = long;

        console.log(
            `${new Date(Date.now()).toLocaleString()}: ${lat},${long}`
        );
    }
});

export default UserLocation;