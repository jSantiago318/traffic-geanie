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
import React, { ScrollView, useEffect, useMemo, useRef, useState } from "react";
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

export const TripsScreen = () => {
  const colorScheme = useColorScheme();
  const [uid, setUid] = useState(null);
  const memoRt = React.useMemo(() => Shapes, []);
const memoStop = React.useMemo(() => getStops(), []);
const [startStop, setStartStop] = useState(null);
const [startStopName, setStartStopName] = useState(null);
const [finalStop, setFinalStop] = useState(null);
const [finalStopName, setFinalStopName] = useState(null);
const [runTime, setRunTime] = useState(false);
const [travelingBy, setTravelingBy] = useState(null);
const [tripTime, setTripTime] = useState(null);
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

    })();
  }, [uid]);



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

 
  async function submitTripSupa() {
    const d1 = new Date(startLocData?.timestamp)
    const d2 = new Date(location?.timestamp)
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
        polyline: backLoc,
        seq: seqs(1),
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

      </MapView>

  

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
