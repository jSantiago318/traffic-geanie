import * as Location from "expo-location";

import {
  Button,
  Center,
  FormControl,
  HStack,
  Heading,
  Icon,
  Input,
  Text,
  VStack,
  useColorMode,
  useTheme,
} from "native-base";
import { Colors, auth } from "../config";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { addDoc, collection, doc } from "firebase/firestore";
import { deleteUser, getAuth } from "firebase/auth";

import Checkbox from "expo-checkbox";
import { database } from "../config/firebase";
import { signOut } from "firebase/auth";

function FormC() {
  const [formData, setData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const colorScheme = useColorScheme();
  const [isChecked, setChecked] = React.useState(false);
  const [location, setLocation] = React.useState(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      setLocation(location);
      
    })();
  }, [location]);
  
  return (
    <View style={colorScheme == "dark" ? darkMode.View : lightMode.View}>
      <FormControl
        isRequired
        isInvalid={"name" in errors}
        style={colorScheme == "dark" ? darkMode.CardView : lightMode.CardView}
      >
        <FormControl.Label>
          <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
            Title
          </Text>
        </FormControl.Label>
        <Input
            variant="outline"
            placeholder="problem..."
            onChangeText={(value) => setData({ ...formData, main: value })}
            style={colorScheme == "dark" ? darkMode.Input : lightMode.Input}
          />

        <FormControl.Label>
          <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
            Problem Description
          </Text>
        </FormControl.Label>
        <Input
            variant="outline"
            w={"100%"}
            placeholder="problem description ..."
            onChangeText={(value) => setData({ ...formData, desc: value })}
            style={colorScheme == "dark" ? darkMode.Input : lightMode.Input}
          />

        <FormControl.Label
          _text={{
            bold: true,
          }}
        >
          <Checkbox
            size={5}
            style={
              colorScheme == "dark" ? darkMode.checkbox : lightMode.checkbox
            }
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? "#4630EB" : undefined}
          />
          <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
             Include Current Location
          </Text>
        </FormControl.Label>
      </FormControl>
      <Button
        onPress={async () => {
          try {
            const id = getAuth().currentUser?.uid;
            const docRed = doc(database, "users", id);
            await addDoc(collection(docRed, "feedback"), {
              location: {
                          lat: location.coords.latitude || 18.201025,
                          lon: location.coords.longitude || -67.1318,
                        },
              main: formData.main,
              desc: formData.desc,
              time: new Date() ,
              uid: id,
            });
          } catch (e) {
            console.log(e);
          }
        }}
        mt="5"
        colorScheme="blue"
      >
        Submit
      </Button>
    </View>
  );
}

export const FeedbackScreen = () => {
  const colorScheme = useColorScheme();
  const [showModal, setShowModal] = React.useState(false);
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  }; 
  return (
    <View style={colorScheme == "dark" ? darkMode.View : lightMode.View}>
      <Center flex={1}>
        <FormC />
      </Center>
    </View>
  );
};

const darkMode = StyleSheet.create({
  View: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "#293241",
    width: "100%",
  },
  CardView: {
    width: "100%",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  Card: {
    width: "100%",
    backgroundColor: "#8CCCF4",
  }, Text:{
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  Input: {
    backgroundColor: "#fff",
    width: "90%",
    padding: 5,
  }, checkbox:{
    backgroundColor: "#fff",
    marginRight: 10,
  },
});

const lightMode = StyleSheet.create({
  View: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
  },
  CardView: {
    width: "100%",
    // backgroundColor: "#8CCCF4",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  Card: {
    width: "100%",
    backgroundColor: "#8CCCF4",
  },
  Input: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 10,
    paddingBottom: 10,
    padding: 5,
  }, checkbox:{
    backgroundColor: "#fff",
    marginRight: 10,
    
  }, Text:{
    color: "#000",
    fontSize: 16,
    marginBottom: 5,
    
  }
  
});
