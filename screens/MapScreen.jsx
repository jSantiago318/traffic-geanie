import * as Location from "expo-location";
import * as MapVal from "../assets/map.json";

import {
  Alert,
  Box,
  Button,
  Center,
  Container,
  Divider,
  HStack,
  Input,
  ScrollView,
  SectionList,
  Select,
  Stack,
  Text,
  VStack,
} from "native-base";
import { Callout, Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { colorsDark, colorsLight, darkMode, lightMode } from "../config";
import { getOnlineById, getPosition } from "../components/URLFetcher";
import { getRouteColor, getRoutes } from "../assets/gtfs/route";

import MapView from "react-native-map-clustering";
import { Platform } from "react-native";
import Shapes from "../assets/gtfs/shapes.json";
import { getStops } from "../assets/gtfs/stops";
import { supabase } from "../utils/supabase";
import { useStopwatch } from "react-timer-hook";

const pngStop = require("../assets/BusStop.png")


export const MapScreen = () => {
  const colorScheme = useColorScheme();
  const [seq, setSeq] = useState(0);
  
  const [location, setLocation] = useState(null);
  const [selectedSeq, setSelectedSeq] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [selectedStopName, setSelectedStopName] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [travelingBy, setTravelingBy] = useState("bus");
  const [startStop, setStartStop] = useState(null);
  const [finalStop, setFinalStop] = useState(null);
  const [lastTripId, setLastTripId] = useState(0);
  const memoRt = React.useMemo(() => Shapes, []);
  const memoStop = React.useMemo(() => getStops(), []);
  const [startStopName, setStartStopName] = useState(null);
  const [finalStopName, setFinalStopName] = useState(null);
  const [selectTraveler, setSelectTraveler] = useState(false);
  const [runTime, setRunTime] = useState(false);
  const [markers, setMarkers] = useState(null);
  const [startLocData, setStartLocData] = useState(null);
  const [uid, setUid] = useState(null);
  const [showTrips, setShowTrips] = useState(false);
  const [backLoc, setBackLoc] = useState([]);
  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });
  const [showTripMenu, setShowTripMenu] = useState(true);
  const [tripTime, setTripTime] = useState(0);
  const [trips, setTrips] = useState([]);
  const memo = useMemo(() => getTime(), [hours, minutes, seconds]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertProblem, setAlertProblem] = useState('');
  const [alertCat, setAlertCat] = useState('');
  const [alertStatus, setAlertStatus] = useState(1);
  
  const [showTripData, setShowTripData] = useState(false);
  async function getTime() {
    const h = hours > 9 ? hours : "0" + hours;
    const m = minutes > 9 ? minutes : "0" + minutes;
    const s = seconds > 9 ? seconds : "0" + seconds;
    setTripTime(h + ":" + m + ":" + s);
    return h + ":" + m + ":" + s;
  }
  let foregroundSubscription = null;
  async function newCoords(){
    try{
    await supabase.from('travel')
    .insert([
      {
        udi: uid,
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        tripId: lastTripId,
        travel: travelingBy,
      }
    ])

  } catch (error) {
    console.log(error)
  }
  }
  useEffect(() => {
    (async () => {
      if (uid == null) {
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

      if (location == null || runTime == true) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          return;
        }
        // Make sure that foreground location tracking is not running
        // foregroundSubscription?.remove()

        // Start watching position in real-time
        foregroundSubscription = await Location.watchPositionAsync(
          {
            // For better logs, we set the accuracy to the most sensitive option
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
          },
          (location) => {
            // if(seconds % 6 == 0){
            //   setBackLoc(backLoc => [...backLoc, [location.coords.latitude, location.coords.longitude]])
            // }
            newCoords()
            setLocation(location);
            // const url = 'https://www.api.proba.live/genUserLoc?userId=' + uid + '&tripId=' + lastTripId + '&tripSequence=' + seq + '&routeId=' + selectedRoute + '&busId=' + '0' + '&stopId=' + selectedStop + '&predictionTime=' + '0' + '&device=0&deviceTime=0&transportationBy=' + travelingBy + '&lat=' + location.coords.latitude + '&lon=' + location.coords.longitude

            // fetch(url)
            //   .then((response) => response.json())
            //   .then((json) => {
            //     console.log(json);
            //   })
            //   .catch((error) => {
            //     console.error(error);
            //   });
          }
        );
      }

   
    })();
  }, [uid, location]);



  function returnStop(stopId, stopName) {
    if (selectedSeq !=null &&
        selectedSeq.location_start.startStop
        == stopName
      ) {
      return (
        <><Image
        source={require("../assets/busStopArrival.png")}
        style={{ height: 40, width: 40 }} /><Callout
          style={{
            width: 200,
            zIndex: 100,
            borderRadius: 10,
          }}
        >
          <Text>{stopName}</Text>
          <Text>{selectedSeq.location_start.startTime}</Text>
        </Callout></>
      );
    } else   if (selectedSeq !=null &&
      selectedSeq.location_end.finalStop
      == stopName
    ) {
    return (
      <><Image
        source={require("../assets/busStopArrival.png")}
        style={{ height: 40, width: 40 }} /><Callout
          style={{
            width: 200,
            zIndex: 100,
            borderRadius: 10,
          }}
        >
          <Text>{stopName}</Text>
          <Text>{selectedSeq.location_start.startTime}</Text>

        </Callout></>
    );
  }
    if (stopId == startStop) {
      return (
        <><Image
        source={require("../assets/busStop1.png")}
        style={{ height: 40, width: 40 }} /><Callout
          style={{
            width: 200,
            zIndex: 100,
            borderRadius: 10,
          }}
        >
          <Text>{stopName}</Text>
          <Text>{stopId}</Text>
        </Callout></>
      );
    } else if (stopId == finalStop) {
      return (
        <><Image
        source={require("../assets/busStop2.png")}
        style={{ height: 40, width: 40 }} /><Callout
          style={{
            width: 200,
            zIndex: 100,
            borderRadius: 10,
          }}
        >
          <Text>{stopName}</Text>
          <Text>{stopId}</Text>
        </Callout></>
      );
    }   else {
      return (
        <><Image
        source={require("../assets/BusStop.png")}
        style={{ height: 40, width: 40 }} /><Callout
          style={{
            width: 200,
            zIndex: 100,
            borderRadius: 10,
          }}
        >
          <Text>{stopName}</Text>
          <Text>{stopId}</Text>
        </Callout></>
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
  function seqs(opt) {
    if (opt == 0) {
      setSeq(seq + 1);
      return seq;
    } else if (opt == 1) {
      const a = seq;
      setSeq(0);
      return a;
    }
  } 
  async function continueTripSupa() {
    const d1 = new Date(startLocData?.timestamp);
    const d2 = new Date(location?.timestamp);
    const { data, error } = await supabase
      .from("trips")
      .insert([
        {
          location_start: {
            latitude: startLocData?.coords.latitude,
            longitude: startLocData?.coords.longitude,
            startStop: startStopName,
            startTime: d1.toTimeString(),
          },
          location_end: {
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
            finalStop: finalStopName,
            endTime: d2.toTimeString(),
          },
          travel: travelingBy,
          trip_duration: tripTime,
          email: uid, //email
          polyline: [location?.coords],
          seq: seqs(0),
          trip_status: "continued",
          tripId: lastTripId,
        },
      ])
      .select();
    if (data) {
      if(seq == 0){
        setLastTripId(data[0].id);
      }
      console.log(data);
    }

    if (error) {
      console.log(error);
    }
  }

  async function submitTripSupa() {
    const d1 = new Date(startLocData?.timestamp);
    const d2 = new Date(location?.timestamp);
    const { data, error } = await supabase.from("trips").insert([
      {
        location_start: {
          latitude: startLocData?.coords.latitude,
          longitude: startLocData?.coords.longitude,
          startStop: startStop,
          startTime: d1.toTimeString(),
        },
        location_end: {
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
          finalStop: finalStop,
          endTime: d2.toTimeString(),
        },
        travel: travelingBy,
        trip_duration: tripTime,
        email: uid, //email
        polyline: [],
        seq: seqs(1),
        trip_status: "ended",
        tripId: lastTripId,
      },
    ]);
    console.log(data);

    // setLastTripId(data[0].id)
    if (error) {
      console.log(error);
    } else { 
      setRunTime(false);
      setStartStop(null);
      setFinalStop(null);
      setSelectTraveler(false);
      setBackLoc([]);
      pause();
      reset();
      pause();
      setLastTripId(0);
    }
  }
  const _mapRef = useRef();

  

  async function startTripSupa() {
    requestAnimationFrame(() => {
      {
        if (travelingBy == "bus") {
          if (startStop && finalStop) {
            setRunTime(true);
            reset();
            start(); 
            setStartLocData(location);
          }
        } else {
          reset();
          start();
          setRunTime(true); 
          setStartLocData(location); 
          setLastTripId(0)
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
        provider={
          Platform.OS == "android" ? PROVIDER_GOOGLE : MapView.PROVIDER_DEFAULT
        }
        customMapStyle={MapVal}
        showsUserLocation={true}
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
              {returnStop(stop.id, stop.name)}
              
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
      {/* vertical right pannel button menu */}
      <VStack
        style={{
          zIndex: 100,
          position: "absolute",
          alignContent: "flex-end",
          justifyContent: "flex-end",
          top: "15%",
          padding: 2,
          left: "1%",
          backgroundColor: "transparent",
        }}
      >
        <Button
          onPress={() => {
            setSelectTraveler(!selectTraveler);
          }}
          style={{
            zIndex: 100,
            margin: 2,
            padding: 2,
            borderRadius: 10,
            maxHeight: 50,
            maxWidth: 50,
            backgroundColor: "#36B24A",
          }}
        >
          <MaterialCommunityIcons
            name={travelingBy}
            size={24}
            color={"white"}
          />
        </Button>
        <Button
          onPress={() => {
            // setSelectTraveler(!selectTraveler);
            setShowTrips(!showTrips);
            setShowTripMenu(!showTripMenu);
          }}
          style={{
            zIndex: 100,
            margin: 2,
            padding: 2,
            borderRadius: 10,
            maxHeight: 50,
            maxWidth: 50,
            backgroundColor: "#0B87DE",
          }}
        >
          <MaterialCommunityIcons
            name={"book-open-page-variant-outline"}
            size={24}
            color={"white"}
          />
        </Button>
        <Button
          onPress={() => {
            // setSelectTraveler(!selectTraveler);
          }}
          style={{
            zIndex: 100,
            margin: 2,
            padding: 2,
            borderRadius: 10,
            maxHeight: 50,
            maxWidth: 50,
            backgroundColor: "#FACA2D",
          }}
        >
          <MaterialCommunityIcons name={"camera"} size={24} color={"white"} />
        </Button>

        <Button
          onPress={() => {
            // setSelectTraveler(!selectTraveler);
            setShowAlert(!showAlert);
          }}
          style={{
            zIndex: 100,
            margin: 2,
            padding: 2,
            borderRadius: 10,
            maxHeight: 50,
            maxWidth: 50,
            backgroundColor: "#BF2834",
          }}
        >
          <MaterialCommunityIcons
            name={"alert-box-outline"}
            size={24}
            color={"white"}
          />
        </Button>
        <Button
          onPress={() => {
            // console.log(location);
            _mapRef.current.animateToRegion({
              latitude: location.coords?.latitude,
              longitude: location.coords?.longitude,
              latitudeDelta: 0.0092,
              longitudeDelta: 0.0091,
            }, 1000);
          }}
          style={{
            zIndex: 100,
            margin: 2,
            padding: 2,
            borderRadius: 10,
            maxHeight: 50,
            maxWidth: 50,
            backgroundColor: "#36B24A",
          }}
        >
          <MaterialCommunityIcons
            name={"map-marker-account"}
            size={24}
            color={"white"}
          />
        </Button>
      </VStack>

      {/* vertical menu  */}
     
      {showTripMenu ? (
        <VStack
          style={{
            position: "absolute",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            bottom: "5%",
            padding: 1,
            left: 0,
            width: "100%",
          }}
        >
          {selectTraveler ? (
            <View
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
              <Text
                style={colorScheme == "dark" ? darkMode.Title : lightMode.Title}
              >
                Traveling By:{" "}
              </Text>

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
                    setTravelingBy("car");

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
            </View>
          ) : null}
          {isRunning || runTime ? (
            <Box
              style={{
                backgroundColor:
                  colorScheme == "dark"
                    ? darkMode.Card.backgroundColor
                    : lightMode.Card.backgroundColor,
                borderRadius: 10,
              }}
            >
              <Button
                leftIcon={
                  <MaterialCommunityIcons
                    name={"plus"}
                    size={24}
                    color={"#1DA15D"}
                  />
                }
                onPress={() => continueTripSupa()}
                variant={"ghost"}
                style={{
                  borderRadius: 10,
                  padding: 10,
                  margin: 5,
                  zIndex: 100,
                }}
              >
                <Text
                  style={
                    colorScheme == "dark" ? darkMode.Title : lightMode.Title
                  }
                >
                  New Cycle
                </Text>
              </Button>
            </Box>
          ) : null}
          {
        showAlert ? (
          <Container>
            <VStack
              style={{
                backgroundColor:
                  colorScheme == "dark"
                    ? darkMode.Card.backgroundColor
                    : lightMode.Card.backgroundColor,
                borderRadius: 10,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",//flex-start
                margin: 3,
                width: '80%',
              }}
            >
              <Text
                style={
                  colorScheme == "dark" ? darkMode.Title : lightMode.Title
                }
              >Alert</Text>
             <Select 
              selectedValue={alertCat}
              minWidth={'100%'}
              size={'md'}
              backgroundColor={'blueGray.300'}
              accessibilityLabel="Select Category"
              placeholder="Select Category"
              onValueChange={(itemValue) => setAlertCat(itemValue)}
              _selectedItem={{
                bg: "blueGray.300",
                endIcon: <MaterialCommunityIcons 
                name="chevron-down" 
                size={5}
                 />
              }}
            >
              <Select.Item label="Bus" value="bus" />
              <Select.Item label="Bus and system predictions" value="predictions" />
              <Select.Item label="Bus stops" value="bus-stops" />
              <Select.Item label="New Feature" value="new-feature" />
              <Select.Item label="Other" value="other" />
            </Select>
            
{/*        
              <Input
              w={'100%'}
              onChangeText={text => setAlertTitle(text)}
               p={3} m={3} variant="filled" size="md" placeholder="Title" backgroundColor={'blueGray.300'} /> */}
              <Text
              style={
                  colorScheme == "dark" ? darkMode.Text : lightMode.Text
                }>Problem</Text>
              <Input 
              onChangeText={text => setAlertProblem(text)}
              w={'100%'}
              p={3} m={3} variant="filled" size="md" placeholder="Problem" backgroundColor={'blueGray.300'} />
                <Button
                onPress={
                  async () => {
                    const { data, error } = await supabase.from('feedback').insert([
                      {
                        title: alertTitle,
                        conv: alertProblem,
                        cat: alertCat,
                        status: alertStatus,
                      }
                    ])
                    if(error){
                      console.log(error)
                    }
                    setShowAlert(false)
                  }
                }
                >
                  Submit
                </Button>
            </VStack>
          </Container>
        ): null
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
                <MaterialCommunityIcons
                  name="check"
                  size={18}
                  color={"white"}
                />
              </Button>
            </HStack>
          ) : null}
          <Box
            style={{
              backgroundColor:
                colorScheme == "dark"
                  ? darkMode.Card.backgroundColor
                  : lightMode.Card.backgroundColor,
              width: "95%",
              justifyContent: "center",
              borderRadius: 10,
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 10,
              paddingBottom: 10,
              margin: 5,
            }}
          >
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
                    {startStopName ? (
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          color:
                            colorScheme == "dark"
                              ? darkMode.Text.color
                              : lightMode.Text.color,
                        }}
                      >
                        {startStopName}
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
                        Choose first stop
                      </Text>
                    )}
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
                    <MaterialCommunityIcons
                      name="delete"//arrow-right-thick
                      size={18}//dump-truck
                      color={
                        colorScheme == "dark"
                          ? darkMode.Text.color
                          : lightMode.Text.color
                      }
                    />
                      {/* <Text
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
                      </Text> */}
                    </Button>
                  ) : null}
                </HStack>
                <Container
                  style={{
                    // width: "100%",
                    // height: 1,
                  }}
                >
                <MaterialCommunityIcons
                    name="arrow-down"
                    size={18}
                    color={
                      colorScheme == "dark"
                        ? darkMode.Text.color
                        : lightMode.Text.color
                    }
                  />
                </Container>
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
                      <MaterialCommunityIcons
                      name="delete"//arrow-right-thick
                      size={18}//dump-truck
                      color={
                        colorScheme == "dark"
                          ? darkMode.Text.color
                          : lightMode.Text.color
                      }
                    />
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
            {runTime == false ? (
              <Button
                style={{
                  backgroundColor:
                    colorScheme == "dark"
                      ? darkMode.Button.backgroundColor
                      : lightMode.Button.backgroundColor,
                  borderRadius: 10,
                  padding: 2,
                  margin: 2,
                  zIndex: 100,
                  width: "60%",
                }}
                onPress={() => startTripSupa()}
              >
                <Text
                  style={
                    colorScheme == "dark" ? darkMode.Title : lightMode.Title
                  }
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
            ) : null}
          </HStack>
        </VStack>
      ) : null}

      {showTrips ? (
        <VStack
          style={{
            position: "absolute",
            alignContent: "center", 
            justifyContent: "center", 
            bottom: "3%",
            padding: 1, 
          }}
        >
          {showTripData ? (
            <View
              style={{
                backgroundColor:
                  colorScheme == "dark"
                    ? darkMode.Card.backgroundColor
                    : lightMode.Card.backgroundColor,
                borderRadius: 10,
                padding: 5,
                alignContent: "center",
            alignItems: "center",
                margin: 3,
              }}
            >
                <HStack space={2} alignItems="center" justifyContent="center">
                <MaterialCommunityIcons
                  name={showTripData.travel}
                  size={20}
                  color={"white"}
                />
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
                   {showTripData.id || "no id"} - {showTripData.seq}
                </Text>
              </HStack>
              <HStack space={2} alignItems="center" justifyContent="center">
                <MaterialCommunityIcons
                  name={"calendar-month-outline"}
                  size={20}
                  color={"white"}
                />
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
                   {
                    new Date(showTripData.created_at).toDateString()
                  }
                </Text>
              </HStack>
              <HStack space={2} alignItems="center" justifyContent="center">
                <MaterialCommunityIcons
                  name={"alarm"}
                  size={20}
                  color={"white"}
                />
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
                   {showTripData.trip_duration}
                </Text>
              </HStack>
              <HStack space={2} alignItems="center" justifyContent="center">
                <MaterialCommunityIcons
                  name={"bus-stop"}
                  size={20}
                  color={"white"}
                />
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
                   {showTripData.location_start.startStop || "no stop"}
                </Text>
              </HStack>
              <HStack space={2} alignItems="center" justifyContent="center">
                <MaterialCommunityIcons
                  name={"arrow-right"}
                  size={20}
                  color={"white"}
                />
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
                   {showTripData.location_start.startTime || "no departure"}
                </Text>
              </HStack>
              <HStack space={2} alignItems="center" justifyContent="center">
                <MaterialCommunityIcons
                  name={"bus-stop"}
                  size={20}
                  color={"white"}
                />
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
                   {showTripData.location_end.finalStop || "no stop"}
                </Text>
              </HStack>
              <HStack space={2} alignItems="center" justifyContent="center">
                <MaterialCommunityIcons
                  name={"arrow-right"}
                  size={20}
                  color={"white"}
                />
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
                   {
                    new Date(showTripData.location_end.endTime).toTimeString() || "no arrival"
                   }
                </Text>
              </HStack>
            </View>
          ) : null}

          {trips.length == 0 ? (
            <>
              <Button
                onPress={async () => {
                  const { data, error } = await supabase
                    .from("trips")
                    .select("*")
                    .eq("email", uid)
                    .order("id", { ascending: true });
                  if (error) {
                    console.log(error);
                  } else {
                    setTrips(data);
                  }
                  console.log(data, error);
                }}
                style={{
                  backgroundColor:
                    colorScheme == "dark"
                      ? darkMode.Card.backgroundColor
                      : lightMode.Card.backgroundColor,
                  borderRadius: 10,
                  padding: 10,

                  margin: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1,
                }}
              >
                <HStack
                
                 space={2} alignItems="center" justifyContent="center">
                  <MaterialIcons name="refresh" size={18} color={
                    colorScheme == "dark"
                    ? darkMode.Text.color
                    : lightMode.Text.color
                  }/>
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
                    Refresh Trips
                  </Text>
                </HStack>
              </Button>
              <View
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
                  No trips to show
                </Text>
              </View>
            </>
          ) : null}

          <ScrollView
          height={Dimensions.get("window").height * 0.30}
          width={Dimensions.get("window").width * 0.9}
          >
            {trips.map((trip, index) => {

              if (trip.seq == 0) {
                return (
                  <>
                  <Center key={index} >
                <HStack  
                  style={{
                    backgroundColor:
                      colorScheme == "dark"
                        ? colorsDark.secondaryColor
                        : colorsLight.secondaryColor,
                    borderRadius: 10,
                    padding: 5,
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: 3,
                    width: Dimensions.get("window").width * 0.7,
                  }}
                 >
                    <MaterialCommunityIcons
                      name={'bus-stop'}
                      size={20}
                      color={
                          colorScheme == "dark"
                            ? darkMode.Text.color
                            : lightMode.Text.color
                        }
                    />
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
                     Trip {trip.id || "no id"} 
                    </Text>
                    <Button    variant={"ghost"} style={{padding:0, margin:0}}>
                    <MaterialCommunityIcons 
                    name={"chevron-down"}
                    size={20}
                    color={
                      colorScheme == "dark"
                        ? darkMode.Text.color
                        : lightMode.Text.color
                    }/>
                    </Button>
                </HStack>
                </Center>
                <HStack  
                  style={{
                    borderRadius: 10,
                    // padding: 5,
                    justifyContent: "flex-end",
                    // alignItems: "center",
                    // margin: 3,
                    width: Dimensions.get("window").width * 0.8,
                  }}
                   >
                  <HStack  
                  style={{
                    backgroundColor:
                      colorScheme == "dark"
                        ? darkMode.Card.backgroundColor
                        : lightMode.Card.backgroundColor,
                    borderRadius: 10,
                    padding: 5,
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: 3,
                    width: Dimensions.get("window").width * 0.6,
                    
                  }}
                 > 
                    <MaterialCommunityIcons
                      name={trip.travel}
                      size={20}
                      color={
                          colorScheme == "dark"
                            ? darkMode.Text.color
                            : lightMode.Text.color
                        }
                    />
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
                      {trip.id || "no id"} - {trip.seq}
                    </Text>
                    {
                      trip.location_start.latitude && trip.location_start.longitude ?(
                        <Button 
                      onPress={
                        () => {
                          // setShowTripData(trip)
                          setSelectedSeq(trip)
                        }
                      }
                      variant={"ghost"} style={{padding:0, margin:0}}>
                      <MaterialCommunityIcons
                        name={"map-marker"}
                        size={14}
                        color={
                          colorScheme == "dark"
                            ? darkMode.Text.color
                            : lightMode.Text.color
                        }
                      />
                    </Button>
                      ): (
                        <Button 
                     
                      variant={"ghost"} style={{padding:0, margin:0}}>
                      <MaterialCommunityIcons
                        name={"map-marker-off"}
                        size={14}
                        color={
                          colorScheme == "dark"
                            ? darkMode.Text.color
                            : lightMode.Text.color
                        }
                      />
                    </Button>
                      )
                    }
                    
                   

                 
                </HStack>
                </HStack>
                </>
                );
              } else if(
                trips.length > 1 && 
                trip.seq != 0 &&
                trip.tripId == trips[index].tripId
              ){
                return (
                  <HStack key={index} 
                  style={{
                    borderRadius: 10,
                    // padding: 5,
                    justifyContent: "flex-end",
                    // alignItems: "center",
                    // margin: 3,
                    
                    width: Dimensions.get("window").width * 0.8,
                  }}
                   >
                 <HStack  
                  style={{
                    backgroundColor:
                      colorScheme == "dark"
                        ? darkMode.Card.backgroundColor
                        : lightMode.Card.backgroundColor,
                    borderRadius: 10,
                    padding: 5,
                    
                    margin: 3,
                    width: Dimensions.get("window").width * 0.6,
                    
                  }}
                 > 
                 <Stack space={0} w={'100%'} >
                 <HStack style={{
                  justifyContent: "space-between",
                    alignItems: "center",
                 }}>
                    <MaterialCommunityIcons
                      name={trip.travel}
                      size={20}
                      color={
                          colorScheme == "dark"
                            ? darkMode.Text.color
                            : lightMode.Text.color
                        }
                    />
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
                      {trip.id || "no id"} - {trip.seq}
                    </Text>
                    <Button 
                      onPress={
                        () => {
                          // setShowTripData(trip)
                          setSelectedSeq(trip)
                        }
                      }
                      variant={"ghost"} style={{padding:0, margin:0}}>
                      <MaterialCommunityIcons
                        name={"map-marker"}
                        size={14}
                        color={
                          colorScheme == "dark"
                            ? darkMode.Text.color
                            : lightMode.Text.color
                        }
                      />
                    </Button>
                    
                   
</HStack>
   <HStack style={{
      width: '100%',
      justifyContent: "space-between",
      alignItems: "center",
   }}>
     <Text style={{
                  fontSize: 12,
                  color:
                    colorScheme == "dark"
                      ? darkMode.Text.color
                      : lightMode.Text.color,
                }}>
                  {trip.location_start.startStop
                  }
                </Text>
                <Text style={{
                  fontSize: 12,
                  color:
                    colorScheme == "dark"
                      ? darkMode.Text.color
                      : lightMode.Text.color,
                }}>
                  {trip.trip_duration}
                </Text>
                <Text style={{
                  fontSize: 12,
                  color:
                    colorScheme == "dark"
                      ? darkMode.Text.color
                      : lightMode.Text.color,
                }}>
                  {trip.location_end.finalStop}
                </Text>
   </HStack>
   <HStack style={{
      width: '100%',
      justifyContent: "space-between",
      alignItems: "center",
   }}>
     <Text style={{
                  fontSize: 12,
                  color:
                    colorScheme == "dark"
                      ? darkMode.Text.color
                      : lightMode.Text.color,
                }}>
                  {
                    trip.location_start.startTime == "Invalid Date" ? (
                      new Date(trip.created_at).getHours() + ":" + new Date(trip.created_at).getMinutes() + "-" + new Date(trip.created_at).getDate() + "/" + new Date(trip.created_at).getMonth() + "/" + new Date(trip.created_at).getFullYear()
                    ) : (
                      trip.location_start.startTime
                    )
                    
                  }
                </Text>
               
                <Text style={{
                  fontSize: 12,
                  color:
                    colorScheme == "dark"
                      ? darkMode.Text.color
                      : lightMode.Text.color,
                }}>
                  {
                    trip.location_end.endTime == "Invalid Date" ? (
                      null
                    ) : (
                      trip.location_end.endTime
                    )
                    
                  }
                </Text>
   </HStack>
</Stack>
                 
                </HStack>
                </HStack>
                )
              }
            })}
          </ScrollView>


        </VStack>
      ) : null}
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
