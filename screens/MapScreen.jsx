import * as Location from "expo-location";
import * as MapVal from "../assets/map.json";

import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  FlatList,
  HStack,
  Input,
  ScrollView,
  SectionList,
  Select,
  Stack,
  Text,
  VStack,
  ZStack,
} from "native-base";
import { Callout, CalloutSubview, Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { colorsDark, colorsLight, darkMode, lightMode } from "../config";
import { getOnlineById, getPosition, getStopTime } from "../components/URLFetcher";
import { getRouteColor, getRoutes } from "../assets/gtfs/route";
import { getStopById, getStops } from "../assets/gtfs/stops";

import MapView from "react-native-map-clustering";
import { P } from "@expo/html-elements";
import { Platform } from "react-native";
import Shapes from "../assets/gtfs/shapes.json";
import { StopRender } from "../components/OBAFetches/StopRender";
import openMap from 'react-native-open-maps';
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

const [expFade, setExpFade] = useState('transparent')

  async function getTime() {
    const h = hours > 9 ? hours : "0" + hours;
    const m = minutes > 9 ? minutes : "0" + minutes;
    const s = seconds > 9 ? seconds : "0" + seconds;
    setTripTime(h + ":" + m + ":" + s);
    return h + ":" + m + ":" + s;
  }
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

  // setInterval(() => {
  //   if(location != null){
  //     setBackLoc(backLoc => [...backLoc, [location.coords.latitude, location.coords.longitude]])
  //     console.log(backLoc.length)
  //   }
  // }, 5000)

 

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

  function getDirs(){
    if(travelingBy == 'walk'){
      return 'walk'
    }
    else if(travelingBy == 'car'){
      return 'drive'
    }
    else if(travelingBy == 'scooter'){
      return 'drive'
    }
  }
  function ShowStopTime({stopId}){
    // let val = getStopTime(stopId)
    console.log(timememo)
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
           <HStack justifyContent={'space-between'} >
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
            <CalloutSubview onPress={() => {
              if (Platform.OS == 'android'){
                openMap({latitude: getStopById(startStop).lat , longitude: getStopById(startStop).lon, query: stopName, travelType: getDirs(), provider: 'google' })
              } else if(Platform.OS == 'ios'){
                openMap({latitude: getStopById(startStop).lat , longitude: getStopById(startStop).lon, query: stopName, travelType: getDirs(), provider: 'apple' })

              }
            } }>
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
           <HStack justifyContent={'space-between'} >
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
            <CalloutSubview onPress={() => {
              if (Platform.OS == 'android'){
                openMap({latitude: getStopById(startStop).lat , longitude: getStopById(startStop).lon, query: stopName, travelType: getDirs(), provider: 'google' })
              } else if(Platform.OS == 'ios'){
                openMap({latitude: getStopById(startStop).lat , longitude: getStopById(startStop).lon, query: stopName, travelType: getDirs(), provider: 'apple' })

              }
            } }>
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
           <HStack justifyContent={'space-between'} >
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
            <CalloutSubview onPress={() => {
              if (Platform.OS == 'android'){
                openMap({latitude: getStopById(startStop).lat , longitude: getStopById(startStop).lon, query: stopName, travelType: getDirs(), provider: 'google' })
              } else if(Platform.OS == 'ios'){
                openMap({latitude: getStopById(startStop).lat , longitude: getStopById(startStop).lon, query: stopName, travelType: getDirs(), provider: 'apple' })

              }
            } }>
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
function getRouteWidth (routeId){
  // if route is start Stop

  if (startStop && finalStop && (startStop.includes(routeId) || finalStop.includes(routeId))){
    return 5
  }
  // if route is selected route
  else if(selectedRoute && (selectedRoute.includes(routeId))){
    return 5
  }
  // if route is not selected
  else{
    return 2
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
        if(travelingBy == 'walk' ||
        travelingBy == "car" ||
        travelingBy == "scooter" 
        ){
          setMark({
            lat: e.nativeEvent.coordinate.latitude,
            lon: e.nativeEvent.coordinate.longitude
          })
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
          if(runTime && route.id.includes(selectedRoute) ){
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
                setSelectedStopName(stop.name);
              }}
            >
              {returnStop(stop.id, stop.name)}
            </Marker>
          );
        })}






        {
          mark ? (
            <Marker
              zIndex={10}
              coordinate={{
                latitude: mark.lat,
                longitude: mark.lon,
              }}
            />
          ) : null
          
        }
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
          top: "20%",
          padding: 2,
          right: "1%",
          backgroundColor: "transparent",
        }}
      >
        {/* <Button
          onPress={() => {
              // setShowTrips(!showTrips); 
            setSelectTraveler(!selectTraveler);
            // setShowTrips(false)
          }}
          style={{
            zIndex: 100,
            margin: 2,
            padding: 2,
            borderRadius: 10,
            maxHeight: 50,
            maxWidth: 50,
            backgroundColor: "#1DA15D",
          }}
        >
          <MaterialCommunityIcons
            name={travelingBy}
            size={24}
            color={
              colorScheme == "dark" ? colorsDark.backgroundColor : colorsLight.backgroundColor
            }
          />
        </Button> */}
        <Button
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
            // name={"book-open-page-variant-outline"}
            name="map-marker-question"
            size={24}
            color={
              colorScheme == "dark"
                ? colorsDark.backgroundColor
                : colorsLight.backgroundColor
            }
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
          <MaterialCommunityIcons
            name={"camera"}
            size={24}
            color={
              colorScheme == "dark"
                ? colorsDark.backgroundColor
                : colorsLight.backgroundColor
            }
          />
        </Button>

        <Button
          onPress={() => {
            // setSelectTraveler(!selectTraveler);
            setMenu("alert");
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
            color={
              colorScheme == "dark"
                ? colorsDark.backgroundColor
                : colorsLight.backgroundColor
            }
          />
        </Button>
        <Button
          onPress={() => {
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
            name={"map-marker-account"}
            size={24}
            color={
              colorScheme == "dark"
                ? colorsDark.backgroundColor
                : colorsLight.backgroundColor
            }
          />
        </Button>
      </VStack>

      {/* Modal overlay */}

     

      {menu == "main" ? (
        <Container
          backgroundColor={
            colorScheme == "dark"
              ? colorsDark.backgroundColor
              : colorsLight.backgroundColor
          }
          top={Dimensions.get("window").height * 0.7}
          padding={2}
          borderRadius={10}
          shadow={2}
        >
          <Center>
            <HStack space={2} padding={2}>
              <Button
                w={"100%"}
                leftIcon={<MaterialCommunityIcons name={'ticket-confirmation-outline'} size={24} color={colorScheme == 'dark' ? colorsDark.textColor : colorsLight.textColor} />}

                onPress={() => {
                  setMenu("trip");
                }}
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
              >
                <Text bold fontSize={"md"}
                >Start Trip</Text>
              </Button>
              {/* <Button
                w={"50%"}
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
                onPress={() => {
                  setMenu("travel");
                }}
              >
                <Text  bold fontSize={"md"}>Travel</Text>
              </Button> */}
            </HStack>
            <HStack space={2} padding={2}>
              <Button
                w={"50%"}
                onPress={() => {
                  setMenu("stats");
                }}
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
              >
                <Text bold fontSize={"md"}>Show Stats</Text>
              </Button>
              <Button
                w={"50%"}
                onPress={() => {
                  setMenu("history");
                }}
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
              >
                <Text bold fontSize={"md"}>History</Text>
              </Button>
            </HStack>
          </Center>
        </Container>
      ) : null}
      {menu == "trip" ? (
       <Box 
        backgroundColor={
          colorScheme == "dark"
            ? colorsDark.backgroundColor
            : colorsLight.backgroundColor
        }
                  top={Dimensions.get("window").height * 0.7}

        width={"100%"}
       >
       <Box
       >
       <ZStack
          // top={Dimensions.get("window").height * 0.7}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {selectTraveler ? (
            <HStack
              zIndex={100}
              bottom={Dimensions.get("window").height * 0.15}
              // right={Dimensions.get("window").width * 0.02}
             
              borderRadius={5}
              p={2}
              space={1}
              alignItems={"center"}
            
            >
              <Button
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
                onPress={() => {
                  setSelectTraveler(false);
                }}
              >
                <MaterialCommunityIcons
                  name={"close"}
                  size={24}
                  color={
                    colorScheme == "dark"
                      ? colorsDark.textColor
                      : colorsLight.textColor
                  }
                />
              </Button>
              <Button
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
                onPress={() => {
                  setTravelingBy("car");
                  setSelectTraveler(false);
                }}
              >
                <MaterialCommunityIcons
                  name={"car"}
                  size={24}
                  color={
                    colorScheme == "dark"
                      ? colorsDark.textColor
                      : colorsLight.textColor
                  }
                />
              </Button>
              <Button
                backgroundColor={
                  colorScheme == "walk"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
                onPress={() => {
                  setTravelingBy("scooter");
                  setSelectTraveler(false);
                }}
              >
                <MaterialCommunityIcons
                  name={"scooter"}
                  size={24}
                  color={
                    colorScheme == "dark"
                      ? colorsDark.textColor
                      : colorsLight.textColor
                  }
                />
              </Button>
              <Button
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
                onPress={() => {
                  setTravelingBy("walk");
                  setSelectTraveler(false);
                }}
              >
                <MaterialCommunityIcons
                  name={"walk"}
                  size={24}
                  color={
                    colorScheme == "dark"
                      ? colorsDark.textColor
                      : colorsLight.textColor
                  }
                />
              </Button>
              <Button
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
                onPress={() => {
                  setTravelingBy("bus");
                  setSelectTraveler(false);
                }}
              >
                <MaterialCommunityIcons
                  name={"bus"}
                  size={24}
                  color={
                    colorScheme == "dark"
                      ? colorsDark.textColor
                      : colorsLight.textColor
                  }
                />
              </Button>
            </HStack>
          ) : null}
         
            <Box
              width={"90%"}
              backgroundColor={
              colorScheme == "dark"
                ? colorsDark.backgroundColor
                : colorsLight.backgroundColor
            }
            borderRadius={5}
            shadow={1}
            >
            
            <Box  
            
            backgroundColor={
              colorScheme == "dark"
                ? colorsDark.backgroundColor
                : colorsLight.backgroundColor
            } 
            
            >
          
              <Box margin={1}    >
              {/* <Box margin={1}   backgroundColor={'blue.100'} > */}
              <ZStack marginBottom={'10'} >
              
                {/* <Box 
                  borderColor={
                    colorScheme == "dark"
                      ? colorsDark.backgroundColor
                      : colorsLight.backgroundColor
                  }
                  borderRadius={1}
                  borderWidth={10}
                />
                 <Box 
                  borderColor={
                    colorScheme == "dark"
                      ? colorsDark.backgroundColor
                      : colorsLight.backgroundColor
                  }
                  borderRadius={25}
                  borderWidth={13}
                /> */}
                
              <HStack
                zIndex={110}
                space={2}
                padding={2}
                justifyContent={"space-between"}
                alignItems={"center"}
                width={"100%"}
                borderRadius={5}
              >
                <Button
                  p={1}
                  m={1}
                  variant="ghost"
                  onPress={() => {
                    setMenu("main");
                  }}
                >
                  <MaterialIcons
                    name="arrow-back"
                    size={24}
                    color={
                      colorScheme == "dark"
                        ? colorsDark.textColor
                        : colorsLight.textColor
                    }
                    onPress={() => {
                      setMenu("main");
                    }}
                  />
                </Button>

                <Button
                  p={1}
                  m={1}
                  variant="ghost"
                  onPress={() => {
                    setSelectTraveler(!selectTraveler);
                  }}
                >
                  <HStack justifyContent={"center"} alignItems={"center"}>
                    <Text bold fontSize={12}>
                      traveling by:{" "}
                    </Text>
                    <MaterialCommunityIcons
                      name={travelingBy}
                      size={24}
                      color={
                        colorScheme == "dark"
                          ? colorsDark.textColor
                          : colorsLight.textColor
                      }
                    />
                  </HStack>
                </Button>
              </HStack>
              </ZStack>
             
          
            {
              travelingBy == "bus" ? (
                <><HStack
                      space={2}
                      padding={1}
                      margin={1}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      width={"95%"}
                    >
                      <Stack space={0} alignItems={"flex-start"}>
                        <Text fontSize={12} color={"gray.500"} bold>
                          First Stop
                        </Text>
                        {selectedStopName && startStopName != null ? (<Text bold fontSize={16}>
                          {startStopName}
                        </Text>) : (<Text bold fontSize={16}> Choose first stop</Text>)}
                      </Stack>
                      <Stack
                      >
                        {!startStopName ? (
                          <Button
                            onPress={() => {
                              setStartStop(selectedStop);
                              setStartStopName(selectedStopName);
                            } }
                            padding={1}
                            margin={1}
                            backgroundColor={colorScheme == "dark"
                              ? colorsDark.secondaryColor
                              : colorsLight.secondaryColor}
                          >
                            <MaterialIcons
                              name="check"
                              size={24}
                              color={colorScheme == "dark" ? colorsDark.textColor : colorsLight.textColor} />
                          </Button>
                        ) : (
                          <Button
                            onPress={() => {
                              setStartStop(null);
                              setStartStopName(null);
                              setSelectedStopName(null);
                              setSelectedStop(null);
                            } }
                            padding={1}
                            margin={1}
                            backgroundColor={colorScheme == "dark"
                              ? colorsDark.secondaryColor
                              : colorsLight.secondaryColor}
                          >
                            <MaterialCommunityIcons
                              name="trash-can"
                              size={24}
                              color={colorScheme == "dark" ? colorsDark.textColor : colorsLight.textColor} />
                          </Button>
                        )}
                      </Stack>
                    </HStack><HStack
                      space={2}
                      padding={1}
                      margin={1}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      width={"95%"}
                    >
                        <Stack space={0} alignItems={"flex-start"}>
                          <Text fontSize={12} color={"gray.500"} bold>
                            Final Stop
                          </Text>
                          {finalStop != null ? (<Text bold fontSize={16}>
                            {finalStopName}
                          </Text>) : (<Text bold fontSize={16}> Choose stop</Text>)}
                        </Stack>
                        <Stack
                        >
                          {!finalStopName ? (
                            <Button
                              onPress={() => {
                                setFinalStop(selectedStop);
                                setFinalStopName(selectedStopName);
                              } }
                              padding={1}
                              margin={1}
                              backgroundColor={colorScheme == "dark"
                                ? colorsDark.secondaryColor
                                : colorsLight.secondaryColor}
                            >
                              <MaterialIcons
                                name="check"
                                size={24}
                                color={colorScheme == "dark" ? colorsDark.textColor : colorsLight.textColor} />
                            </Button>
                          ) : (
                            <Button
                              onPress={() => {
                                setFinalStop(null);
                                setFinalStopName(null);
                                setSelectedStopName(null);
                                setSelectedStop(null);
                              } }
                              padding={1}
                              margin={1}
                              backgroundColor={colorScheme == "dark"
                                ? colorsDark.secondaryColor
                                : colorsLight.secondaryColor}
                            >
                              <MaterialCommunityIcons
                                name="trash-can"
                                size={24}
                                color={colorScheme == "dark" ? colorsDark.textColor : colorsLight.textColor} />
                            </Button>
                          )}
                        </Stack>
                      </HStack></>
              ) : null
            }
            {
              travelingBy == "car" || travelingBy == 'walk' || travelingBy == 'scooter' ? (
                <>
                <HStack
                      space={2}
                      padding={1}
                      margin={1}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      width={"95%"}
                    >
                      <Stack space={0} alignItems={"flex-start"}>
                        <Text fontSize={12} color={"gray.500"} bold>
                          Stop
                        </Text>
                        {mark != null ? (<Text bold fontSize={16}>
                          Destination added
                        </Text>) : (<Text bold fontSize={16}> Select Destination</Text>)}
                      </Stack>
                      <Stack
                      >
                        {mark ? (
                         <HStack space={2}>
                         <Button
                            onPress={() => {
                              setMark(null)
                            } }
                            padding={1}
                            margin={1}
                            backgroundColor={colorScheme == "dark"
                              ? colorsDark.secondaryColor
                              : colorsLight.secondaryColor}
                          >
                            <MaterialCommunityIcons
                              name="trash-can"
                              size={24}
                              color={colorScheme == "dark" ? colorsDark.textColor : colorsLight.textColor} />
                          </Button>
                          <Button
                          
                          padding={1}
                            margin={1}
                            backgroundColor={colorScheme == "dark"
                              ? colorsDark.secondaryColor
                              : colorsLight.secondaryColor}
                               onPress={() => {
              if (Platform.OS == 'android'){
                openMap({latitude:  mark.lat , longitude: mark.lon ,  query:  'destination' ,  travelType: getDirs(), provider: 'google' })
              } else if(Platform.OS == 'ios'){
                openMap({latitude: mark.lat , longitude: mark.lon,query: 'destination',  travelType: getDirs(), provider: 'apple' })
              }
            } }>
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
            </Button>
                         </HStack>
                        ) : null}
                      </Stack>
                    </HStack>
                    
                    </>
              ):null
            }

              <HStack
                space={2}
                padding={2}
                justifyContent={"space-between"}
                alignItems={"center"}
                width={"100%"}
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
                <HStack 
                  paddingRight={5}
                space={0}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color:
                      colorScheme == "dark"
                        ? darkMode.Text.color
                        : lightMode.Text.color,
                  }}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                 {'cycle '+ (seq+1 )+ ' '}
                  
                 
                </Text>
                <MaterialCommunityIcons
                    name="bus-stop"
                    size={24}
                    color={
                      colorScheme == "dark"
                        ? darkMode.Text.color
                        : lightMode.Text.color
                    }
                  />
                  </HStack>
              </HStack>
            
              <HStack
                space={2}
                padding={2}
                justifyContent={"space-between"}
                alignItems={"center"}
                width={"100%"}
              >
               {
                runTime? (
               <>
               <Button
                leftIcon={
                  <MaterialCommunityIcons
                    name={"plus"}
                    size={24}
                    color={"#1DA15D"}
                  />
                }
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.primaryColor
                    : colorsLight.primaryColor 
                }
                onPress={() => continueTripSupa()}
                
              >
                <Text
                 fontSize={"md"}
                 bold
                >
                  New Cycle
                </Text>
              </Button>
              <Button
             
             backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.primaryColor
                    : colorsLight.primaryColor 
                }
                onPress={() => submitTripSupa()}
                
              >
                <Text
                 fontSize={"md"}
                 bold
                >
                  End Trip
                </Text>
              </Button>
               </>
                ) : (
                 
                  <Button
                leftIcon={   
                  <MaterialCommunityIcons
                    name={"play"}
                    size={24}
                    color={"#1DA15D"}
                  />
                }
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.primaryColor
                    : colorsLight.primaryColor 
                }
                onPress={() => startTripSupa()}
              >
                <Text
                  fontSize={"lg"}
                  bold
                >
                  Start Trip
                </Text>
              </Button>
                )
               }
               
              </HStack>
            </Box>
            </Box>
            </Box>
        </ZStack>
        </Box>
       </Box>
      ) : null}
      {menu == "history" ? (
        <Container
          backgroundColor={
            colorScheme == "dark"
              ? colorsDark.backgroundColor
              : colorsLight.backgroundColor
          }
          top={Dimensions.get("window").height * 0.7}
          padding={2}
          borderRadius={10}
          shadow={2}
        >
          <Center>
            <HStack space={2} padding={2}>
              <Button
                w={"100%"}
                leftIcon={<MaterialCommunityIcons name={'ticket-confirmation-outline'} size={24} color={colorScheme == 'dark' ? colorsDark.textColor : colorsLight.textColor} />}

                onPress={() => {
                  setMenu("trip");
                }}
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
              >
                <Text bold fontSize={"md"}
                >Start Trip</Text>
              </Button>
              {/* <Button
                w={"50%"}
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
                onPress={() => {
                  setMenu("travel");
                }}
              >
                <Text  bold fontSize={"md"}>Travel</Text>
              </Button> */}
            </HStack>
            <HStack space={2} padding={2}>
              <Button
                w={"50%"}
                onPress={() => {
                  setMenu("stats");
                }}
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
              >
                <Text bold fontSize={"md"}>Show Stats</Text>
              </Button>
              <Button
                w={"50%"}
                onPress={() => {
                  setMenu("history");
                }}
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
              >
                <Text bold fontSize={"md"}>History</Text>
              </Button>
            </HStack>
          </Center>
        </Container>
      ) : null}
      {menu == "stats" ? (
       <Box 
        backgroundColor={
          colorScheme == "dark"
            ? colorsDark.backgroundColor
            : colorsLight.backgroundColor
        }
                  top={Dimensions.get("window").height * 0.7}

        width={"100%"}
       >
       <ZStack
          // top={Dimensions.get("window").height * 0.7}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {selectTraveler ? (
            <HStack
              zIndex={100}
              bottom={Dimensions.get("window").height * 0.15}
              // right={Dimensions.get("window").width * 0.02}
              backgroundColor={
                colorScheme == "dark" ? colorsDark.backgroundColor : colorsLight.backgroundColor
              }
              borderRadius={5}
              p={2}
              space={1}
              alignItems={"center"}
            
            >
              <Button
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
                onPress={() => {
                  setSelectTraveler(false);
                }}
              >
                <MaterialCommunityIcons
                  name={"close"}
                  size={24}
                  color={
                    colorScheme == "dark"
                      ? colorsDark.textColor
                      : colorsLight.textColor
                  }
                />
              </Button>
              <Button
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
                onPress={() => {
                  setTravelingBy("car");
                  setSelectTraveler(false);
                }}
              >
                <MaterialCommunityIcons
                  name={"car"}
                  size={24}
                  color={
                    colorScheme == "dark"
                      ? colorsDark.textColor
                      : colorsLight.textColor
                  }
                />
              </Button>
              <Button
                backgroundColor={
                  colorScheme == "walk"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
                onPress={() => {
                  setTravelingBy("scooter");
                  setSelectTraveler(false);
                }}
              >
                <MaterialCommunityIcons
                  name={"scooter"}
                  size={24}
                  color={
                    colorScheme == "dark"
                      ? colorsDark.textColor
                      : colorsLight.textColor
                  }
                />
              </Button>
              <Button
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
                onPress={() => {
                  setTravelingBy("walk");
                  setSelectTraveler(false);
                }}
              >
                <MaterialCommunityIcons
                  name={"walk"}
                  size={24}
                  color={
                    colorScheme == "dark"
                      ? colorsDark.textColor
                      : colorsLight.textColor
                  }
                />
              </Button>
              <Button
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.secondaryColor
                    : colorsLight.secondaryColor
                }
                onPress={() => {
                  setTravelingBy("bus");
                  setSelectTraveler(false);
                }}
              >
                <MaterialCommunityIcons
                  name={"bus"}
                  size={24}
                  color={
                    colorScheme == "dark"
                      ? colorsDark.textColor
                      : colorsLight.textColor
                  }
                />
              </Button>
            </HStack>
          ) : null}
         
            <Box
              width={"90%"}
              backgroundColor={
              colorScheme == "dark"
                ? colorsDark.backgroundColor
                : colorsLight.backgroundColor
            }
            borderRadius={5}
            shadow={1}
            >
              <HStack
                space={2}
                padding={2}
                justifyContent={"space-between"}
                alignItems={"center"}
                width={"100%"}
              >
                <Button
                  p={1}
                  m={1}
                  variant="ghost"
                  onPress={() => {
                    setMenu("main");
                  }}
                >
                  <MaterialIcons
                    name="arrow-back"
                    size={24}
                    color={
                      colorScheme == "dark"
                        ? colorsDark.textColor
                        : colorsLight.textColor
                    }
                    onPress={() => {
                      setMenu("main");
                    }}
                  />
                </Button>

                <Button
                  p={1}
                  m={1}
                  variant="ghost"
                  onPress={() => {
                    setSelectTraveler(!selectTraveler);
                  }}
                >
                  <HStack justifyContent={"center"} alignItems={"center"}>
                    <Text bold fontSize={12}>
                      traveling by:{" "}
                    </Text>
                    <MaterialCommunityIcons
                      name={travelingBy}
                      size={24}
                      color={
                        colorScheme == "dark"
                          ? colorsDark.textColor
                          : colorsLight.textColor
                      }
                    />
                  </HStack>
                </Button>
              </HStack>
          
            {
              travelingBy == "bus" ? (
                <><HStack
                      space={2}
                      padding={1}
                      margin={1}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      width={"95%"}
                    >
                      <Stack space={0} alignItems={"flex-start"}>
                        <Text fontSize={12} color={"gray.500"} bold>
                          First Stop
                        </Text>
                        {selectedStopName && startStopName != null ? (<Text bold fontSize={16}>
                          {startStopName}
                        </Text>) : (<Text bold fontSize={16}> Choose first stop</Text>)}
                      </Stack>
                      <Stack
                      >
                        {!startStopName ? (
                          <Button
                            onPress={() => {
                              setStartStop(selectedStop);
                              setStartStopName(selectedStopName);
                            } }
                            padding={1}
                            margin={1}
                            backgroundColor={colorScheme == "dark"
                              ? colorsDark.secondaryColor
                              : colorsLight.secondaryColor}
                          >
                            <MaterialIcons
                              name="check"
                              size={24}
                              color={colorScheme == "dark" ? colorsDark.textColor : colorsLight.textColor} />
                          </Button>
                        ) : (
                          <Button
                            onPress={() => {
                              setStartStop(null);
                              setStartStopName(null);
                              setSelectedStopName(null);
                              setSelectedStop(null);
                            } }
                            padding={1}
                            margin={1}
                            backgroundColor={colorScheme == "dark"
                              ? colorsDark.secondaryColor
                              : colorsLight.secondaryColor}
                          >
                            <MaterialCommunityIcons
                              name="trash-can"
                              size={24}
                              color={colorScheme == "dark" ? colorsDark.textColor : colorsLight.textColor} />
                          </Button>
                        )}
                      </Stack>
                    </HStack><HStack
                      space={2}
                      padding={1}
                      margin={1}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      width={"95%"}
                    >
                        <Stack space={0} alignItems={"flex-start"}>
                          <Text fontSize={12} color={"gray.500"} bold>
                            Final Stop
                          </Text>
                          {finalStop != null ? (<Text bold fontSize={16}>
                            {finalStopName}
                          </Text>) : (<Text bold fontSize={16}> Choose stop</Text>)}
                        </Stack>
                        <Stack
                        >
                          {!finalStopName ? (
                            <Button
                              onPress={() => {
                                setFinalStop(selectedStop);
                                setFinalStopName(selectedStopName);
                              } }
                              padding={1}
                              margin={1}
                              backgroundColor={colorScheme == "dark"
                                ? colorsDark.secondaryColor
                                : colorsLight.secondaryColor}
                            >
                              <MaterialIcons
                                name="check"
                                size={24}
                                color={colorScheme == "dark" ? colorsDark.textColor : colorsLight.textColor} />
                            </Button>
                          ) : (
                            <Button
                              onPress={() => {
                                setFinalStop(null);
                                setFinalStopName(null);
                                setSelectedStopName(null);
                                setSelectedStop(null);
                              } }
                              padding={1}
                              margin={1}
                              backgroundColor={colorScheme == "dark"
                                ? colorsDark.secondaryColor
                                : colorsLight.secondaryColor}
                            >
                              <MaterialCommunityIcons
                                name="trash-can"
                                size={24}
                                color={colorScheme == "dark" ? colorsDark.textColor : colorsLight.textColor} />
                            </Button>
                          )}
                        </Stack>
                      </HStack></>
              ) : null
            }
            {
              travelingBy == "car" || travelingBy == 'walk' || travelingBy == 'scooter' ? (
                <>
                <HStack
                      space={2}
                      padding={1}
                      margin={1}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      width={"95%"}
                    >
                      <Stack space={0} alignItems={"flex-start"}>
                        <Text fontSize={12} color={"gray.500"} bold>
                          Stop
                        </Text>
                        {mark != null ? (<Text bold fontSize={16}>
                          Destination added
                        </Text>) : (<Text bold fontSize={16}> Select Destination</Text>)}
                      </Stack>
                      <Stack
                      >
                        {mark ? (
                          <Button
                            onPress={() => {
                              setMark(null);
                            } }
                            padding={1}
                            margin={1}
                            backgroundColor={colorScheme == "dark"
                              ? colorsDark.secondaryColor
                              : colorsLight.secondaryColor}
                          >
                            <MaterialCommunityIcons
                              name="trash-can"
                              size={24}
                              color={colorScheme == "dark" ? colorsDark.textColor : colorsLight.textColor} />
                          </Button>
                        ) : null}
                      </Stack>
                    </HStack>
                    
                    </>
              ):null
            }

              <HStack
                space={2}
                padding={2}
                justifyContent={"space-between"}
                alignItems={"center"}
                width={"100%"}
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
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <MaterialCommunityIcons
                    name="bus-stop"
                    size={24}
                    color={
                      colorScheme == "dark"
                        ? darkMode.Text.color
                        : lightMode.Text.color
                    }
                  />
                  {seq+1}
                </Text>
              </HStack>
            
              <HStack
                space={2}
                padding={2}
                justifyContent={"space-between"}
                alignItems={"center"}
                width={"100%"}
              >
               {
                runTime? (
               <>
               <Button
                leftIcon={
                  <MaterialCommunityIcons
                    name={"plus"}
                    size={24}
                    color={"#1DA15D"}
                  />
                }
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.primaryColor
                    : colorsLight.primaryColor 
                }
                onPress={() => continueTripSupa()}
                
              >
                <Text
                 fontSize={"md"}
                 bold
                >
                  New Cycle
                </Text>
              </Button>
              <Button
             
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.primaryColor
                    : colorsLight.primaryColor 
                }
                onPress={() => endTripSupa()}
                
              >
                <Text
                 fontSize={"md"}
                 bold
                >
                  End Trip
                </Text>
              </Button>
               </>
                ) : (
                 
                  <Button
                leftIcon={   
                  <MaterialCommunityIcons
                    name={"play"}
                    size={24}
                    color={"#1DA15D"}
                  />
                }
                backgroundColor={
                  colorScheme == "dark"
                    ? colorsDark.primaryColor
                    : colorsLight.primaryColor 
                }
                onPress={() => startTripSupa()}
              >
                <Text
                  fontSize={"lg"}
                  bold
                >
                  Start Trip
                </Text>
              </Button>
                )
               }
               
              </HStack>
            </Box>
        </ZStack>
       </Box>
      ) : null}
      {menu == "alert" ? (
        <VStack
          style={{
            backgroundColor:
              colorScheme == "dark"
                ? colorsDark.backgroundColor
                : colorsLight.backgroundColor,
            borderRadius: 10,
            padding: 5,
            justifyContent: "center",
            alignItems: "center", //flex-start
            margin: 3,
            position: "absolute",
            top: "55%",
            zIndex: 100,
            // left: '10%',

            width: "90%",
          }}
        >
          <HStack
            p={1}
            width={"100%"}
            space={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <MaterialCommunityIcons
              size={24}
              name="close"
              onPress={() => {
                if(runTime || startStop != null){
                  setMenu("trip")
                } else {
                  setMenu("main")
                }
              }}
              color={
                colorScheme == "dark"
                  ? colorsDark.textColor
                  : colorsLight.textColor
              }
            />
            <Text
            fontSize={"xl"}
            bold
            >
              Alert
            </Text>
           
          </HStack>
          <Text
            m={2}
            fontSize={"md"}
          >
            Select Category
          </Text>
          <Select
            selectedValue={alertCat}
            borderColor={'transparent'}
            padding={3}
            width={"90%"}
            size={"md"}
            // borderColor={'transparent'}

            backgroundColor={
              colorScheme == "dark"
                ? colorsDark.primaryColor
                : colorsLight.primaryColor
            }
            accessibilityLabel="Select Category"
            placeholder="Select Category"
            color={
              colorScheme == "dark"
                ? colorsDark.textColor
                : colorsLight.textColor
            }
            onValueChange={(itemValue) => setAlertCat(itemValue)}
            _selectedItem={{
              bg: "cyan.600",
            }}
          >
            <Select.Item label="Bus" value="bus" />
            <Select.Item
              label="Bus and system predictions"
              value="predictions"
            />
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
            marginTop={2}
            fontSize={"md"}
          >
            Problem
          </Text>
          <Input
            onChangeText={(text) => setAlertProblem(text)}
            w={"90%"}
            p={3}
            m={3}
            size="md"
            color={
              colorScheme == "dark"
                ? colorsDark.textColor
                : colorsLight.textColor
            }
            borderColor={"transparent"}
            placeholder="Problem"
            backgroundColor={
              colorScheme == "dark"
                ? colorsDark.primaryColor
                : colorsLight.primaryColor
            }
          >
            <Text
            >
              {alertProblem}
            </Text>
          </Input>
         <HStack space={2} 
         justifyContent={'space-between'}
         >
         <Button
            m={3}
             onPress={async () => {
              const { data, error } = await supabase.from("feedback").insert([
                {
                  title: alertTitle,
                  conv: alertProblem,
                  cat: alertCat,
                  status: alertStatus,
                },
              ]);
              if (error) {
                console.log(error);
              }
              Alert.alert(
                        "Please read and agree to the terms and conditions"
                      );
              
            }}
            fontSize={"md"}
            backgroundColor={
              colorScheme == "dark"
                ? colorsDark.secondaryColor
                : colorsLight.secondaryColor
            }
          >
            <Text fontSize={"md"}>Submit</Text>
          </Button>
        
         </HStack>
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
