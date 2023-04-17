import * as Location from "expo-location";

import {
  Button,
  Center,
  CheckIcon,
  FormControl,
  HStack,
  Select,
  Text,
  WarningIcon,
  WarningOutlineIcon,
} from "native-base";
import { Dimensions, Image, StatusBar, StyleSheet, View } from "react-native";
import MapView, { Callout, Marker, Polyline } from "react-native-maps";
import React, { useEffect, useMemo, useState } from "react";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { getOnlineById, getPosition } from "../components/URLFetcher";
import { getRouteColor, getRoutes } from "../assets/gtfs/route";
import { getStops, getStopsByRouteId } from "../assets/gtfs/stops";

import { Colors } from "../config";
import { Pedometer } from 'expo-sensors';
import {StopRenderMinimal} from "../components/OBAFetches/StopRenderMinimal";
import {database} from "../config/firebase";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useStopwatch } from 'react-timer-hook';

const Shapes = require("../assets/gtfs/shapes.json");

 


export const MapScreen = () => {

  
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigation = useNavigation();
  const [onlyShowOnline, setOnlyShowOnline] = useState(true);
  const [showTripModal, setShowTripModal] = useState(false);
  const [startStop, setStartStop] = useState(null);
  const [finalStop, setFinalStop] = useState(null);
  const [selectedStop, setSelectedStop] = useState([]);
   let endStop = 0
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const [count, setCount] = useState(0);
  const [showTrip, setShowTrip] = useState(true);
  const [showBus, setShowBus] = useState(false);
  const [stopsel, setStopSel] = useState(false);
  const [userLocHistory, setUserLocHistory] = useState([]);

  const [startTime, setStartTime] = useState(0);
  const [timeT, setTimeT] = useState(0);
  const [endTime, setEndTime] = useState(0);
 

  function MyTimer() {
    const {
      seconds,
      minutes,
      hours,
      days,
      isRunning,
      start,
      pause,
      reset,
    } = useStopwatch({ autoStart: true });
  
     return (
      <View style={{textAlign: 'center'}}>
        <View style={{fontSize: '100px'}}>
        <Text>
       {days}:{hours}:{minutes}:{seconds}
        </Text>
        </View>
      </View>
    );
  }

  

  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const interval = setInterval(async () => {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
        if (setShowTrip == false) {
            setUserLocHistory([...userLocHistory, loc]);
        }
       }, 5000);
      return () => clearInterval(interval);
      
    })();
 
  }, []);


  
  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
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

  return (
    <View style={styles.container}>
      <MapView
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
        {getPosition().map((device, index) => {
          const isOnline = getOnlineById(device.deviceId);
          if (onlyShowOnline && isOnline == "online") {
            return (
              <Marker


tracksViewChanges={true}
                key={index}
                coordinate={{
                  latitude: device.latitude,
                  longitude: device.longitude,
                }}
                title={device.deviceId}
                description={device.deviceId}
                pinColor={"green"}
              >
                <Image
                  source={require("../assets/car-online.png")}
                  style={{ height: 35, width: 35 }}
                />
                <Callout
                  style={{
                    width: 200,
                  }}
                >
                  <Text>
                    Bus {device.deviceId} - {isOnline}
                  </Text>
                  <Text> {device.accuracy}</Text>
                 
                      <Button
                        onPress={() => {
                          setShowTrip(false);
                          setShowBus(true)
                        }}
                      >
                        <Text>Follow Bus</Text>
                      </Button>
                 
                </Callout>
              </Marker>
            );
          } else if (!onlyShowOnline) {
            if (isOnline == "online") {
              return (
                <Marker
tracksViewChanges={true}

                  key={index}
                  coordinate={{
                    latitude: device.latitude,
                    longitude: device.longitude,
                  }}
                  title={device.deviceId}
                  description={device.deviceId}
                  pinColor={"green"}
                >
                  <Image
                    source={require("../assets/car-online.png")}
                    style={{ height: 35, width: 35 }}
                  />
                  <Callout
                    style={{
                      width: 200,
                    }}
                  >
                    <Text>
                      Bus {device.deviceId} - {isOnline}
                    </Text>
                    <Text> {device.accuracy}</Text>
                    <Button
                        onPress={() => {
                          setShowTrip(false);
                          setShowBus(true)
                        }}
                      >
                        <Text>Follow Bus</Text>
                      </Button>
                 
                  </Callout>
                </Marker>
              );
            } else {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: device.latitude,
                    longitude: device.longitude,
                  }}
                  title={device.deviceId}
                  description={device.deviceId}
                  pinColor={"red"}
                >
                  <Image
                    source={require("../assets/car-default.png")}
                    style={{ height: 35, width: 35 }}
                  />
                  <Callout
                    style={{
                      width: 200,
                    }}
                  >
                    <Text>
                      Bus {device.deviceId} - {isOnline}
                    </Text>
                    <Text> {device.accuracy}</Text>
                  </Callout>
                </Marker>
              );
            }
          }
        })}

        {getStops().map((stop, index) => {
          if (showAll == true) {
            return (
              <Marker
                key={index}
                tracksViewChanges={true}
                // TODO find an identifier for fist and final stops
                // image={require("../assets/firstStop.png")}
                coordinate={{
                  latitude: stop.lat,
                  longitude: stop.lon,
                }}
                title={stop.id}
                description={stop.name}
                pinColor={getRouteColor(stop.id)}
                onPress={() => {
                  setSelectedStop(stop.id);
                  
                }}
                onLongPress={() => {
                  const substring = stop.id.substring(4, 6);
                  console.log(substring);
                  // setSelectedRoute(substring);
                }}
              >
                <Callout  >
                  <Text>{stop.name}</Text>
                  <Text>{stop.id}</Text>
              
                </Callout>
              </Marker>
            );
          } else if ( showAll!= true &&  stop.id.includes(selectedRoute)) {
            return (
              <Marker
tracksViewChanges={true}

                key={index}
                coordinate={{
                  latitude: stop.lat,
                  longitude: stop.lon,
                }}
                title={stop.id}
                description={stop.name}
                pinColor={getRouteColor(stop.id)}
                onPress={() => {
                  setSelectedStop(stop);
                 
                }}
              >
                <Callout>
                  <Text>{stop.name}</Text>
                  <Text>{stop.id}</Text>
                  
                </Callout>
              </Marker>
            );
          }
        })}

        {getPosition().map((device, index) => {
          const isOnline = getOnlineById(device.deviceId);
          if (onlyShowOnline && isOnline == "online") {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: device.latitude,
                  longitude: device.longitude,
                }}
                title={device.deviceId}
                description={device.deviceId}
                pinColor={"green"}
              >
                <Image
                  source={require("../assets/car-online.png")}
                  style={{ height: 35, width: 35 }}
                />
                <Callout
                  style={{
                    width: 200,
                  }}
                >
                  <Text>
                    Bus {device.deviceId} - {isOnline}
                  </Text>
                  <Text> {device.accuracy}</Text>
                </Callout>
              </Marker>
            );
          } else if (!onlyShowOnline) {
            if (isOnline == "online") {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: device.latitude,
                    longitude: device.longitude,
                  }}
                  title={device.deviceId}
                  description={device.deviceId}
                  pinColor={"green"}
                >
                  <Image
                    source={require("../assets/car-default.png")}
                    style={{ height: 35, width: 35 }}
                  />
                  <Callout
                    style={{
                      width: 200,
                    }}
                  >
                    <Text>
                      Bus {device.deviceId} - {isOnline}
                    </Text>
                    <Text> {device.accuracy}</Text>
                  </Callout>
                </Marker>
              );
            } else {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: device.latitude,
                    longitude: device.longitude,
                  }}
                  title={device.deviceId}
                  description={device.deviceId}
                  pinColor={"green"}
                >
                  <Image
                    source={require("../assets/car-default.png")}
                    style={{ height: 35, width: 35 }}
                  />
                  <Callout
                    style={{
                      width: 200,
                    }}
                  >
                    <Text>
                      Bus {device.deviceId} - {isOnline}
                    </Text>
                    <Text> {device.accuracy}</Text>
                  </Callout>
                </Marker>
              );
            }
          }
        })}

        {getRoutes().map((route, index) => {
          return (
            <Polyline
              key={index}
              coordinates={getShapeByRouteId(route.id)}
              strokeColor={getRouteColor(route.id)}
              strokeWidth={3}
            />
          );
        })}
      </MapView>

      <View style={styles.carousel}>
        <HStack space={4}>
          {onlyShowOnline ? (
            <Button onPress={() => setOnlyShowOnline(false)}
              style={styles.settingBtn}
            >
              Show offline
            </Button>
          ) : (
            <Button               style={styles.settingBtn}
 onPress={() => setOnlyShowOnline(true)}>Show online</Button>
          )}
          <Button
              style={styles.settingBtn}
            onPress={() => {
              return _mapView.animateToRegion(
                {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.0322,
                  longitudeDelta: 0.0321,
                },
                1000
              );
            }}
          >
            🧭
          </Button>
        </HStack>

        {/*  TICKET */}
        <View style={styles.tripContainer}>

        {
          stopsel ? (     
        <>
        <Text style={styles.stopListTitle}>Ticket</Text>
        <Text>Route: {selectedRoute}</Text>
        <MyTimer  />
       
        <HStack
        >

        <Text>First Stop: <StopRenderMinimal stop={"TIM_"+startStop} /></Text>
        </HStack>
        <HStack>
        <Text>Final Stop: <StopRenderMinimal stop={"TIM_"+finalStop} /></Text>
        </HStack>
        <HStack>
        <Button
        
        onPress={async () => {
          setShowTrip(true);
               try {
    const id = getAuth().currentUser.uid;
    const docRef = doc(database, "users", id);
    await addDoc(collection(docRef, "trips"), {
        route: selectedRoute,
              startStop: startStop,
              finalStop: finalStop,
              startTime: startTime,
              stopTime: new Date().getTime(),
              location: {lat: location.coords.latitude, lon: location.coords.longitude}
              });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
          
        }}
        
        >
          End Trip
        </Button>
        </HStack>
        </>
      ) : null
        }
        {
          showTrip? (
            <>
          <Text style={styles.stopListTitle}>Trip Ticket</Text>
          <Center>
            <FormControl isRequired>
              <FormControl.Label>Choose a route</FormControl.Label>

              <Select
                placeholder="Select a route"
                selectedValue={selectedRoute}
                minWidth={200}
                accessibilityLabel="Select a route"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size={5} />,
                }}
                mt="1"
                onValueChange={(itemValue) => {
                  setSelectedRoute(itemValue);
                  setStartStop(null);
                  setSelectedStop(null);
                  setShowAll(false);
                }}
              >
                {getRoutes().map((route, index) => {
                  return (
                    <Select.Item
                      key={index}
                      label={route.id}
                      value={route.id}
                      onPress={() => {
                        setSelectedRoute(route.id);
                        setShowAll(false);

                        _mapView.animateToRegion(
                          {
                            latitude: route.lat,
                            longitude: route.lon,
                            latitudeDelta: route.latD,
                            longitudeDelta: route.lonD,
                          },
                          1000
                        );
                      }}
                    />
                  );
                })}
              </Select>
            </FormControl>

            {selectedRoute != null ? (
              <FormControl isRequired>
                <FormControl.Label>Choose first stop</FormControl.Label>

                <Select
                  placeholder="Select first stop"
                  selectedValue={startStop}
                  minWidth={200}
                  accessibilityLabel="Select first stop"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt="1"
                  onValueChange={(itemValue) => {
                    setStartStop(itemValue);
                    setSelectedStop(itemValue);
                  }}
                >
                  {getStopsByRouteId(selectedRoute).map((stop, index) => {
                    return (
                      <Select.Item
                        key={index}
                        label={stop.id}
                        value={stop.id}
                        onPress={() => {
                          setStartStop(stop.id);
                          setSelectedStop(stop.id);
                          _mapView.animateToRegion(
                            {
                              latitude: stop.lat,
                              longitude: stop.lon,
                              latitudeDelta: "0.0202",
                              longitudeDelta: "0.0202",
                            },
                            1000
                          );
                        }}
                      />

                    );
                  })}
                </Select>
              </FormControl>
            ) : null}

           {
              startStop != null ? (
              <FormControl isRequired>
                <FormControl.Label>Choose final stop</FormControl.Label>

                <Select
                  placeholder="Select final stop"
                  selectedValue={finalStop}
                  minWidth={200}
                  accessibilityLabel="Select final stop"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt="1"
                  onValueChange={(itemValue) => {
                    setFinalStop(itemValue);
                    setSelectedStop(itemValue);
                  }}
                >
                  {getStopsByRouteId(selectedRoute).map((stop, index) => {
                    return (
                      <Select.Item
                        key={index}
                        label={stop.id}
                        value={stop.id}
                        onPress={() => {
                          setFinalStop(stop.id);
                          setSelectedStop(stop.id);
                          setShowAll(true);
                          _mapView.animateToRegion(
                            {
                              latitude: stop.lat,
                              longitude: stop.lon,
                              latitudeDelta: "0.0202",
                              longitudeDelta: "0.0202",
                            },
                            1000
                          );
                        }}
                      />
                    );
                  })}
                </Select>
                <Button 
                  style={{marginTop: 10}}
                    onPress={() => {
                      setShowTrip(false);
                      setShowAll(true);
                      setStartTime(new Date().getTime());
                    }}

                    
                >
                  Start Trip
                </Button>
              </FormControl>
              ):null
           }
          </Center>
        </>
          ):null
        }
        {
          showBus ? (
            <Text>Bus</Text>
          ) : null
        }
        
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerScroll: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  tripContainer: {
    backgroundColor: "white",
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
    color: "black",
  },
  stopListDescription: {
    fontSize: 10,
    color: "black",
  },
  stopListContainer: {
    padding: 10,
    borderRadius: 10,
    width: Dimensions.get("window").width * 0.8,
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
    bottom: 15,
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
  }, settingBtn:{
    backgroundColor: Colors.highlihgted
  }
});
