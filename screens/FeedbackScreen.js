import {
  Button,
  Center,
  CheckIcon,
  Container,
  FlatList,
  FormControl,
  HStack,
  Heading,
  Icon,
  Input,
  Modal,
  Select,
  Stack,
  Switch,
  Text,
  VStack,
  useColorMode,
  useTheme,
} from "native-base";
import { Colors, auth } from "../config";
import { StyleSheet, View, useColorScheme } from "react-native";
import { addDoc, collection, doc } from "firebase/firestore";
import { deleteUser, getAuth } from "firebase/auth";

import Checkbox from "expo-checkbox";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { database } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";

function FormC() {
  const [formData, setData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const colorScheme = useColorScheme();
  const onSubmit = () => {
    console.log("submit");
  };
  const [isChecked, setChecked] = useState(false);
  return (
    <VStack width="90%" mx="3">
      <FormControl isRequired isInvalid={"name" in errors}>
        <FormControl.Label>
          <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
            Feedback
          </Text>
        </FormControl.Label>
        <Input
          placeholder="problem..."
          size={ "md" }
          style={colorScheme == "dark" ? darkMode.Input : lightMode.Input}
          onChangeText={(value) => setData({ ...formData, desc: value })}
        />
        <FormControl.Label>
          <Text style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}>
            Problem lated to:
          </Text>
        </FormControl.Label>
        <Select
          accessibilityLabel="Choose problem"
          onValueChange={(itemValue) =>
            setData({ ...formData, problem: itemValue })
          }
          placeholder="Choose Service"
          _selectedItem={{
            bg: "teal.600",

            endIcon: <CheckIcon size={5} />,
          }}
          mt="1"
        >
          <Select.Item label="Problem with route" value="problemRoute" />
          <Select.Item label="Problem with bus" value="problemBus" />
          <Select.Item label="Problem with app" value="problemApp" />
          <Select.Item label="Feedback or comment" value="feedbackComment" />
        </Select>
        <FormControl.Label
          _text={{
            bold: true,
          }}
        >
          <Checkbox
            style={
              colorScheme == "dark" ? darkMode.checkbox : lightMode.checkbox
            }
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? "#4630EB" : undefined}
          />
          <Text style={
              colorScheme == "dark" ? darkMode.Text : lightMode.Text
            }>Include Location</Text>
        </FormControl.Label>
      </FormControl>
      <Button
        onPress={async () => {
          try {
            const id = getAuth().currentUser?.uid;
            const docRed = doc(database, "users", id);
            await addDoc(collection(docRed, "feedback"), {
              location: isChecked,
              problem: formData.problem,
              desc: formData.desc,
              uid: id,
            });
          } catch (e) {
            console.log(e);
          }
        }}
        mt="5"
        colorScheme="cyan"
      >
        Submit
      </Button>
    </VStack>
  );
}

export const FeedbackScreen = () => {
  const colorScheme = useColorScheme();
  const [showModal, setShowModal] = React.useState(false);
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };
  const id = getAuth().currentUser?.uid;
  const cUser = getAuth().currentUser;

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
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#293241",
    width: "100%",
  },
  Input:{
    width: "100%",
    minWidth: '30%',
  },
  CardView: {
    width: "80%",
    backgroundColor: "#5F86C5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  Card: {
    width: "100%",
    backgroundColor: "#8CCCF4",
  },
  container: {
    flex: 1,
    backgroundColor: "#293241",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
  btn: {
    marginVertical: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Text: {
    fontSize: 16,
    // fontWeight: "bold",
    marginTop: 10,
    color: "#fff",
  },
  logout: {
    margin: 5,
  },
  subText: {
    fontSize: 14,
    fontWeight: "normal",
    marginTop: 10,
  },
});

const lightMode = StyleSheet.create({
  View: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
  },
  CardView: {
    width: "100%",
    backgroundColor: "#8CCCF4",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
});
