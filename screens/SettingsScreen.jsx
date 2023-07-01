import {
  Button,
  Center,
  Container,
  FlatList,
  FormControl,
  HStack,
  Heading,
  Icon,
  Input,
  Modal,
  Stack,
  Switch,
  Text,
  useColorMode,
  useTheme,
} from "native-base";
import { Colors, auth } from "../config";
import { StyleSheet, View, useColorScheme } from "react-native";
import { deleteUser, getAuth } from "firebase/auth";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { signOut } from "firebase/auth";

export const SettingsScreen = () => {
  const colorScheme = useColorScheme();
  const [showModal, setShowModal] = React.useState(false);
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };
  const id = getAuth().currentUser?.uid;
  const cUser = getAuth().currentUser;

  return (
    <View style={colorScheme === "dark" ? darkMode.View : lightMode.View}>
      <Center>
        <Container>
          <Heading
            style={
              colorScheme === "dark"
                ? darkMode.TextHeading
                : lightMode.TextHeading
            }
          >
            Account
          </Heading>

          <Text style={colorScheme === "dark" ? darkMode.Text : lightMode.Text}>
            Email: {getAuth().currentUser?.email}
          </Text>
          <Heading
            style={
              colorScheme === "dark"
                ? darkMode.TextHeading
                : lightMode.TextHeading
            }
          >
            Settings
          </Heading>

          <Button
            style={
              colorScheme === "dark" ? darkMode.subtleBtn : lightMode.subtleBtn
            }
            title="Delete Account"
            variant={"ghost"}
            onPress={() => setShowModal(true)}
          >
            Delete Account
          </Button>
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content maxWidth="70%">
              <Modal.CloseButton />
              <Modal.Header>Delete Account</Modal.Header>
              <Modal.Body>
                <FormControl>
                  <FormControl.Label>
                    Data is non recoverable. Are you sure you want to delete
                    your account?
                  </FormControl.Label>
                </FormControl>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                      setShowModal(false);
                    }}
                  >
                    No
                  </Button>
                  <Button
                    onPress={() => {
                      deleteUser(cUser).then(() => {
                        setShowModal  (false);
                      })
                    }}
                  >
                    Yes
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>

          <Button
            style={
              colorScheme === "dark" ? darkMode.subtleBtn : lightMode.subtleBtn
            }
            title="Privacy"
            variant={"ghost"}
            onPress={() =>
              console.log(
                "https://www.privacypolicies.com/live/bd65ed16-5509-4ee2-8c18-e874d08103a7"
              )
            }
          >
            Privacy Privacy
          </Button>

          <Button
            style={
              colorScheme === "dark"
                ? darkMode.outlineBtn
                : lightMode.outlineBtn
            }
            title="Log Out"
            variant={"ghost"}
            onPress={handleLogout}
          >
            Log Out
          </Button>
        </Container>
      </Center>
    </View>
  );
};

const darkMode = StyleSheet.create({
  View:{
    flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#293241',
      width:'100%',
  },
  Text: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fff",
  },
  TextHeading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  subtleBtn:{
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 5,

  }, outlineBtn:{
    borderRadius: 10,
    padding: 5,

  },
  
})

const lightMode = StyleSheet.create({
  View:{
    flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      width:'100%',
  },
  Text: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#293241",
  },
  TextHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#293241",
  },
  subtleBtn:{
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 5,

  }, outlineBtn:{
    borderRadius: 10,
    padding: 5,

  },
  
})