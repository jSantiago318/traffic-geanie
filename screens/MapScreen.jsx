import * as Location from "expo-location";
import * as MapVal from "../assets/map.json";

import { Box, Button, Checkbox, HStack, Icon, Text, VStack } from "native-base";
import { Colors, darkMode, lightMode, } from "../config";
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { addDoc, collection, doc } from "firebase/firestore";
import { getOnlineById, getPosition } from "../components/URLFetcher";
import { getRouteColor, getRoutes } from "../assets/gtfs/route";

import { Pedometer } from "expo-sensors";
import { database } from "../config/firebase";
import {getAuth} from 'firebase/auth';
import {
  getStops,
} from "../assets/gtfs/stops";
import { useNavigation } from "@react-navigation/native";
import { useStopwatch } from "react-timer-hook";

const Shapes = require("../assets/gtfs/shapes.json");

export const MapScreen = () => {
  const colorScheme = useColorScheme();
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();
  const [confirm, setConfirm] = useState(0);
  const [selectedRoute, setSelectedRoute] = useState(null); 
  const [startStop, setStartStop] = useState(null);
  const [finalStop, setFinalStop] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [userLocHistory, setUserLocHistory] = useState([]);
  const [runTime, setRunTime] = useState(false);
 const [selectTraveler, setSelectTraveler] = useState(false);
 const [routeSelecter, setRouteSelecter] = useState(false);
 const [excludedRoutes, setExcludedRoutes] = useState([]);
  const memoStop = React.useMemo(() => getStops(excludedRoutes), []);
const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking'); 
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [hideTrip, setHideTrip] = useState(false);
  const [travelingBy, setTravelingBy] = useState('walk');
  const [hideSelectRoute, setHideSelectRoute] = useState(false);
  const [backLoc, setBackLoc] = useState([]);
  const [onChangeEndValue, setOnChangeEndValue] = useState(0);
    const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }

      return Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
      });
    }
  }; 
  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false }); 
setInterval(async () => {
  if (location == null) {
    let loc = await Location.getCurrentPositionAsync({
      enableHistory: true,
      enableHighAccuracy: true,
    })
    setLocation(loc)
    if(confirm == 2 || confirm == 4){
      const elem = {
        lat: loc.coords.latitude,
        lon: loc.coords.longitude,
        timestamp: loc.timestamp,
      }
      setUserLocHistory([...userLocHistory, elem])
      setBackLoc([...backLoc, elem])
    }
  }
  
}, 5000); 
   

  const [tripTime, setTripTime] = useState([]);
   async function getTime(url) {
    if(runTime){
      if (seconds < 10){
        const tm = minutes+':0'+seconds
        setTripTime(tm)
      }else{
        const tm = minutes+':'+seconds
        setTripTime(tm)
      }
  }
  }


  function getShapeByRouteId(routeId) {
    let coord = [];
    Shapes.map((shape) => {
      if (shape.shape_id.includes(routeId)) {
        coord.push({
          latitude: shape.shape_pt_lat,
          longitude: shape.shape_pt_lon,
        });
      }
    });
    return coord;
  }
  function returnStop(stopId) {
    if (stopId == startStop) {
      return (
        <Image
          source={require("../assets/busStop1.png")}
          style={{ height: 40, width: 40 }}
        />
      );
    } else if (stopId == finalStop) {
      return (
        <Image
          source={require("../assets/busStop2.png")}
          style={{ height: 40, width: 40 }}
        />
      );
    } else {
      return (
        <Image
          source={require("../assets/BusStop.png")}
          style={{ height: 40, width: 40 }}
        />
      );
    }
  } 
  return (
    <View style={styles.container}>
      <MapView
        userLocationUpdateInterval={1000}
        provider={PROVIDER_GOOGLE}
        customMapStyle={MapVal}
        showsUserLocation={true}
        style={styles.map}
        ref={(mapView) => {
          _mapView = mapView;
        }}
        initialRegion={{
          latitude: 18.201025,
          longitude: -67.13183,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
      {
        confirm == 2 || confirm == 4 ? (
          <Polyline
            coordinates={userLocHistory}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={[
              '#7F0000',
              '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
              '#B24112',
              '#E5845C',
              '#238C23']}
            strokeWidth={6}
          />
        ) : null
      }
        {memoStop.map((stop, index) => {
          return (
            <Marker
            zIndex={100}
              key={index}
              coordinate={{
                latitude: stop.lat,
                longitude: stop.lon,
              }}
              pinColor={getRouteColor(stop.id)}
              onPress={() => {
                if (stop.id.length >= 4) {
                  const rt = stop.id.slice(0, 5);
                  setSelectedRoute(rt);

                  if (startStop == null) {
                    setSelectedStop(stop);
                    setConfirm(0.5);
                  } else if (finalStop == null && startStop != null) {
                    setSelectedStop(stop);
                    setConfirm(0.5);
                  }
                } else {
                  setSelectedRoute(stop.id);
                }
              }}
            >
              {returnStop(stop.id)}

              <Callout
                style={{
                  width: 200,
                  zIndex: 100,
                  borderRadius: 10,
                }}
              >
                <Text>{stop.name}</Text>
                <Text>{stop.id}</Text>
              </Callout>
            </Marker>
          );
        })}
        {getPosition().map((device, index) => {
          const isOnline = getOnlineById(device.deviceId);
          if (isOnline == "online") {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: device.latitude,
                    longitude: device.longitude,
                  }}
                >
                  <Image
                    source={require("../assets/car-online.png")}
                    style={{ height: 40, width: 40 }}
                  />
                  <Callout
                    style={{
                      width: 200,
                      borderRadius: 10,
                    }}
                  >
                    <Text>
                      Bus {device.deviceId} - {isOnline}
                    </Text>
                    <Text> kmh: {device.speed}</Text>
                  </Callout>
                </Marker>
              );
            }
        })}
        {/* <MemoTrip /> */}

        {getRoutes().map((route, index) => {
          return (
            <Polyline
              key={index}
              coordinates={getShapeByRouteId(route.id)}
              strokeColor={getRouteColor(route.id)}
              strokeWidth={2}
            />
          );

        })}
      </MapView>

      {/* TEext overlay at bottom
       */}
      <VStack
        style={{
          position: "absolute",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          bottom: "10%",
          padding: 10,
          left: 0,
          width: "100%",
        }}
      >
      {
        hideTrip ? true : (
          <HStack  
          py={2}
          px={2}
          space={2}
          alignItems="center"
          
           >
          <Button style={colorScheme == "dark" ? darkMode.Button : lightMode.Button}
       onPress={() => {
                setConfirm(4);
                start();
                setHideSelectRoute(true);
              }}
              >
        <Text style={colorScheme == "dark" ? darkMode.Title : lightMode.Title}
        >
         🚗 Start Trip 
        </Text>
      </Button> 

        <Button
          onPress={() => {
            setSelectTraveler(!selectTraveler);
          }}
          style={{
            zIndex: 100,
            backgroundColor: colorScheme == "dark" ? Colors.secondaryDark : Colors.secondaryLight,
          }}
        >
          <MaterialCommunityIcons name={travelingBy} size={24} color="white" />
        </Button>
        </HStack>
         )
      }
      
        {
          hideSelectRoute ? true : (
            <Box style={colorScheme == "dark" ? darkMode.CardView : lightMode.CardView}>
          < Text
          style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}       >
            Selected Route: 
            {selectedRoute}
          </Text>
          <Text
           style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}
          >
            First Stop: {startStop}
          </Text>
          <Text
           style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}
          >
            Final Stop: {finalStop}
          </Text>
        </Box>
          ) 
            
        }
        {confirm == 0.5 ? (
          <HStack space={2} alignItems="center" justifyContent="center">
            <Button
            style={
              colorScheme == "dark" ? darkMode.Button : lightMode.Button
            }
              onPress={() => {
                if (startStop == null) {
                  setStartStop(selectedStop.id);
                } else if (finalStop == null && startStop != null) {
                  setFinalStop(selectedStop.id);
                  setConfirm(1);
                  setHideTrip(true);
                } 
              }}
            >
              <Text> Confirm </Text>
            </Button>
            <Button
            style={
              colorScheme == "dark" ? darkMode.Button : lightMode.Button
            }
              onPress={() => {
         
                // setRunTime(false);
                setConfirm(0);
                setStartStop(null);
                setFinalStop(null);
                setSelectedRoute(null);
                setUserLocHistory([])
                setHideTrip(false);
              }}
            >
              <Text> Cancel </Text>
            </Button>
          </HStack>
        ) : null}
     
        {
          confirm == 1 ? (
            <HStack space={2} alignItems="center" justifyContent="center">
            <Button
            style={colorScheme == "dark" ? darkMode.Button : lightMode.Button}
              onPress={() => {
                // setRunTime(false);
                setConfirm(0);
                setStartStop(null);
                setFinalStop(null);
                setSelectedRoute(null);
                setUserLocHistory([])
                setHideTrip(false);
              }}
            > <Text >Clear</Text> </Button>
            <Button
             style={colorScheme == "dark" ? darkMode.Button : lightMode.Button}
              onPress={() => {
                // setRunTime(true);
                // setStartTime(new Date());
                setConfirm(2);
                start();
              }}
            > <Text> Start Trip </Text> </Button>
            </HStack>
          ): null
        }

        {
          confirm == 2 ? (
            
            <Box  style={
              colorScheme == "dark" ? darkMode.CardView : lightMode.CardView
            } >
            <VStack space={2} alignItems="center" justifyContent="center">
          <Text style={colorScheme == "dark" ? darkMode.Title : lightMode.Title}>
            Trip Duration: {minutes}:{seconds < 10 ? "0" + seconds : seconds }
          </Text>
          <Text style={colorScheme == "dark" ? darkMode.Title : lightMode.Title}>Current Steps: {currentStepCount}</Text>     
          <HStack space={2} style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            
          }} >
            <Button
              style={colorScheme == "dark" ? darkMode.Button : lightMode.Button}
              onPress={() => {
                // setRunTime(false);
                setConfirm(3);
                pause()
                setOnChangeEndValue(currentStepCount)
              }}
            > <Text> End Trip </Text> </Button>
            <Button
            style={colorScheme == "dark" ? darkMode.Button : lightMode.Button}
              onPress={() => {
                // setRunTime(false);
                reset()
                
                // setRunTime(false);
                setConfirm(0);
                setStartStop(null);
                setFinalStop(null);
                setSelectedRoute(null);
                setUserLocHistory([])
                setHideTrip(false);
              }}
            > <Text> Cancel </Text> </Button>
            </HStack>
            </VStack>
            </Box>
            
          ):null
        }
        {
          confirm == 3 ? (
            <Box
              alignContent={'center'}
              alignItems={'center'}
              justifyItems={'center'}
              style={
              colorScheme == "dark" ? darkMode.CardView : lightMode.CardView
            } >

          
          <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
            Trip Duration: {minutes}:{seconds < 10 ? "0" + seconds : seconds}
          </Text>
          <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
            Total Steps: {onChangeEndValue}
          </Text>
            <Button
              style={colorScheme == "dark" ? darkMode.Button : lightMode.Button}
              onPress={async () => {
                // setRunTime(false);
                try {
            const id = getAuth().currentUser?.uid;
            const docRed = doc(database, "users", id);
            await addDoc(collection(docRed, "trips"), {
              stepCount: currentStepCount,
              startTime: location.timestamp,
              startStop: startStop,
              travel: travelingBy,
              finalStop: finalStop,
              loc: userLocHistory,
              selectedRoute: selectedRoute,
              timeframe: hours + ":" + minutes + ":" + seconds,
                        location: {
                          lat: location.coords.latitude || 18.201025,
                          lon: location.coords.longitude || -67.1318,
                        },            });
          } catch (e) {
            console.log(e);
          }
          setConfirm(0);
          reset();
          setStartStop(null);
          setFinalStop(null);
          setSelectedRoute(null);
          setUserLocHistory([])

          setHideTrip(false);
              }}
            > <Text> Continue </Text> </Button>
            </Box>
          ):null
        }
        {
          confirm == 4 ? (
            
            <Box  style={
              colorScheme == "dark" ? darkMode.CardView : lightMode.CardView
            } >
            <VStack space={2} alignItems="center" justifyContent="center">
          <Text style={colorScheme == "dark" ? darkMode.Title : lightMode.Title}>
            Trip Duration: {minutes}:{seconds < 10 ? "0" + seconds : seconds }
          </Text>
          <Text style={colorScheme == "dark" ? darkMode.Title : lightMode.Title}>Travel: {travelingBy}</Text>

          <Text style={colorScheme == "dark" ? darkMode.Title : lightMode.Title}>Current Steps: {currentStepCount}</Text>     
          <HStack space={2} style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            
          }} >
            <Button
            style={colorScheme == "dark" ? darkMode.Button : lightMode.Button}
              onPress={() => {
                // setRunTime(false);
                setConfirm(5);
                pause()
                setOnChangeEndValue(currentStepCount)
              }}
            > <Text> End Trip </Text> </Button>
            <Button
              style={colorScheme == "dark" ? darkMode.Button : lightMode.Button}
              onPress={() => {
                // setRunTime(false);
                
                reset()
                // setRunTime(false);
                setConfirm(0);
                setStartStop(null);
                setFinalStop(null);
                setSelectedRoute(null);
                setUserLocHistory([])
                setHideSelectRoute(false);
              }}
            > <Text> Cancel </Text> </Button>
            </HStack>
            </VStack>
            </Box>
            
          ):null
        }
        {
          confirm == 5 ? (
            <Box  style={
              colorScheme == "dark" ? darkMode.CardView : lightMode.CardView
            } >
            

          <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
            Trip Rating 
          </Text>
          <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
            Trip Duration: {minutes}:{seconds < 10 ? "0" + seconds : seconds}
          </Text>
          <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
            Total Steps: {onChangeEndValue}
          </Text>
            <Button
              style={colorScheme == "dark" ? darkMode.Button : lightMode.Button}
              onPress={async () => {
                // setRunTime(false);
                try {
            const id = getAuth().currentUser?.uid;
            const docRed = doc(database, "users", id);
            await addDoc(collection(docRed, "trips"), {
              stepCount: currentStepCount,
              minutes: location.timestamp ,
              startStop: time,
              finalStop: finalStop,
              travel: travelingBy,
              loc: userLocHistory,
              selectedRoute: selectedRoute,
              timeframe: hours + ":" + minutes + ":" + seconds,
                        location: {
                          lat: location.coords.latitude || 18.201025,
                          lon: location.coords.longitude || -67.1318,
                        },            });
          } catch (e) {
            console.log(e);
          }
          setConfirm(0);
          reset();
          setStartStop(null);
          setFinalStop(null);
          setSelectedRoute(null);
          setUserLocHistory([])
          setHideSelectRoute(false);
              }}
            > <Text> Continue </Text> </Button>
            </Box>
          ):null
        }

      </VStack>

      <View
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 100,
        }}
      >
        <Button
          onPress={() => {
            // console.log(location);
            _mapView.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }}

          style={{
            zIndex: 100,
            backgroundColor: colorScheme == "dark" ? Colors.secondaryDark : Colors.secondaryLight,
          }}
        >
          <MaterialIcons name="my-location" size={24} color="white" />
        </Button>
      </View>
      {/* Show all buses */}
      
      {/* <View
        style={{
          position: "absolute",
          top: 10,
          right: 80,
          zIndex: 100,
        }}
      >
        <Button
          onPress={() => {
            setRouteSelecter(!routeSelecter);
          }}
          style={{
            zIndex: 100,
            backgroundColor: colorScheme == "dark" ? Colors.secondaryDark : Colors.secondaryLight,
          }}
        >
          <MaterialCommunityIcons name={'traffic-cone'} size={24} color="white" />
        </Button>
      </View> */}

     
      
      {
        selectTraveler ?(
          <View
        style={{
          position: "absolute",
          top: '40%',
          zIndex: 100,
          width: '50%',
          backgroundColor: colorScheme == "dark" ? Colors.primaryDark : Colors.primaryLight,
          borderRadius: 10,
          alignItems: 'flex-start',
        }}
      >
        <Button
          onPress={() => {
            setTravelingBy('walk');
          }}
          style={{
            zIndex: 100,
            backgroundColor: 'transparent',
          }}
        >
        <HStack space={2} alignItems="center" justifyContent="center">
        <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text} >
          Walking
        </Text>
          <MaterialCommunityIcons name="walk" size={24} color="white" />
          </HStack>
        </Button>
        <Button
          onPress={() => {
            setTravelingBy('bus');
          }}
          style={{
            zIndex: 100,
            backgroundColor: 'transparent',
          }}
        >
        <HStack space={2} alignItems="center" justifyContent="center">
        <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text} >
          Bus
        </Text>
          <MaterialCommunityIcons name="bus" size={24} color="white" />
          </HStack>
        </Button>
        <Button
          onPress={() => {
            setTravelingBy('scooter');
          }}
          style={{
            zIndex: 100,
            backgroundColor: 'transparent',
          }}
        >
        <HStack space={2} alignItems="center" justifyContent="center">
        <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text} >
          E-scooter
        </Text>
          <MaterialCommunityIcons name="scooter" size={24} color="white" />
          </HStack>
        </Button>
        <Button
          onPress={() => {
            setTravelingBy('car');
          }}
          style={{
            zIndex: 100,
            backgroundColor: 'transparent',
          }}
        >
        <HStack space={2} alignItems="center" justifyContent="center">
        <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text} >
          Car
        </Text>
          <MaterialCommunityIcons name="car" size={24} color="white" />
          </HStack>
        </Button>
      </View>
        )  : null
      }
      
     
      
    </View>
  );
};

const styles = StyleSheet.create({
  appOptionsContainer: {
    position: "absolute",
    top: 0,
    backgroundColor: "white",
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.7,
    marginVertical: 20,
    padding: 10,
  },
  containerScroll: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  tripContainer: {
    backgroundColor: 'blue',
    borderRadius: 10,
    width: Dimensions.get("window").width * 0.9,
    padding: 10,
    margin: 10,
  },
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },
  stopListTitle: {
    fontSize: 15, //hykj8LmMrfnx
    fontWeight: "bold",
    color: "white",
  },
  stopListDescription: {
    fontSize: 10,
    color: "black",
  },
  stopListContainer: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    width: Dimensions.get("window").width * 0.8,
    maxHeight: Dimensions.get("window").height * 0.2,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  carousel: {
    position: "absolute",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    bottom: "10%",
    left: 0,
    width: "100%",
  },

  scrollView: {
    marginHorizontal: 20,
    paddingTop: 10,
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    width: 300,
    top: Dimensions.get("window").height * 0.5,
    left: Dimensions.get("window").width * 0.1,
  },
  settingBtn: {
    backgroundColor: 'green',
  },
  circleButtonContainer: {
    width: 84,
    height: 84,
    marginHorizontal: 20,
    borderWidth: 4,
    borderColor: "#048444",
    borderRadius: 42,
    padding: 3,
    bottom: 10,
    right: 10,
    position: "absolute",
  },
  circleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 42,
    backgroundColor: "#fff",
  },
});