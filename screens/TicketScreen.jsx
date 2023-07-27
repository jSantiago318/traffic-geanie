import {
  Box,
  Button,
  Center,
  Container,
  FlatList,
  HStack,
  Icon,
  Switch,
  Text,
  TextArea,
} from "native-base";
import { Colors, darkMode, lightMode } from "../config";
import { StyleSheet, View, useColorScheme } from "react-native";

import React from "react";
import { collection } from "firebase/firestore";
import { database } from "../config/firebase";
import { getAuth } from "firebase/auth";
import { signOut } from "firebase/auth";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";

export const TicketScreen = () => {
  const [trips, setTrips] = React.useState(0);
  const [showTripHistory, setShowTripHistory] = React.useState(false);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const id = getAuth().currentUser.uid;
  const query = collection(database, "users/" + id + "/trips");
  const query1 = collection(database, "users/" + id + "/feedback");
  const [docs, loading, error] = useCollectionDataOnce(query);
  const [docs1, loading1, error1] = useCollectionDataOnce(query1);
  const colorScheme = useColorScheme();
  return (
    <View style={colorScheme == "dark" ? darkMode.View : lightMode.View}>
      <HStack space={2} alignItems="center">
        <Button
          title="Show Trip History"
          onPress={() => {
            if (showFeedback) {
              setShowFeedback(false);
            }
            setShowTripHistory(!showTripHistory);
          }}
          style={colorScheme == "dark" ? darkMode.Button : lightMode.Button}
        >
          Trip History
        </Button>
        <Button
          title="Show Feedback History"
          onPress={() => {
            if (showTripHistory) {
              setShowTripHistory(false);
            }
            setShowFeedback(!showFeedback);
          }}
          style={colorScheme == "dark" ? darkMode.Button : lightMode.Button}
        >
          Feedback
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
                <View
                  style={{
                    backgroundColor:
                      colorScheme == "dark"
                        ? Colors.primaryDark
                        : Colors.primaryLight,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 8,
                    marginHorizontal: 16,
                  }}
                >
                  <Text
                    style={
                      colorScheme == "dark" ? darkMode.Text : lightMode.Text
                    }
                  >
                    # {index + 1} | {dt} | {stTime} - {spTime}
                  </Text>
                  <Text
                    style={
                      colorScheme == "dark" ? darkMode.Text : lightMode.Text
                    }
                  >
                    Route: {item.route}{" "}
                  </Text>
                  <Text
                    style={
                      colorScheme == "dark" ? darkMode.Text : lightMode.Text
                    }
                  >
                    Stop 1: {item.startStop}{" "}
                  </Text>
                  <Text
                    style={
                      colorScheme == "dark" ? darkMode.Text : lightMode.Text
                    }
                  >
                    Stop 2: {item.finalStop}{" "}
                  </Text>
                  <Text
                    style={
                      colorScheme == "dark" ? darkMode.Text : lightMode.Text
                    }
                  >
                    User logs: {0} - Bus logs: {0}
                  </Text>
                </View>
              );
            }}
          />
        </>
      ) : null}

      {showFeedback ? (
        <>
          <FlatList
            data={docs1}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{
                    backgroundColor:
                      colorScheme == "dark"
                        ? Colors.primaryDark
                        : Colors.primaryLight,
                    padding: 12,
                    borderRadius: 5,
                    marginVertical: 8,
                    marginHorizontal: 16,
                  }}
                >
                  <Text
                    style={
                      colorScheme == "dark" ? darkMode.Text : lightMode.Text
                    }
                  >
                    Trip {index + 1}
                  </Text>
                  <Text
                    style={
                      colorScheme == "dark" ? darkMode.Text : lightMode.Text
                    }
                  >
                    {item.desc}{" "}
                  </Text>
                  <Text
                    style={
                      colorScheme == "dark" ? darkMode.Text : lightMode.Text
                    }
                  >
                    {item.main}{" "}
                  </Text>
                </View>
              );
            }}
          />
        </>
      ) : (
        <Box
          style={{
            backgroundColor:
              colorScheme == "dark" ? Colors.primaryDark : Colors.primaryLight,
            padding: 12,
            borderRadius: 5,
            marginVertical: 8,
            width: "90%",
          }}
        >
          <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
            {" "}
            Press Trip History for previous travels
          </Text>
        </Box>
      )}
    </View>
  );
};
