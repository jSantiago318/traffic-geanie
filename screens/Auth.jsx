import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";
import {
  Box,
  Button,
  FormControl,
  HStack,
  Icon,
  Image,
  Input,
  Modal,
  Pressable,
  Stack,
  Text,
  View,
} from "native-base";
import React, { useState } from "react";
import { colorsDark, colorsLight, darkMode, lightMode } from "../config";

import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import logo from "../assets/car-blue.png";
import { supabase } from "../utils/supabase";

export const Auth = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showSignIn, setShowSignIn] = useState(true);
  const [termsCheck, setTermsCheck] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [ageCheck, setAgeCheck] = useState(false);
  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }
  const [showAlert, setShowAlert] = useState(false);
  async function signUpWithEmail() {
    setLoading(true);
    const { session, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: name,
          phone: number,
        }
      }
    });
    // sign up and then update the user with the name and number

    if (error) {
      console.log(error);
      // if user already exists
      if (error.message == "User already registered") {
        Alert.alert("Email already exists", "Please try again or sign in");
      }
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const uid = user.id;
    const { data } = await supabase
      .from("profiles")
      .insert([{ email: email, username: name, exp: 5, user_id: uid, phone: number, data: {
        first_name: name,
        is18: ageCheck,

      }  }]);

    setLoading(false);
  }
  const colorScheme = useColorScheme();
  return (
    <KeyboardAvoidingView
      enabled={false}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flex: 1,
        }}
        keyboardDismissMode="on-drag"
      >
        <View style={colorScheme == "dark" ? darkMode.View : lightMode.View}>
          {/* Add Movable Keyboard view */}

          <Image
            source={logo}
            alt="Logo"
            size="md"
            resizeMode="contain"
            style={{
              width: 125,
              height: 125,
              marginTop: "20%",
              marginBottom: 20,
              padding: 5,
              alignSelf: "center",
            }}
          />
          <Text
            style={colorScheme == "dark" ? darkMode.Title : lightMode.Title} >
            Mayaguez Transit Tracker
          </Text>

          <Stack
            w={{
              base: "80%",
              md: "25%",
            }}
            space={3}
            mt={5}
            p={5}
            rounded="md"
          
            alignItems="center"
          >
            <Input
              variant="filled"
              onChangeText={(text) => setEmail(text)}
              style={colorScheme == "dark" ? darkMode.Input : lightMode.Input}
              value={email}
              size="md"
              backgroundColor={
                colorScheme == "dark"
                  ? darkMode.Input.backgroundColor
                  : lightMode.Input.backgroundColor
              }
              placeholder="email"
              autoCapitalize={"none"}
              keyboardType="email-address"
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="person" />}
                  size={7}
                  ml="2"
                  color="muted.400"
                />
              }
            />
            <Input
              style={colorScheme == "dark" ? darkMode.Input : lightMode.Input}
              onChangeText={(text) => setPassword(text)}
              value={password}
              variant="filled"
              placeholder="password"
              size="md"
              autoCapitalize={"none"}
              type={show ? "text" : "password"}
              InputRightElement={
                <Pressable onPress={() => setShow(!show)}>
                  <Icon
                    as={
                      <MaterialIcons
                        name={show ? "visibility" : "visibility-off"}
                      />
                    }
                    size={7}
                    mr="2"
                    color="muted.400"
                  />
                </Pressable>
              }
            />
            {
              showSignUp ? (
                <>
                  <Input
                    style={colorScheme == "dark" ? darkMode.Input : lightMode.Input}
                    onChangeText={(num) => setName(num)}
                    value={name}
                    size={"md"}
                    variant={"filled"}
                    placeholder="name"
                     />
                    
                    <Input
                  style={colorScheme == "dark" ? darkMode.Input : lightMode.Input}
                  onChangeText={(num) => setNumber(num)}
                  value={number}
                  placeholder="phone"
                  size={"md"}
                    variant={"filled"}
                  keyboardType="number-pad" />
                
                    </>
              ) : null
            }

           
          </Stack>
          {showSignUp ? (
              <Box
                style={colorScheme == "dark" ? darkMode.ModalBody : lightMode.ModalBody}
              >
                {/* check terms and conditions */}
                <HStack style={colorScheme == "dark" ? darkMode.ModalBody : lightMode.ModalBody} alignItems="center" space={2} mt={5}>
                  <Box>
                    {termsCheck ? (
                      <Icon
                        as={<MaterialIcons name="check-box" />}
                        size={7}
                        ml="2"
                        color="muted.400"
                        onPress={() => setTermsCheck(false)}
                      />
                    ) : (
                      <Icon
                        as={<MaterialIcons name="check-box-outline-blank" />}
                        size={7}
                        ml="2"
                        color="muted.400"
                        onPress={() => setTermsCheck(true)}
                      />
                    )}
                  </Box>
                  <Text color="muted.700" fontSize="sm">
                    By signing up, you agree to our{" "}
                    <Text color="primary.500" fontWeight="medium">
                      Terms of Use
                    </Text>{" "}
                    and{" "}
                    <Text color="primary.500" fontWeight="medium">
                      Privacy Policy
                    </Text>
                  </Text>
                </HStack>
                <HStack style={colorScheme == "dark" ? darkMode.ModalBody : lightMode.ModalBody} alignItems="center" space={2} mt={5}>
                  <Box>
                    {ageCheck ? (
                      <Icon
                        as={<MaterialIcons name="check-box" />}
                        size={7}
                        ml="2"
                        color="muted.400"
                        onPress={() => setAgeCheck(false)}
                      />
                    ) : (
                      <Icon
                        as={<MaterialIcons name="check-box-outline-blank" />}
                        size={7}
                        ml="2"
                        color="muted.400"
                        onPress={() => setAgeCheck(true)}
                      />
                    )}
                  </Box>
                  <Text color="muted.700" fontSize="sm">
                    Are you 18 or older?
                  </Text>
                </HStack>
              </Box>
            ) : null}
          {showSignIn ? (
             <Box
              style={{
                marginTop: 20,
                justifyContent: "center",
                alignItems: "center",
              }
              }
             >
             <Button
              style={{
                marginTop: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colorScheme == "dark" ? darkMode.Button.backgroundColor : lightMode.Button.backgroundColor,
              }}
             >
              <Text
                style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}
                onPress={() => {
                  if (email.length == 0 || password.length == 0) {
                    Alert.alert("Please fill out all fields");
                  } else {
                    signInWithEmail();
                  }
                }}
              >
                Sign In
              </Text>
             </Button>
              <Text
                style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}
              >
                Don't have an account?{" "}
                <Text
                  style={
                    colorScheme == "dark" ? darkMode.Title : lightMode.Title
                  }
                  onPress={() => {
                    setShowSignIn(false);
                    setShowSignUp(true);
                  }}
                >
                  Sign up
                </Text>
              </Text>
             </Box>
            
              
          ) : null}
          {showSignUp ? (
            <>
              <Button
                style={
                  colorScheme == "dark" ? darkMode.Button : lightMode.Button
                }
                disabled={loading}
                onPress={() => {
                  if (email.length == 0 || password.length == 0) {
                    Alert.alert("Please fill out all fields");
                  } else {
                    if (termsCheck) {
                      signUpWithEmail();
                    } else {
                      Alert.alert(
                        "Please read and agree to the terms and conditions"
                      );
                    }
                  }
                }}
              >
                <Text
                  style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}
                >
                  Sign Up
                </Text>
              </Button>
              <Text
                style={colorScheme == "dark" ? darkMode.Text : lightMode.Text}
              >
                Have an account?{" "}
                <Text
                  style={
                    colorScheme == "dark" ? darkMode.Title : lightMode.Title
                  }
                  onPress={() => {
                    setShowSignIn(true);
                    setShowSignUp(false);
                  }}
                >
                  Sign In
                </Text>
              </Text>
            </>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
