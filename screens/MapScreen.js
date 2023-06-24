import * as Location from "expo-location";
import * as MapVal from "../assets/map.json";

import { Box, Button, HStack, Icon, Text, VStack } from "native-base";
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
import {
  getStops,
  getStopsByRouteId,
  getStopsByRouteIdSelect,
} from "../assets/gtfs/stops";

import { Pedometer } from "expo-sensors";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { useNavigation } from "@react-navigation/native";
import { useStopwatch } from "react-timer-hook";

const Shapes = require("../assets/gtfs/shapes.json");

export const MapScreen = () => {
  const colorScheme = useColorScheme();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigation = useNavigation();
  const [confirm, setConfirm] = useState(0);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const [showTrip, setShowTrip] = useState(true);
  const [startStop, setStartStop] = useState(null);
  const [finalStop, setFinalStop] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [userLocHistory, setUserLocHistory] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [runTime, setRunTime] = useState(false);

  const memoStop = React.useMemo(() => getStops(), []);

  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });
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
      if (status2 === "granted") {
        console.log("Yay! I have user permission to track data");
      }

      const interval = setInterval(async () => {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
        if (isRunning) {
          setUserLocHistory([...userLocHistory, loc]);
        }
      }, 1000);
      return () => clearInterval(interval);
    })();
  }, [location]);


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
        {memoStop.map((stop, index) => {
          return (
            <Marker
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

          if (showAll) {
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
                    <Text> acc: {device.accuracy}</Text>
                    <Text> kmh: {device.speed}</Text>
                    <Text> bat: {device.altitude}</Text>
                    <Text> bat: {device.attributes.batteryLevel}</Text>
                  </Callout>
                </Marker>
              );
            } else if (isOnline == "offline") {
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
                      borderRadius: 10,
                    }}
                  >
                    <Text>
                      Bus {device.deviceId} - {isOnline}
                    </Text>
                    <Text> acc: {device.accuracy}</Text>
                    <Text> kmh: {device.speed}</Text>
                    <Text> bat: {device.altitude}</Text>
                    <Text> bat: {device.attributes.batteryLevel}</Text>
                  </Callout>
                </Marker>
              );
            }
          } else {
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
                    <Text> acc: {device.accuracy}</Text>
                    <Text> kmh: {device.speed}</Text>
                    <Text> bat: {device.altitude}</Text>
                    <Text> bat: {device.attributes.batteryLevel}</Text>
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
          bottom: "5%",
          left: 0,
          width: "100%",
        }}
      >
        <Box style={colorScheme == "dark" ? darkMode.Card : lightMode.Card}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color:
                colorScheme == "dark"
                  ? darkMode.Text.color
                  : lightMode.Text.color,
            }}
          >
            Selected Route: {selectedRoute}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color:
                colorScheme == "dark"
                  ? darkMode.Text.color
                  : lightMode.Text.color,
            }}
          >
            First Stop: {startStop}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color:
                colorScheme == "dark"
                  ? darkMode.Text.color
                  : lightMode.Text.color,
            }}
          >
            Final Stop: {finalStop}
          </Text>
        </Box>
        {confirm == 0.5 ? (
          <HStack space={2} alignItems="center" justifyContent="center">
            <Button
              onPress={() => {
                if (startStop == null) {
                  setStartStop(selectedStop.id);
                } else if (finalStop == null && startStop != null) {
                  setFinalStop(selectedStop.id);
                  setConfirm(1);
                } 
              }}
            >
              <Text> Confirm </Text>
            </Button>
            <Button
              onPress={() => {
                setStartStop(null);
                setFinalStop(null);
                setConfirm(0);
              }}
            >
              <Text> Cancel </Text>
            </Button>
          </HStack>
        ) : null}
        {
          confirm == 1 ? (
            <VStack space={2} alignItems="center" justifyContent="center">
            <Button
            style={{
              backgroundColor: '#98c1d9',
              borderRadius: 10,
              width: '50%',
              height: 50,
              margin: 5,
            }}
              onPress={() => {
                // setRunTime(true);
                // setStartTime(new Date());
                setConfirm(2);
                start();
              }}
            > <Text >Clear</Text> </Button>
            <Button
            
              onPress={() => {
                // setRunTime(true);
                // setStartTime(new Date());
                setConfirm(2);
                start();
              }}
            > <Text> Start Trip </Text> </Button>
            </VStack>
          ): null
        }

        {
          confirm == 2 ? (
            <Box Box style={colorScheme == "dark" ? darkMode.Card : lightMode.Card}>
          <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
            {minutes}:{seconds}
          </Text>
            
            <Button
             backgroundColor='#98c1d9'
             m={2}
             size='sm'
             
              onPress={() => {
                // setRunTime(false);
                setConfirm(3);
                setStartStop(null);
                setFinalStop(null);
              }}
            > <Text> End Trip </Text> </Button>
            </Box>
          ):null
        }
        {
          confirm == 3 ? (
            <Box Box style={{
              backgroundColor: '#3d5a80',
    width: '90%',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    margin: 5,
            }}>
          <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
            Trip Data
          </Text>
            
            <Button
             style={{
              backgroundColor: '#98c1d9',
              borderRadius: 10,
              padding: 5,
              margin: 5,
            zIndex: 100,
             }}
              onPress={() => {
                // setRunTime(false);
                setConfirm(0);
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
            _mapView.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }}
          style={{
            backgroundColor: Colors.highlihgted,
          }}
        >
          <MaterialIcons name="my-location" size={24} color="white" />
        </Button>
      </View>
      {/* Show all buses */}
      <View
        style={{
          position: "absolute",
          top: 10,
          right: 70,
          zIndex: 100,
        }}
      >
        <Button
          onPress={() => {
            setShowAll(!showAll);
          }}
          style={{
            backgroundColor: Colors.highlihgted,
          }}
        >
          <MaterialCommunityIcons name="bus" size={24} color="white" />
        </Button>
      </View>
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
    backgroundColor: Colors.highlihgted,
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
