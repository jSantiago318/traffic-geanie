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
  Text,
  WarningIcon,
  WarningOutlineIcon,
} from "native-base";
import { Colors, darkMode, lightMode } from "../config";
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

import { Pedometer } from "expo-sensors";
import { StopRenderMinimal } from "../components/OBAFetches/StopRenderMinimal";
import { database } from "../config/firebase";
import { getAuth } from "firebase/auth";
import { render } from "react-dom";
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
        // minZoomLevel={25}
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
      <View style={styles.carousel}>
        <HStack space={4}>
          {onlyShowOnline ? (
            <Button
              onPress={() => setOnlyShowOnline(false)}
              style={styles.settingBtn}
            >
              <MaterialCommunityIcons
                name="bus-alert"
                size={24}
                color="black"
              />
            </Button>
          ) : (
            <Button
              style={styles.settingBtn}
              onPress={() => setOnlyShowOnline(true)}
            >
              <MaterialCommunityIcons
                name="bus-alert"
                size={24}
                color="green"
              />
            </Button>
          )}
          <Button
            style={styles.settingBtn}
            onPress={() => {
              if (location.coords != null) {
                return _mapView.animateToRegion(
                  {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0122,
                    longitudeDelta: 0.0121,
                  },
                  500
                );
              }
            }}
          >
            <MaterialIcons name="my-location" size={24} color="black" />
          </Button>
        </HStack>

        {/*  TICKET */}

        {showTrip == false ? (
          <View style={ 
            colorScheme === "dark" ? darkMode.CarouselView : lightMode.CarouselView
          }>
            <Text style={ 
            colorScheme === "dark" ? darkMode.Text : lightMode.Text
          }>Ticket</Text>
            <Text style={ 
            colorScheme === "dark" ? darkMode.Text : lightMode.Text
          }>Route: {selectedRoute}</Text>
            <Timer  isStart={true} />

            <HStack>
              <Text style={ 
            colorScheme === "dark" ? darkMode.Text : lightMode.Text
          } >
                Parada 1: <StopRenderMinimal stop={"TIM_" + startStop} />
              </Text>
            </HStack>
            <HStack>
              <Text style={ 
            colorScheme === "dark" ? darkMode.Text : lightMode.Text
          } >
                Parada 2: <StopRenderMinimal stop={"TIM_" + finalStop} />
              </Text>
            </HStack>
            <HStack>
              <Button
                onPress={async () => {
                  if (
                    selectedRoute == null ||
                    startStop == null ||
                    finalStop == null
                  ) {
                    setShowTrip(true);
                    pause();
                    reset();
                    setRunTime(false);
                  } else {
                    try {
                      const id = getAuth().currentUser.uid;
                      const docRef = doc(database, "users", id);
                      await addDoc(collection(docRef, "trips"), {
                        route: selectedRoute,
                        startStop: startStop,
                        finalStop: finalStop,
                        startTime: startTime,
                        stopTime: new Date().getTime(),
                        timeframe: hours + ":" + minutes + ":" + seconds,
                        location: {
                          lat: location.coords.latitude,
                          lon: location.coords.longitude,
                        },
                      });

                      setShowTrip(true);
                      pause();
                      reset();
                      setRunTime(false);
                      
                    } catch (e) {
                      console.error("Error adding document: ", e);
                    }
                  }
                }}
              >
                End Trip
              </Button>
            </HStack>
          </View>
        ) : null}
        {showTrip ? (
          <View
            style={
              colorScheme == "dark"
                ? darkMode.CarouselView
                : lightMode.CarouselView
            }
          >
            <HStack justifyContent={"space-between"}>
              <Text
                style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}
              >
                Trip
              </Text>
              <Button
                style={
                  colorScheme == "dark"
                    ? darkMode.subtleBtn
                    : lightMode.subtleBtn
                }
                onPress={() => {
                  setSelectedRoute(null);
                  setStartStop(null);
                  setFinalStop(null);
                  setShowTrip(false);
                }}
              >
                Close Ticket
              </Button>
            </HStack>
            <Button
              onPress={() => {
                setShowModal(true);
              }}
            >
              <Text>Pick Route</Text>
            </Button>
            <Center>
              <Modal
                style={colorScheme == "dark" ? darkMode.TicketView : lightMode.TicketView}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
              >
                <Modal.Content maxWidth="80%">
                  <Modal.CloseButton />
                  <Modal.Header>Start Ticket 🎫</Modal.Header>
                  <Modal.Body>
                    <Text
                      style={
                        colorScheme == "dark" ? darkMode.Text : lightMode.Text
                      }
                    >
                      Select Route
                    </Text>
                    <ScrollView>
                      <FlatList
                        data={getRoutes()}
                        keyExtractor={(item, index) =>
                          item.id + index.toString()
                        }
                        horizontal={true}
                        renderItem={({ item }) => {
                          return (
                            <Button
                              onPress={() => {
                                setSelectedRoute(item.id);
                              }}
                              style={
                                colorScheme == "dark"
                                  ? darkMode.horizontalBtn
                                  : lightMode.horizontalBtn
                              }
                            >
                            <HStack space={2}>
                            {
                              selectedRoute == item.id ? (<MaterialCommunityIcons name="bus-stop" size={24} color="black" />):null
                            }
                              <Text
                                style={
                                  colorScheme == "dark"
                                    ? darkMode.Text
                                    : lightMode.Text
                                }
                              >
                                {item.name}
                              </Text>
                              </HStack>
                            </Button>
                          );
                        }}
                      />
                    </ScrollView>
                    {
                      selectedRoute != null ? (
                        <ScrollView>
                        <Text style={
                          colorScheme == "dark" ? darkMode.Text : lightMode.Text
                        }>
                          Select First Stop
                        </Text>
                      <FlatList
                        data={getStopsByRouteId(selectedRoute)}
                        keyExtractor={(item, index) =>
                          item.id + index.toString()
                        }
                        horizontal={true}
                        renderItem={({ item }) => {
                          return (
                            <Button
                              onPress={() => {
                                setStartStop(item.id);
                              }}
                              style={
                                colorScheme == "dark"
                                  ? darkMode.horizontalBtn
                                  : lightMode.horizontalBtn
                              }
                            >
                            <HStack space={2}>
                            {
                              startStop == item.id ? (<MaterialCommunityIcons name="bus-stop" size={24} color="black" />):null
                            }
                              <Text
                                style={
                                  colorScheme == "dark"
                                    ? darkMode.Text
                                    : lightMode.Text
                                }
                              >
                                {item.name}
                              </Text>
                              </HStack>
                            </Button>
                          );
                        }}
                      />
                    </ScrollView>
                      ) : (
                        <Text>
                          Select a route to continue
                        </Text>
                      )
                    }
                    {
                      startStop != null ? (
                        <ScrollView>
                        <Text style={
                          colorScheme == "dark" ? darkMode.Text : lightMode.Text
                        }>
                          Select Final Stop
                        </Text>
                      <FlatList
                        data={getStopsByRouteId(selectedRoute)} //TODO optimize change this to a useState variable
                        keyExtractor={(item, index) =>
                          item.id + index.toString()
                        }
                        horizontal={true}
                        renderItem={({ item }) => {
                          return (
                            <Button
                              onPress={() => {
                                setFinalStop(item.id);
                              }}
                              style={
                                colorScheme == "dark"
                                  ? darkMode.horizontalBtn
                                  : lightMode.horizontalBtn
                              }
                            >
                             <HStack space={2}>
                            {
                              finalStop == item.id ? (<MaterialCommunityIcons name="bus-stop" size={24} color="black" />):null
                            }
                              <Text
                                style={
                                  colorScheme == "dark"
                                    ? darkMode.Text
                                    : lightMode.Text
                                }
                              >
                                {item.name}
                              </Text>
                              </HStack>
                              
                            </Button>
                          );
                        }}
                      />
                    </ScrollView>
                      ) : (
                        null
                      )
                    }
                    
                  </Modal.Body>
                  <Modal.Footer>
                    <Button.Group space={2}>
                      <Button
                        variant="ghost"
                        colorScheme="blueGray"
                        onPress={() => {
                          setShowModal(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onPress={() => {
                          setShowModal(false);
                          const item = new Date().getTime();
                          setRunTime(true);
                          setStartTime(item)
                          setShowTrip(false);
                          setShowAll(false);
                          start();
                        }}
                      >
                        Start Trip
                      </Button>
                    </Button.Group>
                  </Modal.Footer>
                </Modal.Content>
              </Modal>
            </Center>
          </View>
        ) : null}
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
});
