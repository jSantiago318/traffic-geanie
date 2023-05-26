import { HStack, Icon, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';

import {Colors} from '../../config/';

export const StopRender = ({stop}) => {
  const [allStops, setAllStops] = useState([]);
  const [stopName, setStopName] = useState([]);
  const [predStop, setPredStop] = useState([]);
  const [currentTime, setCurrentTime] = useState([]);
  let counter = 0;
  setInterval(() => {
    counter++;
  }, 2000);

  useEffect(() => {
      
      async function dataFetch(){
        console.log(stop)
        await fetch(
          "https://proba.live/api/where/schedule-for-stop/" +
          stop +
          ".json?key=TEST"
          ).then((response) => response.json())
          .then((data) => {
            setAllStops(data.data.entry.stopRouteSchedules[0].stopRouteDirectionSchedules[0].scheduleStopTimes)
            const temp = stopName
            temp.push(data.data.references.stops[0].name)
            
            setStopName(data.data.references.stops[0].name)
            setCurrentTime(data.currentTime);
            // console.log(data.data.references.stops[0].name)
          });
          
          
          await fetch('https://proba.live/api/where/arrivals-and-departures-for-stop/'+stop+'.json?key=TEST').then((response) => response.json())
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
      if(stopName.length === 0 || counter === 2) {
        dataFetch();
        // console.log('refreshed')
        counter = 0;
      }
    }, [allStops, predStop, stopName]);
    
function getNextStop(){
  let found = false
  
  for (let index = 0; index < allStops.length; index++) {
    const element = allStops[index];
    if (element.predictedArrivalTime > currentTime && found === false) {
      found = true
      return new Date(element.arrivalTime).toLocaleTimeString()
    }
    if(found === false && index === allStops.length-1){
      // console.log( )
      return new Date(allStops[0].arrivalTime).toLocaleTimeString()
    }
    
  }
}



const TimePred = () => {
  const colorScheme = useColorScheme();
  if (predStop[0] === true) {
    return( <Text style={colorScheme == "dark" ? darkMode.timePred : lightMode.timePred}> {new Date(predStop[1]).toLocaleTimeString()} -{
            Math.floor((predStop[1] - currentTime)/60000) <0 ? 
            ""+Math.floor((predStop[1] - currentTime)/60000)*-1+" min" : 
            ""+Math.floor((predStop[1] - currentTime)/60000)+" min"
    }   </Text>)
  } else if( predStop[0] === false) {
    const val = new Date(predStop[2]).toLocaleTimeString()
    // return (<Text style={styles.timeSch}> {new Date(predStop[2]).toLocaleTimeString() } </Text>)
    return (<Text style={styles.timeSch}> {val } </Text>)
  } else{
    // return (<Text> {new Date(getNextStop())} </Text>)
    const val = getNextStop()
    return (<Text> {val} </Text>)
  }
}

  return (
  <>
    <View style={styles.card}>
    <HStack space={2} justifyContent={'space-between'}>
      {
        stopName.length > 0 ? <Text> {stopName} </Text> :<Text> loading.. </Text>
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

// const darkMode = StyleSheet.create({
//   timePred:{
//     fontSize: 16,
//     fontWeight: 'bold',
//     backgroundColor: '#0CAC59',
//   },
//   timeSch: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     backgroundColor: '#0CAC59',
//     },
// })

// const lightMode = StyleSheet.create({
//   timePred:{
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: 'green',
//   },
//   timeSch: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: Colors.schText,
//     },
// })


const styles = StyleSheet.create({
  container: {
    // maxHeight: '50%'s,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#93e1d8',
  }, timePred:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#049C64',
  }, card: {
    margin: 5,
    padding: 5,
    borderRadius: 10,
    justifyContent: 'center',
  }, timeSch: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#383838',
    }, 
  
});
