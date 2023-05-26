import * as Location from "expo-location";
import * as MapVal from "../assets/map.json";

import {
  Box,
  Button,
  Center,
  CheckIcon,
  FlatList,
  FormControl,
  HStack,
  Icon,
  Input,
  Modal,
  ScrollView,
  Select,
  Switch,
  Text,
  WarningIcon,
  WarningOutlineIcon,
} from "native-base";
import { Colors, darkMode, lightMode } from "../config";
import {
  Dimensions,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import MapView, {
  Callout,
  Marker,
  OverlayComponent,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { setTimeout, useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { getOnlineById, getPosition } from "../components/URLFetcher";
import { getRouteColor, getRoutes } from "../assets/gtfs/route";
import { getStops, getStopsByRouteId } from "../assets/gtfs/stops";

import { AntDesign } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import { Pedometer } from "expo-sensors";
import { StopRenderMinimal } from "../components/OBAFetches/StopRenderMinimal";
import { database } from "../config/firebase";
import { getAuth } from "firebase/auth";
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { useNavigation } from "@react-navigation/native";
import { useStopwatch } from "react-timer-hook";

const Shapes = require("../assets/gtfs/shapes.json");

export const MapScreen = () => {
  const colorScheme = useColorScheme();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigation = useNavigation();
  const [onlyShowOnline, setOnlyShowOnline] = useState(true);
  const [startStop, setStartStop] = useState(null);
  const [finalStop, setFinalStop] = useState(null);
  const [selectedStop, setSelectedStop] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const [showTrip, setShowTrip] = useState(true);
  const [userLocHistory, setUserLocHistory] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [runTime, setRunTime] = useState(false);
  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
          
      });
      setLocation(location);
      const { status2 } = await requestTrackingPermissionsAsync();
      if (status2 === 'granted') {
        console.log('Yay! I have user permission to track data');
      }

      const interval = setInterval(async () => {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
        if (setShowTrip == false) {
          setUserLocHistory([...userLocHistory, loc]);
        }
      }, 2000);
      return () => clearInterval(interval);
    })();
  }, [location]);

  const Timer = () => {
    if (runTime == true || isRunning == true) {
      return (
        <View>
          <Text 
          style={colorScheme=='dark'?darkMode.Text:lightMode.Text}
          >
            {minutes}:{seconds}
          </Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text 
          style={colorScheme=='dark'?darkMode.Text:lightMode.Text}
          >
            {minutes}:{seconds}
          </Text>
        </View>
      );
    }
  };
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

    const [showAppOptions, setShowAppOptions] = useState(false);

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
              >
                <Image
                  source={require("../assets/car-online.png")}
                  style={{ height: 40, width: 40, zIndex: 1000 }}
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
                >
                  <Image
                    source={require("../assets/car-online.png")}
                    style={{ height: 40, width: 40 }}
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
                >
                  <Image
                    source={require("../assets/car-default.png")}
                    style={{ height: 40, width: 40 }}
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
                coordinate={{
                  latitude: stop.lat,
                  longitude: stop.lon,
                }}
              
                pinColor={getRouteColor(stop.id)}
                onPress={() => {
                  setSelectedStop(stop.id);
                }}
              >
                <Image
                  source={require("../assets/BusStop.png")}
                  style={{ height: 35, width: 35 }}
                />
                <Callout style={{
                    width: 200,
                  }}>
                  <Text>{stop.name}</Text>
                  <Text>{stop.id}</Text>
                </Callout>
              </Marker>
            );
          } else if (showAll != true && stop.id.includes(startStop)) {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: stop.lat,
                  longitude: stop.lon,
                }}
                 pinColor={getRouteColor(stop.id)}
                onPress={() => {
                  setSelectedStop(stop);
                }}
              >
              <Image
                  source={require("../assets/busStop1.png")}
                  style={{ height: 45, width: 45 }}
                />
                <Callout style={{
                    width: 200,
                  }}>
                  <Text>{stop.name}</Text>
                  <Text>{stop.id}</Text>
                </Callout>
              </Marker>
            );
          } else if (showAll != true && stop.id.includes(finalStop)) {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: stop.lat,
                  longitude: stop.lon,
                }}
                 pinColor={getRouteColor(stop.id)}
                onPress={() => {
                  setSelectedStop(stop);
                }}
              >
              <Image
                  source={require("../assets/busStop2.png")}
                  style={{ height: 45, width: 45 }}
                />
                <Callout style={{
                    width: 200,
                  }}>
                  <Text>{stop.name}</Text>
                  <Text>{stop.id}</Text>
                </Callout>
              </Marker>
            );
          }
          else if (showAll != true && stop.id.includes(selectedRoute)) {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: stop.lat,
                  longitude: stop.lon,
                }}
                 pinColor={getRouteColor(stop.id)}
                onPress={() => {
                  setSelectedStop(stop);
                }}
              >
              <Image
                  source={require("../assets/BusStop.png")}
                  style={{ height: 35, width: 35 }}
                />
                <Callout style={{
                    width: 200,
                  }}>
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
              >
                <Image
                  source={require("../assets/car-online.png")}
                  style={{ height: 40, width: 40 }}
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
                  <Text> {device.speed}</Text>
                  <Text> {device.attributes.battery}</Text>
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
                >
                  <Image
                    source={require("../assets/car-default.png")}
                    style={{ height: 40, width: 40 }}
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
                >
                  <Image
                    source={require("../assets/car-default.png")}
                    style={{ height: 40, width: 40 }}
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
      {
        showAppOptions ?
      (  <View style={styles.appOptionsContainer}>
        <Text style={styles.appOptionsTitle}>Map Options</Text>

          {/* <Pressable style={styles.appOption} onPress={
            () => {
              setShowAll(!showAll);
            }
          }>
            <Text style={styles.appOptionText}>Show All Stops</Text>
          </Pressable> */}
          <Text style={styles.appOptionText}>Show Only Online Buses</Text>
            <HStack space={2} marginY={2} alignItems="center">
            <Switch
              trackColor={{ false: "#767577", true: "#048444" }}
              thumbColor={showAll ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setEnable(!showAll);
              }
              }
              value={showAll}
            />
            <Text >Ruta 105</Text>
            </HStack>
            <HStack space={2} alignItems="center">
            <Switch
              trackColor={{ false: "#767577", true: "#048444" }}
              thumbColor={showAll ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setEnable(!showAll);
              }
              }
              value={showAll}
            />
            <Text >Ruta 105</Text>
            </HStack>
            <HStack space={2} alignItems="center">
            <Switch
              trackColor={{ false: "#767577", true: "#048444" }}
              thumbColor={showAll ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setEnable(!showAll);
              }
              }
              value={showAll}
            />
            <Text >Ruta 105</Text>
            </HStack>
            <HStack space={2} alignItems="center">
            <Switch
              trackColor={{ false: "#767577", true: "#048444" }}
              thumbColor={showAll ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setEnable(!showAll);
              }
              }
              value={showAll}
            />
            <Text >Ruta 105</Text>
            </HStack>
            <HStack space={2} alignItems="center">
            <Switch
              trackColor={{ false: "#767577", true: "#048444" }}
              thumbColor={showAll ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setEnable(!showAll);
              }
              }
              value={showAll}
            />
            <Text >Ruta 105</Text>
            </HStack>
        </ View>) :
        (
          null
        )
      }
      <View style={styles.circleButtonContainer}>
      <Pressable style={styles.circleButton} onPress={
        () => {
          setShowAppOptions(!showAppOptions);
        }
      }
      onClick={
        () => {
          setShowAppOptions(!showAppOptions);
        }
      }
      >
      {
        showAppOptions ?(
          <MaterialIcons name="close" size={38} color="#25292e" />
        ) :
        (
          <MaterialIcons name="commute" size={38} color="#25292e" />
        )
      }
      </Pressable>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appOptionsContainer:{
    position: 'absolute',
    top: 0,
    backgroundColor: 'white',
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.3,
    marginVertical: 20,
    padding: 10,
  },
  containerScroll: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  tripContainer: {
    backgroundColor: Colors.ticketBackground,
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
    backgroundColor: Colors.highlihgted,
  },
  circleButtonContainer: {
    width: 84,
    height: 84,
    marginHorizontal: 20,
    borderWidth: 4,
    borderColor: '#048444',
    borderRadius: 42,
    padding: 3,
    bottom: 10,
    right: 10,
    position: 'absolute',
  },
  circleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
    backgroundColor: '#fff',
  },
});
 