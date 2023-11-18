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
  ScrollView,
  Stack,
  Switch,
  Text,
  useColorMode,
  useTheme,
} from "native-base";
import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  VirtualizedList,
  useColorScheme,
} from "react-native";
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
  const [showTripsModal, setShowTripsModal] = React.useState(false);
  const [trips, setTrips] = React.useState(null);
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
        const { data, error } = await supabase
          .from("trips")
          .select("*")
          .eq("email", user.email)
          .select();
        console.log(data);
        setTrips(data);
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

  const deleteTrip = async (tripId) => {
    const { data, error } = await supabase
      .from("trips")
      .delete()
      .eq("id", tripId);
    console.log(data);
    if (error) {
      console.log(error);
    }
  }
  


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
        <Heading color={
              colorScheme === "light" ? colorsLight.textColor : colorsDark.textColor
            } >Account</Heading>

        <Text color={
              colorScheme === "light" ? colorsLight.textColor : colorsDark.textColor
            }  fontSize={16}>{email || "..."}</Text>

        <Button m={2} p={1} variant={"outline"} onPress={() => setShowTripsModal(true)}>
          <Heading color={
              colorScheme === "light" ? colorsLight.textColor : colorsDark.textColor
            } fontSize={16}>Trip History</Heading>
        </Button>
        <Heading color={
              colorScheme === "light" ? colorsLight.textColor : colorsDark.textColor
            }>Profile</Heading>
        <Button variant={"ghost"} onPress={() => setShowModal(true)}>
          <Text color={
              colorScheme === "light" ? colorsLight.textColor : colorsDark.textColor
            } fontSize={16}>Delete Account</Text>
        </Button>

        <Modal  isOpen={showTripsModal} onClose={() => setShowTripsModal(false)}>
          <Modal.Content 
            
          width="90%" height={"80%"}>
            <Modal.CloseButton />
            <Modal.Header>Trip History</Modal.Header>
            <Modal.Body 
            >
              <FormControl>
                <FormControl.Label>
                  Removing data is non recoverable
                </FormControl.Label>
              </FormControl>
              {/* Show list of trips */}
                {trips &&
                  trips.map((item) => {
                    return (
                      <>
                        <Stack marginBottom={
                          item.trip_status == 'ended'  ? 10 : 0
                        } >
                      {/* if trip is first stop of trip, show if trip is made 24 hous ago */}
                        <HStack alignContent={'center'} justifyContent="space-between">
                          <HStack alignContent={'center'}  justifyContent="flex-start">
                          {/* add tripStatus for continued 0, ended */}
                          <Text  bold fontSize={16}>{item.id}:</Text>
                          {
                              item.trip_status === 'ended' && item.seq === 0 ? <Text bold color={'yellow.500'} fontSize={16}>One Stop</Text> : null
                            }
                            {
                              item.trip_status === 'ended'  && item.seq > 0  ? <Text bold color={'red.500'} fontSize={16}>Ended</Text> : null
                            }
                            {
                              item.trip_status === 'continued' && item.seq !== 0 ? <Text bold color={'green.500'} fontSize={16}>Continued</Text> : null
                            }
                            {/* IS first stop in trip? */}
                            {
                              item.trip_status === 'continued' && item.seq === 0 ? <Text bold color={'green.500'} fontSize={16}>First Stop</Text> : null
                            }
                            {/* IS last stop in trip? */}
                          
                            
                           
                            </HStack>
                            {/* delete trip */}
                            <Button
                              variant="outline"
                              p={1}
                              m={0}
                              colorScheme="blueGray"
                              onPress={() => {
                                deleteTrip(item.id);
                              }}
                            >
                              <Text bold color={'grey'} fontSize={16}>Delete</Text>
                            </Button>
                            </HStack>
                          <HStack justifyContent="space-between">
                          {/* from startStop to finalStop */}
                          {/* 
                          <Text>{item.id}</Text>
                        <Text>{item.trip_status}</Text>
                        <Text>{item.tripId}</Text>
                        <Text>{item.created_at}</Text>
                        <Text>{item.location_start.startStop}</Text>
                        <Text>{item.location_start.startTime}</Text>
                        <Text>{item.location_end.finalStop}</Text>
                        <Text>{item.location_end.endTime}</Text>
                        <Text>{item.trip_duration}</Text>
                        <Text>{item.seq}</Text>
                        <Text>{item.travel}</Text> 
                        */}
                          <Stack>
                          <Text bold fontSize={16}>
                          {/* if longer than 15 char cut */}
                          {item.location_start.startStop && item.location_start.startStop.length > 15 ? item.location_start.startStop.substring(0, 15 - 3) + '...' : item.location_start.startStop}
                          </Text>
                          <Text fontSize={12}>{item.location_start.startTime}</Text>
                          </Stack>
                         <MaterialCommunityIcons name="arrow-right" size={24} color="black" />
                         <Stack>
                         <Text bold fontSize={16}>
                          {/* if longer than 15 char cut */}
                          {item.location_end.finalStop && item.location_end.finalStop.length > 15 ? item.location_end.finalStop.substring(0, 15 - 3) + '...' : item.location_end.finalStop}
                         </Text>
                          <Text fontSize={12}>{item.location_end.endTime}</Text>

                         </Stack> 
                          
                          </HStack>
                        </Stack>
                        
                      </>
                    );
                  })}
            </Modal.Body>
            {/* add refresh button */}
            {/* <Modal.Footer>
              <Button.Group space={2}>
              </Button.Group>
            </Modal.Footer> */}
          </Modal.Content>
        </Modal>

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
            <Text color={
              colorScheme === "light" ? colorsLight.textColor : colorsDark.textColor
            } fontSize={16}>Privacy Policy</Text>
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
          <Text  color={
              colorScheme === "light" ? colorsLight.textColor : colorsDark.textColor
            } fontSize={16}>Log Out</Text>
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
