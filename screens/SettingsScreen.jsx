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
import React, { useEffect } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { colorsDark, colorsLight } from "../config";

import { A } from "@expo/html-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../utils/supabase";

export const SettingsScreen = () => {
  const colorScheme = useColorScheme();
  const [showModal, setShowModal] = React.useState(false);
  const [dbSession, setDbSession] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [uid, setuid] = React.useState(null);
  const [verify, setVerify] = React.useState(false);

  const deleteUser = async () => {
    const { error } = await supabase.rpc("delete_user");
    const { errors } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
  };

  useEffect(() => {
    (async () => {
      if (email == null) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setEmail(user.email);
        setuid(user.id);
      }
      if (dbSession == null) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", email);
        console.log(data);
        if (error) {
          console.log(error);
        }
      }
    })();
  }, [email, dbSession]);

  return (
    <Container
      backgroundColor={
        colorScheme === "dark" ? colorsDark.background : colorsLight.background
      }
      flex={1}
      justifyContent="center"
      alignItems="center"
    >
      {/* <Center> */}
      <Container>
        <Heading>Account</Heading>

        <Text fontSize={16}>{email}</Text>

        <Heading>Profile</Heading>

        <Button variant={"ghost"} onPress={() => setShowModal(true)}>
          <Text fontSize={16}>Delete Account</Text>
        </Button>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="70%">
            <Modal.CloseButton />
            <Modal.Header>Delete Account</Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>
                  Data is non recoverable. Are you sure you want to delete your
                  account?
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
                    deleteUser();
                  }}
                >
                  Yes
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        <Button fontSize={16} variant={"ghost"}>
          <A href="https://www.privacypolicies.com/live/bd65ed16-5509-4ee2-8c18-e874d08103a7">
            <Text fontSize={16}>Privacy Policy</Text>
          </A>
        </Button>

        <Button
          style={
            colorScheme === "dark" ? darkMode.outlineBtn : lightMode.outlineBtn
          }
          title="Log Out"
          variant={"ghost"}
          onPress={handleLogout}
        >
          <Text fontSize={16}>Log Out</Text>
        </Button>
      </Container>
      {/* </Center> */}
    </Container>
  );
};

const darkMode = StyleSheet.create({
  View: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorsDark.background,
    width: "100%",
  },
  Text: {
    fontSize: 13,
    fontWeight: "bold",
    color: colorsDark.textColor,
  },
  TextHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: colorsDark.textColor,
  },
  subtleBtn: {
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 5,
  },
  outlineBtn: {
    borderRadius: 10,
    padding: 5,
  },
});

const lightMode = StyleSheet.create({
  View: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorsLight.background,
    width: "100%",
  },
  Text: {
    fontSize: 13,
    fontWeight: "bold",
    color: colorsLight.textColor,
  },
  TextHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: colorsLight.textColor,
  },
  subtleBtn: {
    backgroundColor: "transparent",
    borderRadius: 10,
    padding: 5,
  },
  outlineBtn: {
    borderRadius: 10,
    padding: 5,
  },
});
