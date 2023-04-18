import { Box, Button, Center, FlatList, FormControl, HStack, Input, Modal, SafeAreaView, Select, Stack, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { addDoc, collection, doc, getDoc, setDoc, where } from 'firebase/firestore';
import { getActiveBus, getCurrentTime, getOnlineActiveTripsCount, getOnlineCount, getRouteIdforAgency, getRoutesURL, getScheduleForStop } from '../components/URLFetcher';

// import BouncingPreloader from 'react-native-bouncing-preloader';
import { CheckIcon } from 'native-base';
import { Colors } from '../config';
import {RoutesList} from "../components/RoutesList.js";
import {database} from '../config/firebase';
import { getAuth } from 'firebase/auth';

export const HomeScreen = () => {
  const [routes, setRoutes] = React.useState([]);
  const [selectedRoute, setSelectedRoute] = React.useState([]);
  const [busCount, setBusCount] = React.useState(0);
  const [activeTripCount, setActiveTripCount] = React.useState(0);
const [alarmSelect, setAlarmSelect] = React.useState(0);
const [alarmCommentary, setAlarmCommentary] = React.useState(0);

// show modal 
const [alertModalVisible, setAlertModalVisible] = useState(false);
const [alarmModalVisible, setAlarmModalVisible] = useState(false);
useEffect(() => {
      // if (routes == []) {
        let temp = 0
       async function getData(){
       await fetch('https://pr-oba.live/api/where/route-ids-for-agency/TIM.json?key=TEST').then((response) => response.json()).then((data) => {
        let routeLists = data.data.list
        temp = data.data.list[0]
      setRoutes(routeLists);
      setSelectedRoute( data.data.list[0]);
      })
        
    }
    if(routes.length == 0){
      getData();
    }
    // }
  }, [routes, selectedRoute]);

  setInterval(() => {
    setBusCount(getOnlineCount());
    setActiveTripCount(getOnlineActiveTripsCount());
    
  }, 6000);

  

  return (
    <View style={styles.container}>
      {/* <DataFetcher/> */}
      <Center style={{
        width: '100%',
        borderRadius: 10,
        padding: 5,
        }} >

     {
      alarmModalVisible ? (
        <SafeAreaView style={{flex: 1}}>
        <Modal     isOpen={alarmModalVisible} onClose={() => setAlarmModalVisible(false)}>
        <Modal.Content maxWidth="80%">
          <Modal.CloseButton />
          <Modal.Header>Is there a problem?</Modal.Header>
          <Modal.Body>
          <FormControl.Label>Choose report</FormControl.Label>
        <Select minWidth="200" accessibilityLabel="Choose report" onValueChange={(value) => setAlarmSelect(value)} placeholder="Choose report" _selectedItem={{
        bg: Colors.highlihgted,
        endIcon: <CheckIcon size={5} />
      }} mt="1">
          <Select.Item label="Problem with route" value="p1" />
          <Select.Item label="Problem with Bus" value="p2" />
          <Select.Item label="Problem with app" value="p3" />
          <Select.Item label="Feedback or Comment" value="p4" />
        </Select>
            <FormControl mt="3">
              <FormControl.Label>Comment</FormControl.Label>
              <Input onChangeText={(value) => setAlarmCommentary(value)} />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setAlarmModalVisible(false);
            }}>
                Cancel
              </Button>
              <Button onPress={async () => {
                try {
        const id = getAuth().currentUser.uid;
        const docRef = doc(database, "users", id);
        await addDoc(collection(docRef, "alerts"), {
          alert: alarmSelect,
          commentary: alarmCommentary,
          route: selectedRoute,
        });
        
      } catch (e) {
        console.error("Error adding document: ", e);
      }
              setAlarmModalVisible(false);
            }}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      </SafeAreaView>
      ) : null
     }

    </Center>
      <View style={stylesLayout.app}>
      <Center>

      <Text fontSize="xl" bold>Mayaguez Bus Tracker</Text>
      </Center>

        <View style={styles.card} >
        <HStack>
        <Stack>

        <Text fontSize={'md'} bold >Online Buses: {busCount}</Text>
        <Text fontSize={'md'} bold >Connected Routes: {activeTripCount}
        </Text>
        </Stack>

<Button style={styles.alertBtn} onPress={() => setAlarmModalVisible(!alarmModalVisible)} >
  <Text>🚨</Text>
</Button>
<Button style={styles.alertBtn}  >
  <Text>🔔</Text>
</Button>
</HStack>
 <Box  style={styles.selectRoute}>
      <Text> 
      Select Route: </Text>
        <Select  style={{
        width: '100%',
        borderRadius: 10,
        padding: 10,
        }} selectedValue={selectedRoute}  accessibilityLabel="Choose a route" placeholder="Choose a route" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={itemValue => {
        setSelectedRoute(itemValue) }}>
        <>

        
      {
        routes != null ? (
            routes.map((item, index) => {
              return (
                <Select.Item label={item} value={item} key={index}   />
              )
            }
          )) : null
      }
      </>
        </Select>
      </Box>
      </View>
        
    </View>
   
      {
        selectedRoute.length > 0 ? (
          <RoutesList route={selectedRoute}  />
        ) : (
       
        <Text> Lading ... </Text>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  routeLists: {
    width: '90%',
    borderRadius: 10,
    padding: 10,
    backgroundColor: Colors.secondary,
  },
  
  button: {
    marginTop: 5,
    width: '40%',
    backgroundColor: Colors.secondary,
    borderRadius: 5,
    borderColor: 'transparent',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    padding: 15
  },
  layout: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
  }, selectRoute :{
    width: '100%',
    borderRadius: 10,
    padding: 10,
    backgroundColor: Colors.secondary,
  },
  alertBtn: {
    backgroundColor:'transparent',
    marginLeft: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,

  }
  
  
  
});

// Styles
const stylesLayout = {
  app: {
    paddingTop: 20,
    marginHorizontal: "auto",
    width: "100%",
    borderColor: 'transparent',
  },
  row: {
    flexDirection: "row",
    borderColor: 'transparent',
  },
  "1col":  {
    borderWidth:  1,
    flex:  1,
    borderColor: 'transparent',
  },
  "2col":  {
    borderWidth:  1,
    flex:  2,
    borderColor: 'transparent',
  },
}