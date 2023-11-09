import * as Location from "expo-location";
import * as MapVal from "../assets/map.json";

import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import {
  Box,
  Button,
  Divider,
  FlatList,
  HStack,
  Icon,
  ScrollView,
  Stack,
  Text,
  VStack,
} from "native-base";
import {
  Callout,
  CalloutSubview,
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";
import { Camera, CameraType } from "expo-camera";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { colorsDark, colorsLight, darkMode, lightMode } from "../config";
import {
  getOnlineById,
  getPosition,
  getStopTime,
  getTrip,
} from "../components/URLFetcher";
import { getRouteColor, getRoutes } from "../assets/gtfs/route";
import { getStopById, getStops } from "../assets/gtfs/stops";

import { FlashList } from "@shopify/flash-list";
import MapView from "react-native-map-clustering";
import { P } from "@expo/html-elements";
import { Platform } from "react-native";
import { RightSideMenu } from "../components/RightSideMenu.jsx";
import Shapes from "../assets/gtfs/shapes.json";
import { StopRender } from "../components/OBAFetches/StopRender";
import {TimeArrivalReturn} from '../components/TimeArrivalReturn'
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import openMap from "react-native-open-maps";
import { supabase } from "../utils/supabase";
import { useStopwatch } from "react-timer-hook";

const pngStop = require("../assets/BusStop.png");

export const MapScreen = () => {
  const colorScheme = useColorScheme();
  const [seq, setSeq] = useState(0);
  const [menu, setMenu] = useState("main");
  const [location, setLocation] = useState(null);
  const [selectedSeq, setSelectedSeq] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [startStopName, setStartStopName] = useState(null);
  const [finalStopName, setFinalStopName] = useState(null);
  const [selectedStopName, setSelectedStopName] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [travelingBy, setTravelingBy] = useState("bus");
  const [startStop, setStartStop] = useState(null);
  const [finalStop, setFinalStop] = useState(null);
  const [lastTripId, setLastTripId] = useState(0);
  const memoRt = React.useMemo(() => Shapes, []);
  const memoStop = React.useMemo(() => getStops(), []);
  const [selectTraveler, setSelectTraveler] = useState(false);
  const [runTime, setRunTime] = useState(false);
  const [startLocData, setStartLocData] = useState(null);
  const [uid, setUid] = useState(null);
  const [mark, setMark] = useState(null);
  const [backLoc, setBackLoc] = useState([]);
  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });
  const [rate, setRate] = useState(0);
  const [tripTime, setTripTime] = useState(0);
  const memo = useMemo(() => getTime(), [hours, minutes, seconds]);
  // const timememo = useMemo(() => getStopTime(startStop), []);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertProblem, setAlertProblem] = useState("");
  const [alertCat, setAlertCat] = useState("");
  const [alertStatus, setAlertStatus] = useState(1);
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }
  const [expFade, setExpFade] = useState("transparent");

  async function getTime() {
    const h = hours > 9 ? hours : "0" + hours;
    const m = minutes > 9 ? minutes : "0" + minutes;
    const s = seconds > 9 ? seconds : "0" + seconds;
    setTripTime(h + ":" + m + ":" + s);
    return h + ":" + m + ":" + s;
  }
  const [trips, setTrips] = useState(null);
  let foregroundSubscription = null;
  async function newCoords() {
    try {
      if (
        uid != null &&
        lastTripId != null &&
        seq != null &&
        selectedRoute != null &&
        startStopName != null &&
        travelingBy != null &&
        location.coords.latitude != null
      ) {
        const url =
          "https://www.api.proba.live/genUserLoc?userId=" +
          uid +
          "&tripId=" +
          lastTripId +
          "&tripSequence=" +
          seq +
          "&routeId=" +
          "00" +
          "&busId=" +
          "0" +
          "&stopId=" +
          startStopName +
          "&predictionTime=" +
          "0" +
          "&device=0&deviceTime=0&transportationBy=" +
          travelingBy +
          "&lat=" +
          location.coords.latitude +
          "&lon=" +
          location.coords.longitude;

        await fetch(url)
          .then((response) => response.json())
          .then((json) => {
            console.log("fetch");
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } catch (error) {
      console.log(error);
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
          Alert.alert("map update has been submited");
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
          async (location) => {
            // if(seconds % 6 == 0){
            //   setBackLoc(backLoc => [...backLoc, [location.coords.latitude, location.coords.longitude]])
            // }
            // check no nulll values

            setLocation(location);
          }
        );
      }
    })();
  }, [uid, location]);

  function TextLocale({ time }) {
    const newTime = new Date(time);

    if (
      newTime.getDate() == new Date().getDate() &&
      newTime.getMonth() == new Date().getMonth() &&
      newTime.getFullYear() == new Date().getFullYear()
    ) {
      return <Text>{newTime.getHours() + ":" + newTime.getMinutes()}</Text>;
    } else {
      return (
        <Text>
          {newTime.getDate() +
            "/" +
            newTime.getMonth() +
            "/" +
            newTime.getFullYear()}
        </Text>
      );
    }
  }

  async function getTrips() {
    const {
      data: { datas },
    } = await supabase
      .from("trips")
      .select("*")
      .eq("email", uid)
      .order("id", { ascending: false });
    if (datas) {
      console.log(datas);
      setTrips(datas);
    }
  }

  function getDirs() {
    if (travelingBy == "walk") {
      return "walk";
    } else if (travelingBy == "car") {
      return "drive";
    } else if (travelingBy == "scooter") {
      return "drive";
    }
  }
  function ShowStopTime({ stopId }) {
    // let val = getStopTime(stopId)
    console.log(timememo);
    // if(val){
    //   return <Text>{val}</Text>
    // }
    // else{
    //   return <Text>Not Available</Text>
    // }
  }
  function returnStop(stopId, stopName) {
    if (
      selectedSeq != null &&
      selectedSeq.location_start.startStop == stopName
    ) {
      return (
        <>
          <Image
            source={require("../assets/busStopArrival.png")}
            style={{ height: 40, width: 40 }}
          />
          <Callout
            style={{
              width: 250,
              zIndex: 100,
              borderRadius: 10,
            }}
          >
            <HStack justifyContent={"space-between"}>
              <Stack>
                <Text>{stopName}</Text>
                <Text>{stopId}</Text>
              </Stack>
              <CalloutSubview
                onPress={() => {
                  if (Platform.OS == "android") {
                    openMap({
                      latitude: getStopById(startStop).lat,
                      longitude: getStopById(startStop).lon,
                      query: stopName,
                      travelType: getDirs(),
                      provider: "google",
                    });
                  } else if (Platform.OS == "ios") {
                    openMap({
                      latitude: getStopById(startStop).lat,
                      longitude: getStopById(startStop).lon,
                      query: stopName,
                      travelType: getDirs(),
                      provider: "apple",
                    });
                  }
                }}
              >
                <MaterialCommunityIcons
                  name={"google-maps"}
                  size={24}
                  backgroundColor={"transparent"}
                  color={
                    colorScheme == "dark"
                      ? colorsDark.textColor
                      : colorsLight.textColor
                  }
                />
              </CalloutSubview>
            </HStack>
          </Callout>
        </>
      );
    } else if (
      selectedSeq != null &&
      selectedSeq.location_end.finalStop == stopName
    ) {
      return (
        <>
          <Image
            source={require("../assets/busStopArrival.png")}
            style={{ height: 40, width: 40 }}
          />
          <Callout
            style={{
              width: 250,
              zIndex: 100,
              borderRadius: 10,
            }}
          >
            <HStack justifyContent={"space-between"}>
              <Stack>
                <Text>{stopName}</Text>
                <Text>{stopId}</Text>
              </Stack>
              <CalloutSubview
                onPress={() => {
                  if (Platform.OS == "android") {
                    openMap({
                      latitude: getStopById(startStop).lat,
                      longitude: getStopById(startStop).lon,
                      query: stopName,
                      travelType: getDirs(),
                      provider: "google",
                    });
                  } else if (Platform.OS == "ios") {
                    openMap({
                      latitude: getStopById(startStop).lat,
                      longitude: getStopById(startStop).lon,
                      query: stopName,
                      travelType: getDirs(),
                      provider: "apple",
                    });
                  }
                }}
              >
                <MaterialCommunityIcons
                  name={"google-maps"}
                  size={24}
                  backgroundColor={"transparent"}
                  color={
                    colorScheme == "dark"
                      ? colorsDark.textColor
                      : colorsLight.textColor
                  }
                />
              </CalloutSubview>
            </HStack>
          </Callout>
        </>
      );
    }
    if (stopId == startStop) {
      return (
        <>
          <Image
            source={require("../assets/busStop1.png")}
            style={{ height: 40, width: 40 }}
          />
          <Callout
            style={{
              width: 250,
              zIndex: 100,
              borderRadius: 10,
            }}
          >
            <HStack justifyContent={"space-between"}>
              <Stack>
                <Text>{stopName}</Text>
                <Text>{stopId}</Text>
              </Stack>
              {/* <HStack space={1}>
            <Button>
              <MaterialCommunityIcons 
              name={'google-maps'}
              size={24}
              backgroundColor={'transparent'}
              color={colorScheme == 'dark' ? colorsDark.textColor : colorsLight.textColor}
              onPress={() => {
                openMap({latitude: getStopById(startStop).lat , longitude: getStopById(startStop).lon, query: stopName, travelType: getDirs(), provider: 'google' })
              }
              }
              />
              
            </Button>
            <Button>
              <MaterialCommunityIcons 
              name={'directions'}
              size={24}
              backgroundColor={'transparent'}
              color={colorScheme == 'dark' ? colorsDark.textColor : colorsLight.textColor}
              onPress={() => {
                openMap({latitude: getStopById(startStop).lat , longitude: getStopById(startStop).lon, query: stopName, travelType: getDirs(), provider: 'apple' })
              }
              }
              />
              
            </Button>
            </HStack> */}
              <CalloutSubview
                onPress={() => {
                  if (Platform.OS == "android") {
                    openMap({
                      latitude: getStopById(startStop).lat,
                      longitude: getStopById(startStop).lon,
                      query: stopName,
                      travelType: getDirs(),
                      provider: "google",
                    });
                  } else if (Platform.OS == "ios") {
                    openMap({
                      latitude: getStopById(startStop).lat,
                      longitude: getStopById(startStop).lon,
                      query: stopName,
                      travelType: getDirs(),
                      provider: "apple",
                    });
                  }
                }}
              >
                <MaterialCommunityIcons
                  name={"google-maps"}
                  size={24}
                  backgroundColor={"transparent"}
                  color={
                    colorScheme == "dark"
                      ? colorsDark.textColor
                      : colorsLight.textColor
                  }
                />
              </CalloutSubview>
            </HStack>
          </Callout>
        </>
      );
    } else if (stopId == finalStop) {
      return (
        <>
          <Image
            source={require("../assets/busStop2.png")}
            style={{ height: 40, width: 40 }}
          />
          <Callout
            style={{
              width: 200,
              zIndex: 100,
              borderRadius: 10,
            }}
          >
            <Text>{stopName}</Text>
            <Text>{stopId}</Text>
          </Callout>
        </>
      );
    } else {
      return (
        <>
          <Image
            source={require("../assets/BusStop.png")}
            style={{ height: 40, width: 40 }}
          />
          <Callout
            style={{
              width: 200,
              zIndex: 100,
              borderRadius: 10,
            }}
          >
            <Text>{stopName}</Text>
            <Text>{stopId}</Text>
          </Callout>
        </>
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
            startTime: d1.toLocaleString(),
          },
          location_end: {
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
            finalStop: finalStopName,
            endTime: d2.toLocaleString(),
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
      if (seq == 0) {
        setLastTripId(data[0].id);
      }
      // reset();
      console.log(data);
    }

    if (error) {
      console.log(error);
    }
  }
  const [startCamera, setStartCamera] = useState(false);

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      // start the camera
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  };
  const __takePicture = async () => {
    if (!camera) return;
    const photo = await camera.takePictureAsync();
  };
  async function submitTripSupa() {
    const d1 = new Date(startLocData?.timestamp);
    const d2 = new Date(location?.timestamp);

    const { data, error } = await supabase.from("trips").insert([
      {
        location_start: {
          latitude: startLocData?.coords.latitude,
          longitude: startLocData?.coords.longitude,
          startStop: startStop,
          startTime: d1.toLocaleString(),
        },
        location_end: {
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
          finalStop: finalStop,
          endTime: d2.toLocaleString(),
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
      setMenu("main");
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
          setLastTripId(0);
        }
      }
    });
  }
  function getRouteWidth(routeId) {
    // if route is start Stop

    if (
      startStop &&
      finalStop &&
      (startStop.includes(routeId) || finalStop.includes(routeId))
    ) {
      return 5;
    }
    // if route is selected route
    else if (selectedRoute && selectedRoute.includes(routeId)) {
      return 5;
    }
    // if route is not selected
    else {
      return 2;
    }
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
        onPress={(e) => {
          if (
            travelingBy == "walk" ||
            travelingBy == "car" ||
            travelingBy == "scooter"
          ) {
            setMark({
              lat: e.nativeEvent.coordinate.latitude,
              lon: e.nativeEvent.coordinate.longitude,
            });
          }
        }}
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
          if (runTime && route.id.includes(selectedRoute)) {
            return (
              <Polyline
                key={index}
                coordinates={getShapeByRouteId(route.id)}
                strokeColor={getRouteColor(route.id)}
                strokeWidth={getRouteWidth(route.id)}
              />
            );
          } else {
            return (
              <Polyline
                key={index}
                coordinates={getShapeByRouteId(route.id)}
                strokeColor={getRouteColor(route.id)}
                strokeWidth={getRouteWidth(route.id)}
              />
            );
          }
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
                if(stop.name.length > 19) {
                  setSelectedStopName(stop.name.slice(0, 19) + "...")
                } else { 
                setSelectedStopName(stop.name);

                }
              }}
            >
              {returnStop(stop.id, stop.name)}
            </Marker>
          );
        })}

        {mark ? (
          <Marker
            zIndex={10}
            coordinate={{
              latitude: mark.lat,
              longitude: mark.lon,
            }}
          />
        ) : null}
        {backLoc ? (
          <Polyline
            coordinates={backLoc}
            strokeColors={["#adfc", "#4f44"]}
            strokeWidth={6}
          />
        ) : null}
      </MapView>
      {/* Modal overlay */}
      <Box
        style={{
          width: "90%",
          height: "100%",
          height: "35%",
          position: "absolute",
          top: "50%",
          backgroundColor: "transparent",
        }}
      >
       <HStack padding={2} justifyContent={'space-between'}  >
       <Button
            backgroundColor={ colorsLight.secondaryColor }
            borderRadius={10}
            m={1}
            // p={2}
            onPress={() => 
              {
          setMenu('stops')
          }
            }
          >
           <Text style={{color: 'black'}}>Show Stops</Text>
          </Button>
       <HStack
          space={2}
          alignItems="center"
          // padding={3}
          justifyContent={"flex-end"}
        >
          {/* bubble option menu */}
          <Button
            backgroundColor={'#BF2834' }
            borderRadius={10}
            onPress={() => 
              {
            // console.log(location);
            _mapRef.current.animateToRegion(
              {
                latitude: location.coords?.latitude,
                longitude: location.coords?.longitude,
                latitudeDelta: 0.0092,
                longitudeDelta: 0.0091,
              },
              1000
            );
          }
            }
          >
            <Icon
              size={"md"}
              as={<MaterialCommunityIcons name="map-marker-account" />}
              color="black"
            />
          </Button>
          <Button
            backgroundColor={
             '#FACA2D'
            }
            borderRadius={10}
            onPress={() => setMenu("camera")}
          >
            <Icon
              size={"md"}
              as={<MaterialCommunityIcons name="camera" />}
              color="black"
            />
          </Button>
          <Button
            backgroundColor={'#36B24A' }
            borderRadius={10}
            onPress={() => setMenu("main")}
          >
            <Icon
              size={"md"}
              as={<MaterialCommunityIcons name="ticket" />}
              color="black"
            />
          </Button>
        
        </HStack>
       </HStack>
        {menu == "main" ? (
          <Box
            style={{
              borderRadius: 10,
              backgroundColor: colorsLight.backgroundColor,
            }}
          >
            <HStack
              space={2}
              alignItems="center"
              padding={3}
              justifyContent={"flex-start"}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Create Trip
              </Text>
            </HStack>

            <HStack
              space={2}
              alignItems="center"
              paddingLeft={4}
              justifyContent={"flex-start"}
            >
              <Button
                borderRadius={10}
                backgroundColor={
                  travelingBy == "bus"
                    ? colorsLight.primaryColor
                    : colorsLight.secondaryColor
                }
                onPress={() => setTravelingBy("bus")}
              >
                <Icon
                  size={"md"}
                  as={<MaterialCommunityIcons name="bus" />}
                  color="black"
                />
              </Button>
              <Button
                borderRadius={10}
                backgroundColor={
                  travelingBy == "walk"
                    ? colorsLight.primaryColor
                    : colorsLight.secondaryColor
                }
                onPress={() => setTravelingBy("walk")}
              >
                <Icon
                  size={"md"}
                  as={<MaterialCommunityIcons name="walk" />}
                  color="black"
                />
              </Button>
              <Button
                borderRadius={10}
                backgroundColor={
                  travelingBy == "car"
                    ? colorsLight.primaryColor
                    : colorsLight.secondaryColor
                }
                onPress={() => setTravelingBy("car")}
              >
                <Icon
                  size={"md"}
                  as={<MaterialCommunityIcons name="car" />}
                  color="black"
                />
              </Button>
              <Button
                borderRadius={10}
                backgroundColor={
                  travelingBy == "scooter"
                    ? colorsLight.primaryColor
                    : colorsLight.secondaryColor
                }
                onPress={() => setTravelingBy("scooter")}
              >
                <Icon
                  size={"md"}
                  as={<MaterialCommunityIcons name="scooter" />}
                  color="black"
                />
              </Button>
            </HStack>
            {/* list for active stop predictions and route */}
            {/* hstack space between */}
            <HStack
              space={2}
              padding={2}
              width={"100%"}
              alignItems="center"
              justifyContent={"space-between"}
            >
              <VStack space={0} alignItems="flex-start">
                <Text style={{ fontSize: 14 }}>
                  First Stop: {startStop || selectedStop}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  P1 - {startStopName || selectedStopName || "Select a Stop"}
                </Text>
              </VStack>
              <HStack space={1} alignItems="flex-start">
                {startStop == null ? (
                  <Button
                    borderColor={"transparent"}
                    variant={"outline"}
                    onPress={
                      // set selected stop to start stop
                      () => {
                        setStartStop(selectedStop);
                        if(selectedStopName.length > 19) {
                          setStartStopName(selectedStopName.slice(0, 19) + "...")
                        }else {

                        setStartStopName(selectedStopName);
                        }
                      }
                    }
                  >
                    <Icon
                      size={"md"}
                      as={<MaterialIcons name="check" />}
                      color="black"
                    />
                  </Button>
                ) : null}
                <Button
                  borderColor={"transparent"}
                  variant={"outline"}
                  onPress={() => setStartStop(null)}
                >
                  <Icon
                    size={"md"}
                    as={<MaterialIcons name="cancel" />}
                    color="black"
                  />
                </Button>
              </HStack>
            </HStack>
            {startStop != null ? (
              <>
                <Divider margin={2} />
                <HStack
                  space={2}
                  padding={2}
                  paddingBottom={"4"}
                  width={"100%"}
                  alignItems="center"
                  justifyContent={"space-between"}
                >
                  <VStack space={0} alignItems="flex-start">
                    <Text style={{ fontSize: 14 }}>
                      Final Stop: {finalStop || selectedStop}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                      P2 - {finalStopName || selectedStopName}
                    </Text>
                  </VStack>
                  <HStack space={1} alignItems="flex-start">
                    {finalStop == null ? (
                      <Button
                        borderColor={"transparent"}
                        variant={"outline"}
                        onPress={
                          // set selected stop to start stop
                          () => {
                            setFinalStop(selectedStop);
                            if(selectedStopName.length > 19) {
                              setFinalStopName(selectedStopName.slice(0, 19) + "...")
                            }else {
                            setFinalStopName(selectedStopName);
                            }
                          }
                        }
                      >
                        <Icon
                          size={"md"}
                          as={<MaterialIcons name="check" />}
                          color="black"
                        />
                      </Button>
                    ) : null}
                    <Button
                      borderColor={"transparent"}
                      variant={"outline"}
                      onPress={() => setFinalStop(null)}
                    >
                      <Icon
                        size={"md"}
                        as={<MaterialIcons name="cancel" />}
                        color="black"
                      />
                    </Button>
                  </HStack>
                </HStack>
              </>
            ) : null}
          </Box>
        ) : null}
        {menu == "camera" ? (
          <Box
            style={{
              borderRadius: 10,
              backgroundColor: colorsLight.backgroundColor,
            }}
          >
            <Camera
              style={{
                width: "100%",
                height: "100%",
              }}
              type={type}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  padding: 20,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  position: "absolute",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: colorsLight.primaryColor,
                    borderRadius: 10,
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={__takePicture}
                >
                  <Text
                    style={{
                      color: colorsLight.textColor,
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    Snap
                  </Text>
                </TouchableOpacity>
              </View>
            </Camera>
          </Box>
        ) : null}
        {menu == "stops" ? (
          <Box
            style={{
              borderRadius: 10,
              backgroundColor: colorsLight.backgroundColor,
            }}
          >
            <HStack
              space={2}
              alignItems="center"
              padding={3}
              justifyContent={"flex-start"}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Stops
              </Text>
            </HStack>
             <TimeArrivalReturn stops={memoStop} startStop={startStop} finalStop={finalStop} />
            

          
          </Box>
        ) : null}
        {menu == "activeTrip" ? (
          <Box
            style={{
              borderRadius: 10,
              backgroundColor: colorsLight.backgroundColor,
            }}
          >
            <HStack
              space={2}
              alignItems="center"
              padding={3}
              justifyContent={"flex-start"}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Active Trip
              </Text>
            </HStack>

            {/* list for active stop predictions and route */}
            {/* hstack space between */}
            <HStack
              space={2}
              padding={2}
              width={"100%"}
              alignItems="center"
              justifyContent={"space-between"}
            >
              <VStack space={0} alignItems="flex-start">
                <Text style={{  fontSize: 14  }}>
                  Time: {tripTime || "00:00:00"}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  From: {startStopName || "Select a Stop"}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                To: {finalStopName || "Select a Stop"}
                </Text>


              </VStack>
            </HStack>
          
          </Box>
        ) : null}
        {startStop != null && finalStop != null ? (
          <HStack
            space={2}
            padding={2}
            width={"100%"}
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Button
              borderRadius={10}
              backgroundColor={colorsLight.primaryColor}
              onPress={() => {
                startTripSupa()
                start();
                setMenu("activeTrip");
              }}
            >
              <Icon
                size={"md"}
                as={<MaterialCommunityIcons name="play" />}
                color="black"
              />
              <Text>Start Trip </Text>
            </Button>
            <Button
              borderRadius={10}
              backgroundColor={colorsLight.primaryColor}
              onPress={() => continueTripSupa()}
            >
              <Icon
                size={"md"}
                as={<MaterialCommunityIcons name="bus-stop" />}
                color="black"
              />
              <Text>Add Stop </Text>
            </Button>
            <Button
              borderRadius={10}
              backgroundColor={colorsLight.primaryColor}
              onPress={() => submitTripSupa()}
            >
              <Icon
                size={"md"}
                as={<MaterialCommunityIcons name="stop" />}
                color="black"
              />
              <Text>Stop Trip </Text>
            </Button>
          </HStack>
        ) : null}
      </Box>
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
    backgroundColor: colorsLight.primaryColor,
   
  },
  stopListTitle: {
    fontSize: 15, //hykj8LmMrfnx
    fontWeight: "bold",
    color: "black",
  },
  stopListDescription: {
    fontSize: 12,
    color: "black",
  },
  stopListContainer: {
    padding: 5,
    margin: 5,
    borderRadius: 10,
    width: '90%',

    // maxHeight: Dimensions.get("window").height * 0.2,
    backgroundColor: colorsLight.secondaryColor ,
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
  outer: {
    padding: "10px",
    overflowY: "hidden",
    width: "100%",
    height: "100%",
    border: "1px solid red",
    // width: 400px;
    // height: 90%;
    // border: 1px solid blue;
  },
  flexContainer: {
    overflowX: "auto",
    height: "100%",
    paddingBottom: "17px",
    display: "flex",
    flexWrap: "nowrap",
    // overflow-x: auto;
    // height: calc(100% + 17px);
    // padding-bottom: 17px;
    // display: flex;
    // flex-wrap: nowrap;
  },
  card: {
    flex: 1,
    height: 150,
    display: "inline-block",
    margin: 5,
    border: "1px solid",
    // flex: 1 0 100px;
    // height: 150px;
    // display: inline-block;
    // margin: 5px;
    // border: 1px solid;
  },
});
