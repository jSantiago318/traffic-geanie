import { HStack, Icon, ScrollView, Text, View } from "native-base";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, useColorScheme } from "react-native";

import { lightMode } from "../config";
import { useState } from "react";

const StopRender = ({ stop, index }) => {
  const [allStops, setAllStops] = useState([]);
  const [stopName, setStopName] = useState([]);
  const [predStop, setPredStop] = useState([]);
  const [currentTime, setCurrentTime] = useState([]);
  let counter = 0;
  setInterval(() => {
    counter++;
  }, 3000);

  useEffect(() => {
    async function dataFetch() {
      await fetch(
        "https://proba.live/api/where/schedule-for-stop/TIM_" +
          stop +
          ".json?key=TEST"
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.length == 0 || data.data.length == 0) {
            setPredStop("Route Not Active");
          } else {
            {
              const temp = stopName;
              temp.push(data.data.references.stops[0].name);

              setStopName(data.data.references.stops[0].name);
              setCurrentTime(data.currentTime);
              if (data.data.entry.stopRouteSchedules[0] != undefined) {
                setAllStops(
                  data.data.entry.stopRouteSchedules[0]
                    .stopRouteDirectionSchedules[0].scheduleStopTimes
                );
              }
            }
            setCurrentTime(data.currentTime);
          }
          // console.log(data.data.references.stops[0].name)
        });

      await fetch(
        "https://proba.live/api/where/arrivals-and-departures-for-stop/TIM_" +
          stop +
          ".json?key=TEST"
      )
        .then((response) => response.json())
        .then((data) => {
          // console.log(data.data.entry.arrivalsAndDepartures[0].lastKnownLocation)
          // console.log(data.data.entry.arrivalsAndDepartures[0].tripStatus.nextStop)
          // console.log(data.data.entry.arrivalsAndDepartures[0].tripStatus.position)
          // console.log(data.data.entry.arrivalsAndDepartures[0].tripStatus.vehicleId)
          // setActiveBus(data.data.entry.arrivalsAndDepartures[0].tripStatus.vehicleId)
          if (data.data.entry.arrivalsAndDepartures.length > 0) {
            const temp = [
              data.data.entry.arrivalsAndDepartures[0].predicted,
              data.data.entry.arrivalsAndDepartures[0].predictedArrivalTime,
              data.data.entry.arrivalsAndDepartures[0].scheduledArrivalTime,
            ];
            setPredStop(temp);
          }
          //   console.log(data.data.entry.arrivalsAndDepartures[0].scheduledArrivalTime)
        });
    }
    if (stopName.length === 0 || counter === 2) {
      dataFetch();
      console.log("refreshed");
      counter = 0;
    }
  }, [allStops, predStop, stopName]);

  function getNextStop() {
    let found = false;
    for (let index = 0; index < allStops.length; index++) {
      const element = allStops[index];
      if (element.predictedArrivalTime > currentTime && found === false) {
        found = true;
        return new Date(element.arrivalTime).toLocaleTimeString();
      }
      if (found === false && index === allStops.length - 1) {
        // console.log( )
        return new Date(allStops[0].arrivalTime).toLocaleTimeString();
      }
    }
  }

  const TimePred = () => {
    if (predStop == "Route Not Active") {
      return <Text>{"Route Not Active"}</Text>;
    } else if (predStop[0] === true) {
      return (
        <Text style={styles.timePred}>
          {" "}
          {new Date(predStop[1]).toLocaleTimeString()} -
          {Math.floor((predStop[1] - currentTime) / 60000) < 0
            ? "" + Math.floor((predStop[1] - currentTime) / 60000) * -1 + " min"
            : "" +
              Math.floor((predStop[1] - currentTime) / 60000) +
              " min"}{" "}
        </Text>
      );
    } else if (predStop[0] === false) {
      const val = new Date(predStop[2]).toLocaleTimeString();
      // return (<Text style={styles.timeSch}> {new Date(predStop[2]).toLocaleTimeString() } </Text>)
      return <Text style={styles.timeSch}> {val} </Text>;
    } else {
      // return (<Text> {new Date(getNextStop())} </Text>)
      const val = getNextStop();
      return <Text> {val || "..."} </Text>;
    }
  };
  return <TimePred />;
};

export const TimeArrivalReturn = ({ stops, startStop, finalStop, selectedStop }) => {
  // memo stops to prevent rerender
  const memoStops = useMemo(() => stops, [stops]);

  return (
    <ScrollView
      m={2}
      // limit height to 50% of screen
      p={1}
    >
    {
      memoStops.length == 0 ? <Text> Select a stop </Text> : null
    }
      {memoStops.map((stop, index) => {
        console.log(stop);
        return (
          <HStack paddingBottom={1.5} key={index} justifyContent={"space-between"}>
           
            <Text>{index+1}: {stop.name}</Text>
              <HStack 
                justifyContent={"flex-start"}
                alignItems={"center"}
              >
              {
                selectedStop === stop.id ? (
                  <MaterialCommunityIcons
                    name="bus-marker"
                    size={24}
                    color="black"
                  />
                ) : (null
                )

              }
            {startStop === stop.id ? (
                <><MaterialCommunityIcons
                  name="bus"
                  size={24}
                  color="black" /><MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="green" /></>
            ) :null}
            {finalStop === stop.id ? (
                <><MaterialCommunityIcons
                  name="bus"
                  size={24}
                  color="black" /><MaterialCommunityIcons
                    name="chevron-left"
                    size={24}
                    color="red" /></>
            ) :null}
                <StopRender stop={stop.id} index={index} />
              </HStack>
            
          </HStack>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: "50%",
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#93e1d8",
  },
  timePred: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  card: {
    margin: 5,
    padding: 5,
    borderRadius: 10,
    justifyContent: "center",
  },
  timeSch: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
});
