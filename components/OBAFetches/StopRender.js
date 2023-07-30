import { HStack, Icon, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';

import {Colors} from '../../config/theme'

export const StopRender = ({stop}) => {
  const [allStops, setAllStops] = useState([]);
  const [stopName, setStopName] = useState([]);
  const [predStop, setPredStop] = useState([]);
  const [currentTime, setCurrentTime] = useState([]);
  let counter = 0;
  const colorScheme = useColorScheme();
  setInterval(() => {
    counter++;
  }, 2000);
const timeMemo = React.useMemo(() =>  {
      async function dataFetch(){
        // console.log(stop)
        await fetch(
          "https://proba.live/api/where/schedule-for-stop/" +
          stop +
          ".json?key=TEST"
          ).then((response) => response.json())
          .then((data) => {
            const day = new Date().getDay();
            if (day === 0 || day === 6) {
              setAllStops([])
            } else {
              setAllStops(data.data.entry.stopRouteSchedules[0].stopRouteDirectionSchedules[0].scheduleStopTimes)
            }
              const temp = stopName
              temp.push(data.data.references.stops[0].name)
              // console.log(1)
              setStopName(data.data.references.stops[0].name)
              setCurrentTime(data.currentTime);
          });
          
          
          await fetch('https://proba.live/api/where/arrivals-and-departures-for-stop/'+stop+'.json?key=TEST').then((response) => response.json())
          .then((data) => {
            if (data.data.entry.arrivalsAndDepartures.length > 0) {
              const temp = [
                data.data.entry.arrivalsAndDepartures[0].predicted,
                data.data.entry.arrivalsAndDepartures[0].predictedArrivalTime,
                data.data.entry.arrivalsAndDepartures[0].scheduledArrivalTime
              ]
              console.log(stop, temp)
              setPredStop(temp)
            } 
          } );
          
          
        } 
      if(stopName.length === 0 || counter === 2) {
        dataFetch();
        // console.log('refreshed')
        counter = 0;
      }
    }, [allStops, predStop, stopName, stop]);
    
function getNextStop(){
  let found = false
  const day = new Date().getDay();

  if (allStops.length === 0 &&(day === 0 || day === 6)) {
    return "No bus"
  }
  
  for (let index = 0; index < allStops.length; index++) {
    const element = allStops[index];
    if (element.predictedArrivalTime > currentTime && found === false) {
      found = true
      return new Date(element.arrivalTime).toLocaleTimeString()
    }
     if(found === false && index === allStops.length-1){
      return new Date(allStops[0].arrivalTime).toLocaleTimeString()
    } 
    
    
  }
}



const TimePred = () => {
   if (predStop[0] === true) {
    return( <Text style={{
      fontSize: 14,
      fontWeight: 'bold',
      color: colorScheme == "dark" ? Colors.textDark : Colors.textLight,
}}> {new Date(predStop[1]).toLocaleTimeString()} -{
            Math.floor((predStop[1] - currentTime)/60000) <0 ? 
            ""+Math.floor((predStop[1] - currentTime)/60000)*-1+" min" : 
            ""+Math.floor((predStop[1] - currentTime)/60000)+" min"
    }   </Text>)
  } else if( predStop[0] === false) {
    const val = new Date(predStop[2]).toLocaleTimeString()
    // return (<Text style={styles.timeSch}> {new Date(predStop[2]).toLocaleTimeString() } </Text>)
    return (<Text style={{
      fontSize: 14,
      fontWeight: 'bold',
      color: colorScheme == "dark" ? Colors.textDark : Colors.textLight,
}}> {val } </Text>)
  }
   else{
    // return (<Text> {new Date(getNextStop())} </Text>)
    const val = getNextStop()
    return (<Text style={{
          fontSize: 14,
          fontWeight: 'bold',
          color: colorScheme == "dark" ? Colors.textDark : Colors.textLight,
    }}> {val} </Text>)
  }
}

  return (
  
    <View style={{
    margin: 5,
    padding: 5,
    borderRadius: 10,
    justifyContent: 'center',
    }}>
    <HStack justifyContent={'space-between'}>
      {
        stopName.length > 0 ? <Text style={{
          fontSize: 14,
          fontWeight: 'bold',
          color: colorScheme == "dark" ? Colors.textDark : Colors.textLight,
        }}> {stopName} </Text> :<Text style={{
          fontSize: 14,
          fontWeight: 'bold',
          color: colorScheme == "dark" ? Colors.textDark : Colors.textLight,
    }}> {stop} </Text>
      }
      {/* {
        allStops.length > 0 ? <Text> {new Date(getNextStop(allStops)).toLocaleTimeString()} </Text> :<Text> loading... </Text>
      } */}
      
      <TimePred/>
    </HStack>
    </View>
  
  );
}
 
