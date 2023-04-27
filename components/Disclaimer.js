import {
  Button,
  Center,
  Checkbox,
  HStack,
  Icon,
  Modal,
  Radio,
  Text,
  VStack,
} from "native-base";
import { Colors, darkMode, lightMode } from "../config";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import React, { useCallback, useState } from "react";

import { AntDesign } from "@expo/vector-icons";

export const Disclaimer = () => {

  const colorScheme = useColorScheme();
  return (
    <Center>
      <HStack alignItems="center" justifyContent="space-between" style={{marginTop:5}}  >
        <Checkbox
value="one"
          colorScheme="blue"
          accessibilityLabel="This is a dummy checkbox"
          onChange={(e) => {
            setCheckbox(e);
            console.log(e );
          }}
        >
          <Text >
            I agree to the terms and conditions
          </Text>
        </Checkbox>

        <AntDesign
          name="infocirlceo"
          style={{ marginRight: 10, color: Colors.blue }}
          size={12}
          onPress={() => setShowModal(true)}
        />
      </HStack>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Order</Modal.Header>
          <Modal.Body>
          <Text >
          This app was made for research purposes. If you want to delete all of your data you may do so in the settings page. 
          By accepting these terms and conditions, you agree to the following:
          You will not use this app for any illegal purposes.
          You will not use this app to harm others.
          You will not use this app to harm the environment.
          This app will track your location and store it in a database.
          You may delete this information. 
          This app will ask for feedback and store it a database. Researchers may review this feedback. 
          Researchers will look at user travel behaviour and app use in order to provide a better user experience.
          
          </Text>
            {/* <VStack space={3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">The </Text>
                <Text color="blueGray.400">$298.77</Text>
              </HStack>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">Tax</Text>
                <Text color="blueGray.400">$38.84</Text>
              </HStack>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">Total Amount</Text>
                <Text color="green.500">$337.61</Text>
              </HStack>
            </VStack> */}
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                setShowModal(false);
              }}
            >
              Continue
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};
