import * as Location from "expo-location";
import * as MapVal from "../assets/map.json";
import * as TaskManager from 'expo-task-manager';

import {
  Alert,
  AlertDialog,
  Box,
  Button,
  FlatList,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
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
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { getOnlineById, getPosition } from "../components/URLFetcher";
import { getRouteColor, getRoutes } from "../assets/gtfs/route";
import { getStopById, getStopByIdOnline, getStops } from "../assets/gtfs/stops";

import { Pedometer } from "expo-sensors";
import { useNavigation } from "@react-navigation/native";
import { useStopwatch } from "react-timer-hook";

const Shapes = require("../assets/gtfs/shapes.json");
export const MapScreen = () => {
  const colorScheme = useColorScheme();
  const [location, setLocation] = useState(null);
  const routeStops = useState();
  const navigation = useNavigation();
  const [selectDestination, setSelectDestination] = useState(false);
  const [confirm, setConfirm] = useState(0);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [confirmSelect, setConfirmSelect] = useState(false);
  const [showStopModal, setShowStopModal] = useState(true);
  const [startStop, setStartStop] = useState(null);
  const [startStopName, setStartStopName] = useState(null);
  const [finalStop, setFinalStop] = useState(null);
  const [finalStopName, setFinalStopName] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [selectedStopName, setSelectedStopName] = useState(null);
  const [runTime, setRunTime] = useState(false);
  const [stp, setStp] = useState([]);
  const [stp1, setStp1] = useState([]);
  const [selectTraveler, setSelectTraveler] = useState(true);
  const memoStop = React.useMemo(() => getStops(), []);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [travelingBy, setTravelingBy] = useState("walk");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [backLoc, setBackLoc] = useState([]);
  const [markers, setMarkers] = useState(null);
  const [nobusDestination, setNoBusDestination] = useState(false);
  const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let loc = await Location.getCurrentPositionAsync({
        enableHistory: true,
        enableHighAccuracy: true,
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 3000,
      });
      setLocation(loc);
      if (runTime) {
        console.log(
        backLoc
        );
        setBackLoc([
          ...backLoc,
          {
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
          },
        ]);
      }
    })();
  }, [location]);
  

  // 1 define the task passing its name and a callback that will be called whenever the location changes
TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data: { locations }, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  const [location] = locations;
  try {
    const url = `https://<your-api-endpoint>`;
    await axios.post(url, { location }); // you should use post instead of get to persist data on the backend
  } catch (err) {
    console.error(err);
  }
});

// 2 start the task
Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
  accuracy: Location.Accuracy.Highest,
  distanceInterval: 1, // minimum change (in meters) betweens updates
  deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
  // foregroundService is how you get the task to be updated as often as would be if the app was open
  foregroundService: {
    notificationTitle: 'Using your location',
    notificationBody: 'To turn off, go back to the app and switch something off.',
  },
});

// 3 when you're done, stop it
Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
  if (value) {
    Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
  }
});


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

      return Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps);
      });
    }
  };

  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });

  const [tripTime, setTripTime] = useState(0);
  const memo = useMemo(() => getTime(tripTime), [tripTime]);
  async function getTime(url) {
    if (runTime) {
      if (seconds < 10) {
        const tm = minutes + ":0" + seconds;
        setTripTime(tm);
        return tm;
      } else {
        const tm = minutes + ":" + seconds;
        setTripTime(tm);
        return tm;
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

  let currentUserTrip = backLoc || [];
  const MemoTrip = React.useMemo(() => {
    if (currentUserTrip.length > 0 && (confirm == 2 || confirm == 4)) {
      currentUserTrip.map((loc) => {
        return (
          <Marker
            color="red"
            coordinate={{
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
            }}
          />
        );
      });
    }
  }, [currentUserTrip]);

  var _mapView;

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
        onPress={(e) => setMarkers(e.nativeEvent.coordinate)}
      >
   {markers!=null?
        <Marker
          draggable
          coordinate={markers}
          onPress={()=>
            console.log(markers)}
        />:null}
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
                } else {
                  setSelectedRoute(stop.id);}
                setSelectedStop(stop.id);
                setSelectedStopName(stop.name);
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
                  <Text> acc: {device.accuracy}</Text>
                </Callout>
              </Marker>
            );
          }
        })}
        {/* <Polyline
            coordinates={backLoc}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={ ['#2EB62C',
'#57C84D',
'#83D475',
'#ABE098',
'#D7F0C0']}
            strokeWidth={6}
        /> */}
        {backLoc.length > 0 ? (
          <Polyline
            coordinates={backLoc}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={["#2EB62C", "#57C84D", "#83D475", "#ABE098"]}
            strokeWidth={6}
          />
        ) : null}

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
          padding: 10,
          left: 0,
          width: "100%",
        }}
      >
        {/* selected stop info */}
        {travelingBy == "bus" ? (
          <HStack
            style={{
              backgroundColor:
                colorScheme == "dark"
                  ? darkMode.Card.backgroundColor
                  : lightMode.Card.backgroundColor,
              borderRadius: 10,
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
              margin: 5,
            }}
          >
            <Stack space={0} marginRight={3}>
              {startStop == null || finalStop == null ? (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    padding: 0,
                    margin: 0,
                    color:
                      colorScheme == "dark"
                        ? darkMode.Text.color
                        : lightMode.Text.color,
                  }}
                >
                  Choose stop for trip
                </Text>
              ) : null}
              {selectedStopName ? (
                <Text
                  style={
                    colorScheme == "dark" ? darkMode.Title : lightMode.Title
                  }
                >
                  {selectedStopName}
                </Text>
              ) : null}
            </Stack>
            <Button
              style={{
                backgroundColor: "#1DA15D",
                marginRight: 5,
                marginLeft: 5,
                padding: 0,
              }}
              onPress={() => {
                if (startStop == null) {
                  setStartStop(selectedStop);
                  setStartStopName(selectedStopName);
                } else if (finalStop == null) {
                  setFinalStop(selectedStop);
                  setFinalStopName(selectedStopName);
                }
              }}
            >
              <MaterialCommunityIcons
                name="check"
                size={18}
                color={
                  colorScheme == "dark"
                    ? darkMode.Button.backgroundColor
                    : lightMode.Button.backgroundColor
                }
              />
            </Button>
            <Button
              onPress={() => {
                if (
                  selectedStop == startStop &&
                  selectedStopName == startStopName
                ) {
                  setStartStop(null);
                  setStartStopName(null);
                }

                if (
                  selectedStop == finalStop &&
                  selectedStopName == finalStopName
                ) {
                  setFinalStop(null);
                  setFinalStopName(null);
                }
              }}
              style={{
                backgroundColor: "#D93729",
                marginLeft: 5,
                marginRight: 5,
                padding: 0,
              }}
            >
              <MaterialCommunityIcons
                name="cancel"
                size={18}
                color={
                  colorScheme == "dark"
                    ? darkMode.Button.backgroundColor
                    : lightMode.Button.backgroundColor
                }
              />
            </Button>
          </HStack>
        ) : null}
        {travelingBy == "walk" ? (
          <HStack
            style={{
              backgroundColor:
                colorScheme == "dark"
                  ? darkMode.Card.backgroundColor
                  : lightMode.Card.backgroundColor,
              borderRadius: 10,
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
              margin: 5,
            }}
          >
            <Stack space={0} marginRight={3}>
              {nobusDestination == false ? (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    padding: 0,
                    margin: 0,
                    color:
                      colorScheme == "dark"
                        ? darkMode.Text.color
                        : lightMode.Text.color,
                  }}
                >
                  Tap map to set location
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    padding: 0,
                    margin: 0,
                    color:
                      colorScheme == "dark"
                        ? darkMode.Text.color
                        : lightMode.Text.color,
                  }}
                >
                  Location selected
                </Text>
              )}
              {selectDestination ? (
                <Text
                  style={
                    colorScheme == "dark" ? darkMode.Title : lightMode.Title
                  }
                >
                  Location set
                </Text>
              ) : null}
            </Stack>
            <Button
              style={{
                backgroundColor: "#1DA15D",
                marginRight: 5,
                marginLeft: 5,
                padding: 0,
              }}
              onPress={() => {
                if(nobusDestination == false){
                  setNoBusDestination(true);
                }
              }}
            >
              <MaterialCommunityIcons
                name="check"
                size={18}
                color={
                  colorScheme == "dark"
                    ? darkMode.Button.backgroundColor
                    : lightMode.Button.backgroundColor
                }
              />
            </Button>
            <Button
              onPress={() => {
                setNoBusDestination(false);
                setMarkers(null);
              

              }}
              style={{
                backgroundColor: "#D93729",
                marginLeft: 5,
                marginRight: 5,
                padding: 0,
              }}
            >
              <MaterialCommunityIcons
                name="cancel"
                size={18}
                color={
                  colorScheme == "dark"
                    ? darkMode.Button.backgroundColor
                    : lightMode.Button.backgroundColor
                }
              />
            </Button>
          </HStack>
        ) : null}

        <Box style={colorScheme == "dark" ? darkMode.Card : lightMode.Card}>
          {/* space between hstack elementes */}
          <HStack space={2} alignItems="center" justifyContent="center">
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
              {runTime ? (
                <Text
                  style={
                    colorScheme == "dark" ? darkMode.Title : lightMode.Title
                  }
                >
                  Ongoing{" "}
                </Text>
              ) : null}
              Trip
            </Text>
            <MaterialCommunityIcons
              name={travelingBy}
              size={24}
              color={
                colorScheme == "dark"
                  ? lightMode.Button.backgroundColor
                  : darkMode.Button.backgroundColor
              }
            />
          </HStack>
          {travelingBy == "bus" ? (
            <>
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
                Route ID:
                {selectedRoute}
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
                First Stop: {startStopName}
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
                Final Stop: {finalStopName}
              </Text>
            </>
          ) : (
            <>
           
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
                Trip Time:{" "}
                <Text
                  style={
                    colorScheme == "dark" ? darkMode.Title : lightMode.Title
                  }
                >
                  {minutes > 9 ? minutes : "0" + minutes}:
                  {seconds > 9 ? seconds : "0" + seconds}
                </Text>
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
                Steps: {currentStepCount}
              </Text>
            </>
          )}
        </Box>

        <HStack space={2} alignItems="center" justifyContent="center">
          {runTime == false ? (
            <Button
              style={{
                backgroundColor:
                  colorScheme == "dark"
                    ? darkMode.Button.backgroundColor
                    : lightMode.Button.backgroundColor,
                borderRadius: 10,
                padding: 10,

                margin: 5,
              }}
              onPress={() => {
                if (travelingBy == "bus") {
                  if (startStop && finalStop) {
                    setConfirmSelect(true);
                    setRunTime(true);
                    start();
                    setConfirm(2);
                  }
                } else {
                  if (seconds == 0) {
                    start();
                    setRunTime(true);
                    setConfirm(1);
                    _mapView.animateToRegion({
                      latitude: location?.coords.latitude,
                      longitude: location?.coords.longitude,
                      latitudeDelta: 0.0022,
                      longitudeDelta: 0.0022,
                    });
                  }
                }
              }}
            >
              <Text
                style={colorScheme == "dark" ? darkMode.Title : lightMode.Title}
              >
                Start Trip
              </Text>
            </Button>
          ) : (
            <>
              <Button
                style={{
                  backgroundColor:
                    colorScheme == "dark"
                      ? darkMode.Button.backgroundColor
                      : lightMode.Button.backgroundColor,
                  borderRadius: 10,
                  padding: 10,
                  margin: 5,
                }}
                onPress={() => {
                  if (travelingBy == "bus") {
                    if (startStop && finalStop) {
                      setConfirmSelect(true);
                      setRunTime(true);
                      pause();
                      reset();
                      setConfirm(2);
                    }
                  } else if(nobusDestination == true){
                    setConfirmSelect(true);
                    setRunTime(true);
                    pause();
                    reset();
                    setConfirm(1);
                  } 
                }}
              >
                <Text
                  style={
                    colorScheme == "dark" ? darkMode.Title : lightMode.Title
                  }
                >
                  Sumbit Trip
                </Text>
              </Button>
              <Button
                style={{
                  backgroundColor:
                    colorScheme == "dark"
                      ? darkMode.Button.backgroundColor
                      : lightMode.Button.backgroundColor,
                  borderRadius: 10,
                  padding: 10,
                  margin: 5,
                }}
                onPress={() => {
                  reset();
                  pause();
                  setRunTime(false);
                  setStartStop(null);
                  setFinalStop(null);
                  setConfirm(0);
                  setNoBusDestination(false);
                }}
              >
                <Text
                  style={
                    colorScheme == "dark" ? darkMode.Title : lightMode.Title
                  }
                >
                  Clear
                </Text>
              </Button>
            </>
          )}

          <Button
            onPress={() => {
              setSelectTraveler(!selectTraveler);
            }}
            style={{
              zIndex: 100,
              backgroundColor:
                colorScheme == "dark"
                  ? darkMode.Button.backgroundColor
                  : lightMode.Button.backgroundColor,
            }}
          >
            <MaterialCommunityIcons
              name={travelingBy}
              size={24}
              color={
                colorScheme == "dark"
                  ? lightMode.Button.backgroundColor
                  : darkMode.Button.backgroundColor
              }
            />
          </Button>
        </HStack>
      </VStack>
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
            // console.log(location);
            _mapView.animateToRegion({
              latitude: 18.2109,
              longitude: -67.1409,
              latitudeDelta: 0.0042,
              longitudeDelta: 0.0042,
            });
          }}
          style={{
            zIndex: 100,
            backgroundColor:
              colorScheme == "dark"
                ? darkMode.Button.backgroundColor
                : lightMode.Button.backgroundColor,
          }}
        >
          <Text
            style={
              colorScheme == "dark" ? darkMode.Text.color : lightMode.Text.color
            }
          >
            {" "}
            Go To Mayaguez
          </Text>
        </Button>
      </View>
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
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
              latitudeDelta: 0.0042,
              longitudeDelta: 0.0041,
            });
          }}
          style={{
            zIndex: 100,
            backgroundColor:
              colorScheme == "dark"
                ? darkMode.Button.backgroundColor
                : lightMode.Button.backgroundColor,
          }}
        >
          <MaterialIcons
            name="my-location"
            size={24}
            color={
              colorScheme == "dark"
                ? lightMode.Button.backgroundColor
                : darkMode.Button.backgroundColor
            }
          />
        </Button>
      </View>
      {/* Show all buses */}

      {selectTraveler ? (
        true
      ) : (
        <View
          style={{
            position: "absolute",
            bottom: "40%",
            right: 70,
            zIndex: 100,
            width: "40%",
            backgroundColor:
              colorScheme == "dark"
                ? darkMode.Button.backgroundColor
                : lightMode.Button.backgroundColor,
            borderRadius: 10,
            alignItems: "flex-start",
            padding: 2,
          }}
        >
          <Button
            onPress={() => {
              setTravelingBy("walk");
            }}
            style={{
              zIndex: 100,
              backgroundColor:
                colorScheme == "dark"
                  ? darkMode.Button.backgroundColor
                  : lightMode.Button.backgroundColor,
            }}
          >
            <HStack space={2} alignItems={"center"} justifyContent="center">
              <Text
                color={
                  colorScheme == "dark"
                    ? darkMode.Text.color
                    : lightMode.Text.color
                }
              >
                Walking
              </Text>
              <MaterialCommunityIcons
                name="walk"
                size={24}
                color={
                  colorScheme == "dark"
                    ? lightMode.Button.backgroundColor
                    : darkMode.Button.backgroundColor
                }
              />
            </HStack>
          </Button>
          <Button
            onPress={() => {
              setTravelingBy("bus");
            }}
            style={{
              zIndex: 100,
              backgroundColor:
                colorScheme == "dark"
                  ? darkMode.Button.backgroundColor
                  : lightMode.Button.backgroundColor,
            }}
          >
            <HStack space={2} alignItems="center" justifyContent="center">
              <Text
                color={
                  colorScheme == "dark"
                    ? darkMode.Text.color
                    : lightMode.Text.color
                }
              >
                Bus
              </Text>
              <MaterialCommunityIcons
                name="bus"
                size={24}
                color={
                  colorScheme == "dark"
                    ? lightMode.Button.backgroundColor
                    : darkMode.Button.backgroundColor
                }
              />
            </HStack>
          </Button>
          <Button
            onPress={() => {
              setTravelingBy("scooter");
            }}
            style={{
              zIndex: 100,
              backgroundColor:
                colorScheme == "dark"
                  ? darkMode.Button.backgroundColor
                  : lightMode.Button.backgroundColor,
            }}
          >
            <HStack space={2} alignItems="center" justifyContent="center">
              <Text
                color={
                  colorScheme == "dark"
                    ? darkMode.Text.color
                    : lightMode.Text.color
                }
              >
                E-scooter
              </Text>
              <MaterialCommunityIcons
                name="scooter"
                size={24}
                color={
                  colorScheme == "dark"
                    ? lightMode.Button.backgroundColor
                    : darkMode.Button.backgroundColor
                }
              />
            </HStack>
          </Button>
          <Button
            onPress={() => {
              setTravelingBy("car");
            }}
            style={{
              zIndex: 100,
              backgroundColor:
                colorScheme == "dark"
                  ? darkMode.Button.backgroundColor
                  : lightMode.Button.backgroundColor,
            }}
          >
            <HStack space={2} alignItems="center" justifyContent="center">
              <Text
                color={
                  colorScheme == "dark"
                    ? darkMode.Text.color
                    : lightMode.Text.color
                }
              >
                Car
              </Text>
              <MaterialCommunityIcons
                name="car"
                size={24}
                color={
                  colorScheme == "dark"
                    ? lightMode.Button.backgroundColor
                    : darkMode.Button.backgroundColor
                }
              />
            </HStack>
          </Button>
        </View>
      )}
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
    backgroundColor: "blue",
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
    backgroundColor: "green",
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
