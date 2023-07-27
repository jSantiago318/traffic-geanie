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
import { Colors, aut, darkMode, lightMode } from "../config";
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
          <Text style={colorScheme == "dark" ? darkMode.Title : lightMode.Text}>
            Main Problem
          </Text>
        </FormControl.Label>
        <Input
          variant="outline"
          placeholder="problem..."
          onChangeText={(value) => setData({ ...formData, main: value })}
          style={{
              backgroundColor: colorScheme == "dark" ? Colors.primaryDark : Colors.primaryLight,
          }}
        >
        <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
          {formData.main}
        </Text>
        </Input>

        <FormControl.Label>
          <Text style={colorScheme == "dark" ? darkMode.Title : lightMode.Title}>
            Description
          </Text>
        </FormControl.Label>
        <Input
          w={"100%"}
          placeholder="problem description ..."
          onChangeText={(value) => setData({ ...formData, desc: value })}
          style={{
              backgroundColor: colorScheme == "dark" ? Colors.primaryDark : Colors.primaryLight,
          }}
        >
        <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
          {formData.desc}
        </Text>
        </Input>

        <FormControl.Label
          _text={{
            bold: true,
          }}
        >
          <Checkbox
            size={6}
            margin={2}
            style={
              colorScheme == "dark" ? darkMode.checkbox : lightMode.checkbox
            }
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? Colors.primaryDark : undefined}
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
              time: new Date(),
              uid: id,
            });
          } catch (e) {
            console.log(e);
          }
        }}
        style={colorScheme == "dark" ? darkMode.Button : lightMode.Button}
      >
        <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>Submit
        </Text>
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
