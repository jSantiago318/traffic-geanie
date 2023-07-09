import {
  Box,
  Button,
  Center,
  Container,
  FlatList,
  HStack,
  Stack,
  Switch,
  Text,
  TextArea,
  VStack,
} from "native-base";
import { StyleSheet, View } from "react-native";

import BouncingPreLoader from "react-native-bouncing-preloader";
import MapView from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { auth } from "../config";
import {
  collection,
} from "firebase/firestore";
import { database } from "../config/firebase";
import { getAuth } from "firebase/auth";
import { signOut } from "firebase/auth";
import {
  useCollectionDataOnce,
} from "react-firebase-hooks/firestore";

export const TicketScreen = () => {
  const [trips, setTrips] = React.useState(0);
  const [showTripHistory, setShowTripHistory] = React.useState(false);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };
  const id = getAuth().currentUser.uid;
  const query = collection(database, "users/" + id + "/trips");
  const query1 = collection(database, "users/" + id + "/feedback");
  const [docs, loading, error] = useCollectionDataOnce(query);
  const [docs1, loading1, error1] = useCollectionDataOnce(query1);

  return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
      <HStack space={2} alignItems="center" style={{ marginTop: 20, marginBottom: 20 }}>
         
        <Button
              title="Show Trip History"
              onPress={() => setShowTripHistory(!showTripHistory)}
              variant={"outline"}
            >
              Show Trip History
            </Button>
            <Button
              title="Show Feedback History"
              onPress={() => setShowFeedback(!showFeedback)}
              variant={"outline"}
            >
              Show Feedback History
            </Button>
      </HStack>
         {showTripHistory ? (
        <>
          <FlatList
            data={docs}
            renderItem={({ item, index }) => {
              const dt = new Date(item.startTime).toLocaleDateString();
              const stTime = new Date(item.startTime).toLocaleTimeString();
              const spTime = new Date(item.stopTime).toLocaleTimeString();
              return (
                <Box
                  style={{
                    backgroundColor: "white",
                    padding: 12,
                    borderRadius: 5,
                    marginVertical: 8,
                    marginHorizontal: 16,
                  }}
                >
                  <Text>
                    {index +1} | {dt}  | {stTime} - {spTime}
                  </Text>
                  <Text>Route: {item.route} </Text>
                  <Text>Stop 1: {item.startStop} </Text>
                  <Text>Stop 2: {item.finalStop} </Text>
                </Box>
              );
            }}
          />
        </>
      ) : (
       null
        
      )}
            {showFeedback ? (
        <>
          <FlatList
            data={docs1}
            style={{width: '80%'}}
            renderItem={({ item , index }) => {
                return (
                <Box
                style={{
                  backgroundColor: "white",
                  padding: 12,
                  borderRadius: 5,
                  marginVertical: 8,
                  marginHorizontal: 16,
                  minHeight: 50
                  }}
                >
                <Text> {index+1} | 
               <Text bold > {item.main}</Text>
                </Text>
                <Text>{item.desc}</Text>
                </Box>
              );
            }}
            />
        </>
      ) : (
       null
        
      )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
