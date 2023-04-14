import { Box, Button, Center, FlatList, FormControl, HStack, Input, Modal, Select, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { addDoc, collection, doc, getDoc, setDoc, where } from 'firebase/firestore';
import { getActiveBus, getCurrentTime, getOnlineActiveTripsCount, getOnlineCount, getRouteIdforAgency, getRoutesURL, getScheduleForStop } from '../components/URLFetcher';

// import BouncingPreloader from 'react-native-bouncing-preloader';
import { CheckIcon } from 'native-base';
import {RoutesList} from "../components/RoutesList.js";
import {database} from '../config/firebase';
import { getAuth } from 'firebase/auth';

// RN Code

let loader = true
let counter = 2

// setInterval(() => {


const Col = ({ numRows, children }) => {
  return  (
    <View style={stylesLayout[`${numRows}col`]}>{children}</View>
  )
}

const Row = ({ children }) => (
  <View style={stylesLayout.row}>{children}</View>
)


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
      <Text fontSize="2xl" bold>Mayaguez Bus Tracker</Text>

      <View style={stylesLayout.app}>
      <Row>
        <Col numRows={2}>
        <View style={styles.card} >
        <Text fontSize={'md'} bold >Online Buses: {busCount}</Text>
        <Text fontSize={'md'} bold >Active Routes: {activeTripCount}
        </Text>
      </View>
        </Col>
        <Col numRows={2}>
      <View style={styles.card} >
        <Text fontSize={'md'} bold >Alerts</Text>
        <HStack>

        <Button style={{borderRadius: 15, marginLeft: 5 }} onPress={() => setAlarmModalVisible(!alarmModalVisible)} >
          <Text>🚨</Text>
        </Button>
        <Button style={{borderRadius: 15, marginLeft: 5 }}  >
          <Text>🔔</Text>
        </Button>
        </HStack>
      </View>
        </Col>
      </Row>
    </View>
    <Center style={{
        width: '100%',
        borderRadius: 10,
        padding: 10,
        }} >

     {
      alarmModalVisible ? (
        <Modal isOpen={alarmModalVisible} onClose={() => setAlarmModalVisible(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Whats the problem?</Modal.Header>
          <Modal.Body>
          <FormControl.Label>Choose alarm</FormControl.Label>
        <Select minWidth="200" accessibilityLabel="Choose alarm" onValueChange={(value) => setAlarmSelect(value)} placeholder="Choose alarm" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size={5} />
      }} mt="1">
          <Select.Item label="Autobus Desconectado" value="p1" />
          <Select.Item label="Autobus Tarde" value="p2" />
          <Select.Item label="Problema con Conexion" value="p3" />
          <Select.Item label="Problema con aplicacion" value="p4" />
        </Select>
            <FormControl mt="3">
              <FormControl.Label>Comentarios</FormControl.Label>
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
      ) : null
     }
     {
      alertModalVisible ? (
        <Modal isOpen={alertModalVisible} onClose={() => setAlertModalVisible(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>What is the alert? 🚨</Modal.Header>
          <Modal.Body>
          <FormControl.Label>Choose alert</FormControl.Label>
        <Select minWidth="200" accessibilityLabel="Choose alert" onValueChange={(value) => setAlertModalVisible(value)} placeholder="Choose alert" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size={5} />
      }} mt="1">
          <Select.Item label="Autobus Desconectado" value="p1" />
          <Select.Item label="Autobus Tarde" value="p2" />
          <Select.Item label="Problema con Conexion" value="p3" />
          <Select.Item label="Problema con aplicacion" value="p4" />
        </Select>
            <FormControl mt="3">
              <FormControl.Label>Comentarios</FormControl.Label>
              <Input onChangeText={(value) => setAlarmCommentary(value)} />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setAlertModalVisible(false);
            }}>
                Cancel
              </Button>
              <Button onPress={() => {
                
                // add to database
                push(
                  ref(
                    database, 'users/' + getAuth().currentUser.uid  + '/alets'
                  ),{
                    alert: alarmSelect,
                    commentary: alarmCommentary,
                    route: selectedRoute,
                  }
                )
                

              setAlertModalVisible(false);
            }}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      ) : null
     }


      <Box  style={styles.selectRoute}>
      <Text> 
      Selected Route: </Text>
        <Select  style={{
        width: '100%',
        borderRadius: 10,
        padding: 10,
        }} selectedValue={selectedRoute}  accessibilityLabel="Choose a route" placeholder="Choose a route" _selectedItem={{
        bg: "#93e1d8",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={itemValue => {
        setSelectedRoute(itemValue) }}>
      {
        routes != null ? (
            routes.map((item, index) => {
              return (
                <Select.Item label={item} value={item} key={index}   />
              )
            }
          )) : null
      }
         
        </Select>
      </Box>
    </Center>
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
    backgroundColor: '#93e1d8',
  },
  
  button: {
    marginTop: 5,
    width: '40%',
    backgroundColor: '#93e1d8',
    tintColor: '#93e1d8',
    borderRadius: 5,
    borderColor: 'transparent',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ddfff7',
    padding: 20,
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
    backgroundColor: '#93e1d8',
  }, selectRoute :{
    width: '100%',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#93e1d8',
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