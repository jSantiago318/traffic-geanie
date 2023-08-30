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
import { darkMode, lightMode } from "../config";
import { getOnlineById, getPosition } from "../components/URLFetcher";
import { getRouteColor, getRoutes } from "../assets/gtfs/route";
import { getStopById, getStopByIdOnline, getStops } from "../assets/gtfs/stops";

import { Pedometer } from "expo-sensors";
import { Session } from '@supabase/supabase-js'
import Shapes from "../assets/gtfs/shapes.json";
import { supabase } from "../utils/supabase";
import { useNavigation } from "@react-navigation/native";
import { useStopwatch } from "react-timer-hook";

export const MapScreen = (
) => {
  const colorScheme = useColorScheme();
  const [location, setLocation] = useState(null);
  const routeStops = useState();
  const navigation = useNavigation();
  const [selectDestination, setSelectDestination] = useState(false);
  const [confirm, setConfirm] = useState(0);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [confirmSelect, setConfirmSelect] = useState(false);
  const [startStop, setStartStop] = useState(null);
  const [startStopName, setStartStopName] = useState(null);
  const [finalStop, setFinalStop] = useState(null);
  const [finalStopName, setFinalStopName] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [selectedStopName, setSelectedStopName] = useState(null);
  const [runTime, setRunTime] = useState(false);
  const [selectTraveler, setSelectTraveler] = useState(false);
  const memoStop = React.useMemo(() => getStops(), []);
  const memoRt = React.useMemo(() => Shapes, []);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [travelingBy, setTravelingBy] = useState("walk");
  const [backLoc, setBackLoc] = useState([]);
  const [markers, setMarkers] = useState(null);
  const [nobusDestination, setNoBusDestination] = useState(false);
  const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';
  const [uid, setUid] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [startLocData, setStartLocData] = useState(null);
  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });

  const [tripTime, setTripTime] = useState(0);
  const memo = useMemo(() => getTime(), [hours, minutes ,seconds]);
  async function getTime() {
    const h = hours > 9 ? hours : "0" + hours;
    const m = minutes > 9 ? minutes : "0" + minutes;
    const s = seconds > 9 ? seconds : "0" + seconds;
    setTripTime(h + ":" + m + ":" + s);
    return h + ":" + m + ":" + s;

  }

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
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 10,
        });
        setLocation(location);
        console.log(location);
        if(runTime){
          setBackLoc((backLoc) => [...backLoc, location.coords]);
        }
      }
    })();
  }, [uid, location]);

  async function submitTripSupa(){

    const { data , error } = await supabase
    .from("trips")
    .insert([
      {location_start: {
        latitude: startLocData?.coords.latitude,
        longitude: startLocData?.coords.longitude,
        startStop: startStop,
        
      }, 
      start_time: new Date(startLocData?.timestamp).toLocaleString(),
      end_time: new Date(location?.timestamp).toLocaleString(),
      location_end: {
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
        finalStop: finalStop,
      },
      travel:[ {
        travelingBy: travelingBy,
      }],
      trip_duration : tripTime,
      email: uid,
      polyline:   backLoc,
      seq: 1,
      trip_status: 'ended'
      }
    ])
    if(error){
        console.log(error)
    }
    else{
      setConfirm(null);
      setRunTime(false);
      setStartStop(null);
      setFinalStop(null);
      setSelectTraveler(false); 
      setStartLocData(null);
      setBackLoc([]);
      reset();
      pause();
    }
  }

  async function startTripSupa(){
                if (travelingBy == "bus") {
                  if (startStop && finalStop) {
                    setConfirmSelect(true);

                    setRunTime(true);
                    start();
                    setConfirm(0);
                    setStartLocData(location);
      //                const { data , error } = await supabase
      // .from("trips")
      // .insert([
      //   {location_start: {
      //     latitude: location?.coords.latitude,
      //     longitude: location?.coords.longitude,
      //     startStop: startStop,
      //   }, 
      //   travel:[ {
      //     travelingBy: travelingBy,
      //   }],
      //   email: uid,
      //   seq: 0,
      //   trip_status: 'started'
      //   }
      // ])
                  }
                } else {
                     
                  if (seconds == 0) {
                    start();
                    setRunTime(true);
                    setConfirm(1);
                    setStartLocData(location);
                    setConfirm(true)
                    if(location){
                      _mapView.animateToRegion({
                      latitude: location?.coords.latitude,
                      longitude: location?.coords.longitude,
                      latitudeDelta: 0.0022,
                      longitudeDelta: 0.0022,
                    });
                    }
                   
                  }
                  
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
 
  var _mapView;

  return (
    <View style={styles.container}>
      <MapView
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
        onPress={(e) => {
          if (travelingBy == "walk" || travelingBy == "scooter" || travelingBy == "car") {
            if( runTime == true){
 setMarkers(e.nativeEvent.coordinate)          
            }
          }}
          
          }
      >
   {(markers!=null) ?
        <Marker
          draggable
          coordinate={markers}
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

{
  memoStop.map((stop, index) => {
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
  })

}
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
       {
         backLoc.length > 0 ? (
          <Polyline
          coordinates={backLoc}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeColors={ ['#2EB62C',
'#57C84D',
'#83D475',
'#ABE098',
'#D7F0C0']}
          strokeWidth={5}
      />
          ):null
          
       }

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
      {/* {
        selectTraveler ? (
          <HStack space={2} alignItems="center" justifyContent="center">
          <Button 
            style={{  
              backgroundColor: travelingBy == 'walk' ? '#1DA15D' : '#D93729', 

        ):null
      } */}
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
                color={'white'}
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
              {/* material icons white */}
              <MaterialCommunityIcons 
                name="cancel"
                size={18}
                color={'white'}
              />
            </Button>
          </HStack>
        ) : null}
        {runTime == true && (travelingBy == 'walk'||travelingBy == 'car'||travelingBy == 'scooter')   ? (
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
                if(  markers != null){
                  setSelectDestination(true);
                } else {
                  Alert.alert('Select a location on the map to set as destination')
                }
              }}
            >
              <MaterialCommunityIcons
                name="check"
                size={18}
                color={'white' }
              />
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
              <MaterialCommunityIcons
                name="cancel"
                size={18}
                color={'white'}
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
                  ? 'white'
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
                  {
                    tripTime
                  }
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
                Tracking: {backLoc.length}
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
              onPress={async () => startTripSupa()}
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

                onPress={
                  () => submitTripSupa()
                }
              >
                <Text
                  style={
                    colorScheme == "dark" ? darkMode.Title : lightMode.Title
                  }>
                  Finish Trip
                </Text>
              </Button> 
            </>
          )}
{
  (
    startStop != null || finalStop != null || markers != null || runTime == true
  )? (
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
                  setStartStop(null)
                  setFinalStop(null)
                  setMarkers(null)
                  pause();
                  reset();
                  setRunTime(false);
                  setStartLocData(null);

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
  ): null
}
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
              colorScheme == "dark" ? darkMode.Text : lightMode.Text
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
           if(location){
            _mapView.animateToRegion({
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
              latitudeDelta: 0.0042,
              longitudeDelta: 0.0041,
            });
           }
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
