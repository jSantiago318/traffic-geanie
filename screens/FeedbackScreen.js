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

import Checkbox from 'expo-checkbox';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { database } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";

function FormC() {
  const [formData, setData] = React.useState({});
  const [errors, setErrors] = React.useState({});

  // const validate = () => {
  //   if (formData.name === undefined) {
  //     setErrors({ ...errors,
  //       name: 'Name is required'
  //     });
  //     return false;
  //   } else if (formData.name.length < 3) {
  //     setErrors({ ...errors,
  //       name: 'Name is too short'
  //     });
  //     return false;
  //   }

  //   return true;
  // };

  const onSubmit = () => {
    console.log('submit');
    // validate() ? console.log('Submitted') : console.log('Validation Failed');
  };
  const [isChecked, setChecked] = useState(false);
  return <VStack width="90%" mx="3" maxW="300px">
      <FormControl isRequired isInvalid={'name' in errors}>
        <FormControl.Label _text={{
        bold: true
      }}>Whats the problem?</FormControl.Label>
        <Input placeholder="problem..." onChangeText={value => setData({ ...formData,
        desc: value
      })} />
      <FormControl.Label _text={{bold:true}}>
      Problem lated to:
        </FormControl.Label>
        <Select minWidth="200" accessibilityLabel="Choose problem"
          onValueChange={(itemValue) => setData({ ...formData,
          problem: itemValue
          }  )}
         placeholder="Choose Service" _selectedItem={{
        bg: "teal.600",

        endIcon: <CheckIcon size={5} />
      }} mt="1">
          <Select.Item label="Problem with route" value="problemRoute" />
          <Select.Item label="Problem with bus" value="problemBus" />
          <Select.Item label="Problem with app" value="problemApp" />
          <Select.Item label="Feedback or comment" value="feedbackComment" />
        </Select>
      <FormControl.Label _text={{
          bold: true
        }}>Include Location</FormControl.Label>
        <HStack
        alignItems="center"
        justifyContent="space-between"
        width="80%"
        
        >
       <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? '#4630EB' : undefined}
        />
       <Text>
          Pair Feedback with Location
       </Text>
        </HStack>
       
      </FormControl>
      <Button onPress={
        async () => {
          try{
            const id = getAuth().currentUser?.uid;
            const docRed = doc(database, "users", id)
            await addDoc(collection(docRed, "feedback"), {
              location: isChecked,
              problem: formData.problem,
              desc: formData.desc,
              uid: id,
            })
          } catch (e) {
            console.log(e);
          }

        }
      } mt="5" colorScheme="cyan"
        
      >
        Submit
      </Button>
    </VStack>;
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
    <Center flex={1}>
      <FormC />
    </Center>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  }, section: {
    flexDirection: 'row',
    alignItems: 'center',
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
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
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
