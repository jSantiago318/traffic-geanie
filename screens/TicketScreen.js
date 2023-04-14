import {
  Button,
  Center,
  Container,
  FlatList,
  HStack,
  Icon,
  Stack,
  Switch,
  Text,
} from "native-base";
import { StyleSheet, View } from "react-native";

import BouncingPreLoader from "react-native-bouncing-preloader";
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
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };
  const id = getAuth().currentUser.uid;
  const query = collection(database, "users/" + id + "/trips");
  const [docs, loading, error] = useCollectionDataOnce(query);
  return (
      <View
        style={{
          flex: 1,
          // justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
              title="Show Trip History"
              onPress={() => setShowTripHistory(!showTripHistory)}
              variant={"outline"}
              style={{
                marginVertical: 20,
                width: "70%",
              }}
            >
              Show Trip History
            </Button>
         {showTripHistory ? (
        <>
          <FlatList
            data={docs}
            renderItem={({ item }) => {
              const dt = new Date(item.startTime).toLocaleDateString();
              const stTime = new Date(item.startTime).toLocaleTimeString();
              const spTime = new Date(item.stopTime).toLocaleTimeString();
              return (
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 12,
                    borderRadius: 5,
                    marginVertical: 8,
                    marginHorizontal: 16,
                  }}
                >
                  <Text>Route: {item.route} </Text>
                  <Text>First Stop: {item.startStop} </Text>
                  <Text>Final Stop: {item.finalStop} </Text>
                  <Text>
                    User logs: {0} - Bus logs: {0}
                  </Text>
                  <Text>
                    Time: {dt} : {stTime} - {spTime}
                  </Text>
                </View>
              );
            }}
            keyExtractor={(item) => item.startTime}
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
