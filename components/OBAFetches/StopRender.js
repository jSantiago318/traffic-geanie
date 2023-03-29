import { FlatList, HStack, Icon, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, } from 'react-native';

import { setActiveBus } from '../URLFetcher';
import {useNavigation} from "@react-navigation/native";

export const StopRender = ({stop, currentTime}) => {


  
  const [allStops, setAllStops] = useState([]);
  const [stopName, setStopName] = useState([]);
  const [predStop, setPredStop] = useState([]);
  useEffect(() => {
  const dataFetch = async () => {
      await fetch(
        "https://pr-oba.live/api/where/schedule-for-stop/" +
    stop +
    ".json?key=TEST"
        ).then((response) => response.json())
        .then((data) => {
          setAllStops(data.data.entry.stopRouteSchedules[0].stopRouteDirectionSchedules[0].scheduleStopTimes)
          const temp = stopName
          temp.push(data.data.references.stops[0].name)

        setStopName(data.data.references.stops[0].name)
        });


        await fetch('https://pr-oba.live/api/where/arrivals-and-departures-for-stop/'+stop+'.json?key=TEST').then((response) => response.json())
        .then((data) => {
          //   console.log(data.data.entry.arrivalsAndDepartures[0].lastKnownLocation)
          //   console.log(data.data.entry.arrivalsAndDepartures[0].tripStatus.nextStop)
          //   console.log(data.data.entry.arrivalsAndDepartures[0].tripStatus.position)
          //   console.log(data.data.entry.arrivalsAndDepartures[0].tripStatus.vehicleId)
          //   setActiveBus(data.data.entry.arrivalsAndDepartures[0].tripStatus.vehicleId)
          if (data.data.entry.arrivalsAndDepartures.length > 0) {
            const temp = [
              data.data.entry.arrivalsAndDepartures[0].predicted,
              data.data.entry.arrivalsAndDepartures[0].predictedArrivalTime,
              data.data.entry.arrivalsAndDepartures[0].scheduledArrivalTime
            ]
            setPredStop(temp)

                      } 
          // console.log(data.data.entry.arrivalsAndDepartures[0].scheduledArrivalTime)
        } );


      } 
      if(stopName.length === 0) {
        dataFetch();
      }
    }, [allStops, predStop, stopName]);




    // setInterval(() => {
    //     if (predStop[0]) {
    //          fetch('https://pr-oba.live/api/where/arrivals-and-departures-for-stop/'+stop+'.json?key=TEST').then((response) => response.json())
    //     .then((data) => {
    //       console.log(data.data.entry.arrivalsAndDepartures[0].predicted)
    //       console.log(data.data.entry.arrivalsAndDepartures[0].predictedArrivalTime)
    //       console.log(data.data.entry.arrivalsAndDepartures[0].scheduledArrivalTime)
    //       const temp = [
    //         data.data.entry.arrivalsAndDepartures[0].predicted,
    //         data.data.entry.arrivalsAndDepartures[0].predictedArrivalTime,
    //         data.data.entry.arrivalsAndDepartures[0].scheduledArrivalTime
    //       ]
    //     //   console.log(data.data.entry.arrivalsAndDepartures[0].lastKnownLocation)
    //     //   console.log(data.data.entry.arrivalsAndDepartures[0].tripStatus.nextStop)
    //     //   console.log(data.data.entry.arrivalsAndDepartures[0].tripStatus.position)
    //     //   console.log(data.data.entry.arrivalsAndDepartures[0].tripStatus.vehicleId)
    //     //   setActiveBus(data.data.entry.arrivalsAndDepartures[0].tripStatus.vehicleId)
    //       if (data.data.entry.arrivalsAndDepartures.length > 0) {
    //         setPredStop(temp)

    //                   } 
    //       // console.log(data.data.entry.arrivalsAndDepartures[0].scheduledArrivalTime)
    //     } );

    //     }
    // }, 30000);

  
function getNextStop(){

  allStops.forEach((stop) => {
    if (stop.predictedArrivalTime > currentTime) {
      return stop.predictedArrivalTime
    }
  }
  )
}



const TimePred = () => {
  if (predStop[0] === true) {
    return( <Text style={styles.timePred}> {new Date(predStop[1]).toLocaleTimeString()} -{
            Math.floor((predStop[1] - currentTime)/60000) <0 ? 
            ""+Math.floor((predStop[1] - currentTime)/60000)*-1+" min" : 
            ""+Math.floor((predStop[1] - currentTime)/60000)+" min"
    }   </Text>)
  } else if( predStop[0] === false) {
    return (<Text style={styles.timeSch}> {new Date(predStop[2]).toLocaleTimeString() } </Text>)
  } else{
    return (<Text> {new Date(getNextStop())} </Text>)
  }
}

  return (
  <>
    <View style={styles.card}>
    <HStack space={2} alignItems="center">
      <Text style={styles.route}>🟢</Text>
      {
        stopName.length > 0 ? <Text> {stopName} </Text> :<Text> loading... </Text>
      }
      {/* {
        allStops.length > 0 ? <Text> {new Date(getNextStop(allStops)).toLocaleTimeString()} </Text> :<Text> loading... </Text>
      } */}
      
      <TimePred/>
    </HStack>
    </View>
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: '50%',
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#93e1d8',
  }, timePred:{
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  }, card: {
    margin: 5,
    padding: 5,
    borderRadius: 10,
    justifyContent: 'center',
  }, timeSch: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
    }, 
  
});
