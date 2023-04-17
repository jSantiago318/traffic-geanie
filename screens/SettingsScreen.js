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

const SettingsBtn = ({secc, icon}) => {
  return (
    <Button
    variant={'ghost'} 
    style={{
      marginVertical: 5,
      width: "70%",
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
    >
      <HStack
      space={10}
      alignItems="center"
    >
    <Text>
        {secc}
    </Text>
        <Icon as={MaterialCommunityIcons} name={icon} size={5} />
    </HStack>
    </Button>
  )
}

const SettingsEnable = ({secc, icon}) => {
  return (
    <Button
    variant={'ghost'} 
    style={{
      marginVertical: 5,
      width: "100%",
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
    >
      <HStack
      space={10}
      justifyContent={ 'space-between'}
      alignItems="center"
    >
    <Text>
        {secc}
    </Text>
    <Switch offTrackColor="indigo.100" onTrackColor="indigo.200" onThumbColor="indigo.500" offThumbColor="indigo.50" />
        </HStack>
    </Button>
  )
}

export const SettingsScreen = () => {
  const [trips, setTrips] = React.useState(0);
  const [showTripHistory, setShowTripHistory] = React.useState(false);
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };
  const id = getAuth().currentUser.uid;
  const query = collection(database, "users/" + id + "/trips");
  const [docs, loading, error] = useCollectionDataOnce(query);
  return (
    <View style={styles.container}>
      
      <Center>
        <Container>
        <HStack>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            textAlign: "center",
            marginVertical: 20,
          }}
        >
          {" "}
          Email: {getAuth().currentUser?.email}{" "}
        </Text>
        <Button title="Log Out" variant={"ghost"} onPress={handleLogout}>
          Log Out
        </Button>
      </HStack>
           <Text>
                Account
              </Text>
         <Stack>
              <SettingsEnable style={styles.btn} secc={'Dark mode'} icon={'theme-light-dark'} />
              <SettingsEnable style={styles.btn} secc={'Admin Access'} icon={'accessibility'} />
            <SettingsBtn style={styles.btn} secc={'Notifications'} icon={'bell'} />
         </Stack>
         <Text>
                Settings
              </Text>
          <Stack>
            <SettingsBtn style={styles.btn} secc={'Privacy'} icon={'shield'} />
            <SettingsBtn style={styles.btn} secc={'Help'} icon={'help-circle'} />
            <SettingsBtn style={styles.btn} secc={'About'} icon={'information'} />
            </Stack>
        </Container>
      </Center>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
