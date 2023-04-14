import { HStack, Icon, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, } from 'react-native';

export const StopssRender = ({stop}) => {


  
  const [allStops, setAllStops] = useState([]);
  const [stopName, setStopName] = useState([]);
  const [predStop, setPredStop] = useState([]);
  const [currentTime, setCurrentTime] = useState([]);
  let counter = 0;
  setInterval(() => {
    counter++;
  }, 5000);

  useEffect(() => {
      
      async function dataFetch(){
        await fetch(
          "https://pr-oba.live/api/where/schedule-for-stop/" +
          stop +
          ".json?key=TEST"
          ).then((response) => response.json())
          .then((data) => {
            if(data.length == 0 || data.data.length == 0){
              setPredStop("Route Not Active")
          }
          else {

            setAllStops(data.data.entry.stopRouteSchedules[0].stopRouteDirectionSchedules[0].scheduleStopTimes)
            const temp = stopName
            temp.push(data.data.references.stops[0].name)
            
            setStopName(data.data.references.stops[0].name)
            setCurrentTime(data.currentTime);
          }
            // console.log(data.data.references.stops[0].name)
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
      if(stopName.length === 0 || counter === 2) {
        dataFetch();
        console.log('refreshed')
        counter = 0;
      }
    }, [allStops, predStop, stopName]);
    
   
    


  
function getNextStop(){
  let found = false
  
  for (let index = 0; index < allStops.length; index++) {
    const element = allStops[index];
    // console.log(element)
    //  TYPE OF DOC RECIEVED 
    // Object {
    //   "arrivalEnabled": true,
    //   "arrivalTime": 1680721628000,
    //   "departureEnabled": false,
    //   "departureTime": 1680721638000,
    //   "serviceId": "TIM_WD",
    //   "stopHeadsign": "",
    //   "tripId": "TIM_RR105T09A",
    // }
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
  if(predStop == "Route Not Active"){
    return (
      <Text>{'Route Not Active'}</Text>
    )
  }

  else if (predStop[0] === true) {
    return( <Text style={styles.timePred}> {new Date(predStop[1]).toLocaleTimeString()} -{
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
    <HStack space={2} alignItems="center">
      <Text >🟢</Text>
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
