import * as Location from "expo-location";
import * as MapVal from "../assets/map.json";
import * as TaskManager from "expo-task-manager";

import {
  Alert,
  AlertDialog,
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
} from "native-base";
import { Callout, Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { darkMode, lightMode } from "../config";
import { getOnlineById, getPosition } from "../components/URLFetcher";
import { getRouteColor, getRoutes } from "../assets/gtfs/route";
import { getStopById, getStopByIdOnline, getStops } from "../assets/gtfs/stops";

import BusArrivalInformation from "../components/BusArrivalInformation";
import MapView from "react-native-map-clustering";
import { Pedometer } from "expo-sensors";
import Shapes from "../assets/gtfs/shapes.json";
import TripData from "../components/TripData";
import { color } from "react-native-reanimated";
import { supabase } from "../utils/supabase";
import { useNavigation } from "@react-navigation/native";
import { useStopwatch } from "react-timer-hook";

export const MapScreen = () => {
  const colorScheme = useColorScheme();
  const [seq, setSeq] = useState(1)
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [selectedStopName, setSelectedStopName] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [travelingBy, setTravelingBy] = useState("bus");
  const [startStop, setStartStop] = useState(null);
  const [finalStop, setFinalStop] = useState(null);
  const [tripD, setTripD] = useState(null);
  const memoRt = React.useMemo(() => Shapes, []);
  const memoStop = React.useMemo(() => getStops(), []);
  const [startStopName, setStartStopName] = useState(null);
  const [finalStopName, setFinalStopName] = useState(null);
  const [selectTraveler, setSelectTraveler] = useState(false);
  const [selectDestination, setSelectDestination] = useState(false);
  const [runTime, setRunTime] = useState(false);
  const [markers, setMarkers] = useState(null);
  const [startLocData, setStartLocData] = useState(null);
  const [uid, setUid] = useState(null);
  const [email, setEmail] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [position, setPosition] = useState([null]);
  const [backLoc, setBackLoc] = useState([]);
  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });
  const [tripTime, setTripTime] = useState(0);
  const [travelingByHistory, setTravelingByHistory] = useState([]);
  const memo = useMemo(() => getTime(), [hours, minutes, seconds]);
  async function getTime() {
    const h = hours > 9 ? hours : "0" + hours;
    const m = minutes > 9 ? minutes : "0" + minutes;
    const s = seconds > 9 ? seconds : "0" + seconds;
    setTripTime(h + ":" + m + ":" + s);
    return h + ":" + m + ":" + s;
  }
 let foregroundSubscription = null;

  useEffect(() => {
    (async () => {
      if(uid == null){
        const {
          data: { user, error },
        } = await supabase.auth.getUser();       
         if (error) {
          console.log(error);
        }
        if (user) {
          setUid(user.email);
        }
      }
      if (location == null|| runTime == true) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission to access location was denied",
          )
          return;

        }
           // Make sure that foreground location tracking is not running
    foregroundSubscription?.remove()

    // Start watching position in real-time
    foregroundSubscription = await Location.watchPositionAsync(
      {
        // For better logs, we set the accuracy to the most sensitive option
        accuracy: Location.Accuracy.BestForNavigation,
      },
      location => {
        setLocation(location.coords)
      }
    )
      }
      if(isRunning||runTime){
        setBackLoc((backLoc) => [...backLoc, location]);
      }
    })();
  }, [uid, location]);



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
  function getShapeByRouteId(routeId) {
    let coord = [];
    memoRt.map((shape) => {
      if (shape.shape_id.includes(routeId)) {
        coord.push({
          latitude: shape.shape_pt_lat,
          longitude: shape.shape_pt_lon,
        });
      }
    });
    return coord;
  }

  async function continueTripSupa() {
    let a = new Date(startLocData?.timestamp).toISOString()
    let b = new Date(location?.timestamp).toISOString()
   const {data, error} = await supabase.from("trips").insert([
      {
        location_start: {
          latitude: startLocData?.latitude,
          longitude: startLocData?.longitude,
          startStop: startStopName,
        },
        location_end:{
          latitude: position?.latitude,
          longitude: position?.longitude,
        },
        start_time:  Date(startLocData?.timestamp).toString(),
        end_time:    Date().toString(),
        travel: travelingBy,
        trip_duration: tripTime,
        email: uid, //email
        polyline: [position],
        seq: seq,
        trip_status: "continued",
      },
    ])
   
   if(data!= null){
    const a = seq
        setSeq(a+1)
   }
   if(error){
    console.log(error)
   }

  }
 
  async function submitTripSupa() {
    const { data, error } = await supabase.from("trips").insert([
      {
        location_start: {
          latitude: startLocData?.coords.latitude,
          longitude: startLocData?.coords.longitude,
          startStop: startStop,
        },
        start_time: new  Date(startLocData?.timestamp).toLocaleTimeString(),
        end_time: new  Date(location?.timestamp).toLocaleTimeString(),
        location_end: {
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
          finalStop: finalStop,
        },
        travel: travelingBy,
        trip_duration: tripTime,
        email: uid, //email
        polyline: backLoc,
        seq: seq,
        trip_status: "ended",
      },
    ]);
    if (error) {
      console.log(error);
    } else {
      setConfirm(null);
      setRunTime(false);
      setStartStop(null);
      setFinalStop(null);
      setSelectTraveler(false);
      setBackLoc([]);
      pause();
      reset();
      pause();
    }
  }
  const _mapRef = useRef();

  async function addCycle({travel, timestamp}) {
    requestAnimationFrame(async () => {
{
        const { data, error } = await supabase.from("trips").insert([
      {
        location_start: {
          latitude: startLocData?.coords.latitude,
          longitude: startLocData?.coords.longitude,
          startStop: startStop,
        },
        start_time:  Date(startLocData?.timestamp).toLocaleString(),
        end_time:  Date(location?.timestamp).toLocaleString(),
        location_end: {
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
          finalStop: finalStop,
        },
        travel: travelingByHistory,
        trip_duration: getTime() ,
        email: email,
        polyline: backLoc,
        seq: 1,
        trip_status: "ended",
      },
    ]);
    
}
    });
  }

  async function startTripSupa() {
    requestAnimationFrame(() => {
      {
        if (travelingBy == "bus") {
          if (startStop && finalStop) {
            setRunTime(true);
            reset()
            start();
            setConfirm(0);
            setStartLocData(position);
          }
        } else {
          reset()
          start();
          setRunTime(true);
          setConfirm(1);
          setStartLocData(position);
          setConfirm(true);
        
        }
      }
    });
  }



  const animateToRegion = () => {
    let region = {
      latitude: 18.201025,
      longitude: -67.13183,
      latitudeDelta: 0.0092,
      longitudeDelta: 0.0091,
    };

    _mapRef.current.animateToRegion(region, 1000);
  };
  const INITIAL_REGION = {
    latitude: 18.205289, 
    longitude: -67.13153,
    latitudeDelta: 0.0292,
    longitudeDelta: 0.0292,
  };

  return (
    <View style={styles.container}>
      <MapView
        minPoints={3}
        nodeSize={2}
        provider={PROVIDER_GOOGLE}
        customMapStyle={MapVal}
        showsUserLocation={true}
        showsMyLocationButton={true}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        ref={_mapRef}
      >
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
                    Bus {device.deviceId} - {isOnline}xcc
                  </Text>
                  <Text> acc: {device.accuracy}</Text>
                </Callout>
              </Marker>
            );
          }
        })}
        {memoStop.map((stop, index) => {
          return (
            <Marker
              zIndex={10}
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
                  setSelectedRoute(stop.id);
                }
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

      {backLoc ? (
        <Polyline
          coordinates={backLoc}
          strokeColors={["#f4ca", "#adfc", "#4f44"]}
          strokeWidth={6}
        />
      ) : null}
      </MapView>

      <View
        style={{
          position: "absolute",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          top: "13%",
          padding: 1,
          left: 0,
          width: "100%",
        }}
      >
      <FlatList horizontal 
        data={getRoutes()}
      
      />
      </View>
      <VStack
        style={{
          position: "absolute",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          bottom: "13%",
          padding: 1,
          left: 0,
          width: "100%",
        }}
      >
        {/* selected stop info */}
        {selectTraveler ? (
              <Box style={
                {
                  backgroundColor: colorScheme == "dark" ? darkMode.Card.backgroundColor : lightMode.Card.backgroundColor,
                  borderRadius: 10,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 3,
                  
                }
              }>
            <HStack space={2} alignItems="center" justifyContent="center">
              {/* <Text style={{ fontSize: 16, fontWeight: "bold" }}>Trip:</Text> */}
              <Button
                variant={"ghost"}
                onPress={() => {
                  setTravelingBy("bus");
                  setSelectTraveler(false);
                }}
              >
                <MaterialCommunityIcons
                  name={"bus"}
                  size={24}
                  color={"#1DA15D"}
                />
              </Button>
              <Divider orientation="vertical" />
              <Button
                variant={"ghost"}
                onPress={() => { 
                  setTravelingBy("walk");
                  setSelectTraveler(false);
                }}
              >
                <MaterialCommunityIcons
                  name={"walk"}
                  size={24}
                  color={"#1DA15D"}
                />
              </Button>
              <Divider orientation="vertical" />
              <Button
                variant={"ghost"}
                onPress={() => {
                  setTravelingBy("car")
                  
                  setSelectTraveler(false);
                }}
              >
                <MaterialCommunityIcons
                  name={"car"}
                  size={24}
                  color={"#1DA15D"}
                />
              </Button>
              <Divider orientation="vertical" />
              <Button
                variant={"ghost"}
                onPress={() => {
                  setTravelingBy("scooter");
                  setSelectTraveler(false);
                }}
              >
                <MaterialCommunityIcons
                  name={"scooter"}
                  size={24}
                  color={"#1DA15D"}
                />
              </Button>
            </HStack>
          </Box>
          
        ) : null}
        {
          isRunning || runTime  ? (
            <Box style={{ 
              backgroundColor: colorScheme == "dark" ? darkMode.Card.backgroundColor : lightMode.Card.backgroundColor,
              borderRadius: 10,
            }}>
              <Button
                leftIcon={
                  <MaterialCommunityIcons 
              name={"plus"}
              size={24} 
              color={"#1DA15D"} />
                }
               onPress={
                () => continueTripSupa()
              }  variant={'ghost'} style={{ borderRadius: 10, padding: 10, margin: 5, zIndex: 100, }}>
              <Text style={
                colorScheme == "dark" ? darkMode.Title : lightMode.Title
              }>New Cycle
              </Text>
              
              </Button>
            </Box>
          ) : null
        }
        {travelingBy == "bus" &&
        (startStopName == null || finalStopName == null) ? (
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
              margin: 3,
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
              <MaterialCommunityIcons name="check" size={18} color={"white"} />
            </Button>
          </HStack>
        ) : null}
        {runTime == true &&
        ( travelingBy == "flying") ? (
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
                if (markers != null) {
                  setSelectDestination(true);
                } else {
                  Alert.alert(
                    "Select a location on the map to set as destination"
                  );
                }
              }}
            >
              <MaterialCommunityIcons name="check" size={18} color={"white"} />
            </Button>
            <Button
              onPress={() => {
                setNoBusDestination(false);
                setSelectDestination(false);
                setMarkers(null);
              }}
              style={{
                backgroundColor: "#D93729",
                marginLeft: 5,
                marginRight: 5,
                padding: 0,
              }}
            >
              <MaterialCommunityIcons name="cancel" size={18} color={"white"} />
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
                  ? "white"
                  : darkMode.Button.backgroundColor
              }
            />
          </HStack>
          {travelingBy == "bus" ? (
            <>
              <Text style={
                colorScheme == "dark" ? darkMode.Text : lightMode.Text
              }>
                <MaterialCommunityIcons
                  name="timer-outline"
                  size={18}
                  color={
                    colorScheme == "dark"
                      ? darkMode.Text.color
                      : lightMode.Text.color
                  }
                />{" "}
                {tripTime}
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
                <MaterialCommunityIcons
                  name="highway"
                  size={18}
                  color={
                    colorScheme == "dark"
                      ? darkMode.Text.color
                      : lightMode.Text.color
                  }
                />{" "}
                {selectedRoute}
              </Text>
              <HStack
                space={2}
                alignItems={"center"}
                justifyItems={"space-between"}
              >
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
                  <MaterialCommunityIcons
                    name="bus-stop"
                    size={18}
                    color={
                      colorScheme == "dark"
                        ? darkMode.Text.color
                        : lightMode.Text.color
                    }
                  />
                    {
                startStopName? (<Text style={{
                  fontSize: 14,
                  color:
                    colorScheme == "dark"
                      ? darkMode.Text.color
                      : lightMode.Text.color,
                }}>
                {startStopName}
                </Text>
): (
  <Text style={{
                  fontSize: 14,
                  color:
                    colorScheme == "dark"
                      ? darkMode.Text.color
                      : lightMode.Text.color,
                }}>
                Choose first stop
                </Text>

)
              }
               </Text>

                {startStop != null ? (
                  <Button
                    variant={"ghost"}
                    margin={1}
                    padding={1}
                    onPress={() => {
                      setStartStop(null);
                      setStartStopName(null);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color:
                          colorScheme == "dark"
                            ? darkMode.Text.color
                            : lightMode.Text.color,
                      }}
                    >
                      {" "}
                      Remove stop
                    </Text>
                  </Button>
                ) : null}
              </HStack>

              <HStack
                space={2}
                alignItems={"center"}
                justifyItems={"space-between"}
              >
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
                  <MaterialCommunityIcons
                    name="bus-stop"
                    size={18}
                    color={
                      colorScheme == "dark"
                        ? darkMode.Text.color
                        : lightMode.Text.color
                    }
                  />{" "}
                  {finalStopName ? (
                    <Text
                      style={{
                        fontSize: 14,
                        color:
                          colorScheme == "dark"
                            ? darkMode.Text.color
                            : lightMode.Text.color,
                      }}
                    >
                      {finalStopName}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 14,
                        color:
                          colorScheme == "dark"
                            ? darkMode.Text.color
                            : lightMode.Text.color,
                      }}
                    >
                      Choose final stop
                    </Text>
                  )}
                </Text>

                {finalStop != null ? (
                  <Button
                    variant={"ghost"}
                    margin={1}
                    padding={1}
                    onPress={() => {
                      setFinalStop(null);
                      setFinalStopName(null);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color:
                          colorScheme == "dark"
                            ? darkMode.Text.color
                            : lightMode.Text.color,
                      }}
                    >
                      {" "}
                      Remove stop
                    </Text>
                  </Button>
                ) : null}
              </HStack>
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
                    colorScheme == "dark" ? darkMode.Text : lightMode.Text
                  }
                >
                  {tripTime}
                </Text>
              </Text>
            </>
          )}
        </Box>

        <HStack space={2} alignItems="center" justifyContent="center">
          <Button
            onPress={() => {
              setSelectTraveler(!selectTraveler);
            }}
            style={{
              zIndex: 100,
              margin: 3,
              padding: 2,
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
        
          {runTime == false ? (
            <Button
              style={{
                backgroundColor:
                  colorScheme == "dark"
                    ? darkMode.Button.backgroundColor
                    : lightMode.Button.backgroundColor,
                borderRadius: 10,
                padding: 5,
                margin: 5,
                zIndex: 100,
              }}
              onPress={() => startTripSupa()}
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
                  zIndex: 100,
                }}
                onPress={async () => submitTripSupa()}
              >
                <Text
                  style={
                    colorScheme == "dark" ? darkMode.Title : lightMode.Title
                  }
                >
                  Finish Trip
                </Text>
              </Button>
            </>
          )}
          {startStop != null ||
          finalStop != null ||
          markers != null ||
          runTime == true ? (
            <Button
              style={{
                backgroundColor:
                  colorScheme == "dark"
                    ? darkMode.Button.backgroundColor
                    : lightMode.Button.backgroundColor,
                borderRadius: 10,
                padding: 3,
                margin: 3,
              }}
              onPress={() => {
                setStartStop(null);
                setStartLocData(null);
                setStartStopName(null);
                setFinalStop(null);
                setFinalStopName(null);
                setMarkers(null);
                reset();
                pause();
                setRunTime(false);
                setSelectTraveler(false);
                setBackLoc([]);
                setConfirm(null);
              }}
            >
              <Text
                style={colorScheme == "dark" ? darkMode.Title : lightMode.Title}
              >
                Clear
              </Text>
            </Button>
          ) : null}
        </HStack>
      </VStack>
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
