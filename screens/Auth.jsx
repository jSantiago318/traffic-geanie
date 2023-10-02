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
  Center,
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

import { A } from '@expo/html-elements';
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
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            Travel Transit Tracker
          </Text>

          <Stack
            w={{
              base: "80%",
              md: "25%",
            }}
            space={3}
            mt={1}
            p={1}
            rounded="md"
          
            alignItems="center"
          >
          {
              showSignUp ? (
                <>
                  <Input
                    style={colorScheme == "dark" ? darkMode.Input : lightMode.Input}
                    onChangeText={(num) => setName(num)}
                    value={name}
                    size={"md"}
                    backgroundColor={
                colorScheme == "dark"
                  ? colorsDark.primaryColor
                  : colorsLight.primaryColor
              }
              borderColor={'transparent'}
              color={
                colorScheme == "dark"
                  ? darkMode.Title.color
                  : lightMode.Title.color
              }
              autoCapitalize={"none"}
                    placeholder="name"

              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="person" />}
                  size={7}
                  ml="2"
                  color={
                    colorScheme == "dark"
                      ? darkMode.Title.color
                      : lightMode.Title.color
                  }
                />
              }
                     />
                    
                    <Input
                  style={colorScheme == "dark" ? darkMode.Input : lightMode.Input}
                  onChangeText={(num) => setNumber(num)}
                  value={number}
                  placeholder="phone"
                  size={"md"}
                    variant={"filled"}
                  keyboardType="number-pad"
                  borderColor={'transparent'}
                  backgroundColor={
                colorScheme == "dark"
                  ? colorsDark.primaryColor
                  : colorsLight.primaryColor
              }
              color={
                colorScheme == "dark"
                  ? darkMode.Title.color
                  : lightMode.Title.color
              }
                  
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="phone" />}
                  size={7}
                  ml="2"
                  color={
                    colorScheme == "dark"
                      ? darkMode.Title.color
                      : lightMode.Title.color
                  }
                />
              }
                   />
                
                    </>
              ) : null
            }
            <Input
              onChangeText={(text) => setEmail(text)}
              style={colorScheme == "dark" ? darkMode.Input : lightMode.Input}
              value={email}
              size="md"
              backgroundColor={
                colorScheme == "dark"
                  ? colorsDark.primaryColor
                  : colorsLight.primaryColor
              }
              borderColor={'transparent'}
              placeholder="email"
              color={
                colorScheme == "dark"
                  ? darkMode.Title.color
                  : lightMode.Title.color
              }
              autoCapitalize={"none"}
              keyboardType="email-address"
              
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name="person" />}
                  size={7}
                  ml="2"
                  color={
                    colorScheme == "dark"
                      ? darkMode.Title.color
                      : lightMode.Title.color
                  }
                />
              }
            />
            <Input
              style={colorScheme == "dark" ? darkMode.Input : lightMode.Input}
              onChangeText={(text) => setPassword(text)}
              value={password}
              placeholder="password"
              backgroundColor={
                colorScheme == "dark"
                  ? colorsDark.primaryColor
                  : colorsLight.primaryColor
              }
              size="md"
              borderColor={'transparent'}
              color={
                colorScheme == "dark"
                  ? darkMode.Title.color
                  : lightMode.Title.color
              }
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
                    color={
                      colorScheme == "dark"
                        ? darkMode.Title.color
                        : lightMode.Title.color
                    }
                  />
                </Pressable>
              }
            />
            

           
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
                        color={
                          colorScheme == "dark"
                            ? darkMode.Title.color
                            : lightMode.Title.color
                        }
                        onPress={() => setTermsCheck(false)}
                      />
                    ) : (
                      <Icon
                        as={<MaterialIcons name="check-box-outline-blank" />}
                        size={7}
                        ml="2"
                        color={
                          colorScheme == "dark"
                            ? darkMode.Title.color
                            : lightMode.Title.color
                        }
                        onPress={() => setTermsCheck(true)}
                      />
                    )}
                  </Box>
                  <Text 
                    color={
                      colorScheme == "dark"
                        ? darkMode.Title.color
                        : lightMode.Title.color
                    }
                        fontWeight="medium"
                        fontSize={'sm'}
                  >
                    By signing up, you agree to our{" "}
                    <A  color={
                    colorScheme == "dark"
                      ? darkMode.Title.color
                      : lightMode.Title.color
                  }
                      fontWeight="medium" href="https://www.privacypolicies.com/live/bd65ed16-5509-4ee2-8c18-e874d08103a7">
               <Text
                      color={
                    'primary.00'
                  }
                      fontWeight="medium"
                      fontSize={'sm'}
                  >

                      Terms of Use and Conditions
                  </Text>
                    
                    </A>
                  </Text>
                </HStack>
                <HStack style={colorScheme == "dark" ? darkMode.ModalBody : lightMode.ModalBody} alignItems="center" space={2} mt={5}>
                  <Box>
                    {ageCheck ? (
                      <Icon
                        as={<MaterialIcons name="check-box" />}
                        size={7}
                        ml="2"
                        color={
                          colorScheme == "dark"
                            ? darkMode.Title.color
                            : lightMode.Title.color
                        }
                        onPress={() => setAgeCheck(false)}
                      />
                    ) : (
                      <Icon
                        as={<MaterialIcons name="check-box-outline-blank" />}
                        size={7}
                        ml="2"
                        color={
                          colorScheme == "dark"
                            ? darkMode.Title.color
                            : lightMode.Title.color
                        }
                        onPress={() => setAgeCheck(true)}
                      />
                    )}
                  </Box>
                  <Text 
                   color={
                    colorScheme == "dark"
                      ? darkMode.Title.color
                      : lightMode.Title.color
                  }
                      fontWeight="medium"
                      fontSize={'sm'}
                  >
                    Are you 18 or older?
                  </Text>
                </HStack>
              </Box>
            ) : null}
          {showSignIn ? (
             <Box
              style={{
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
              }
              }
             >
             <Button
            backgroundColor={
              colorScheme == "dark" ? colorsDark.primaryColor : colorsLight.primaryColor
            }
            padding={2}
            borderRadius={10}
            paddingLeft={10}
            paddingRight={10}
            marginBottom={5}
             >  
              <Text
                bold 
                fontSize={'lg'}
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
color={
                    colorScheme == "dark"
                      ? darkMode.Title.color
                      : lightMode.Title.color
                  }
                  fontSize={"md"}
              >
                Don't have an account? {" "}
                <Text
                  color={
                    colorScheme == "dark"
                      ? darkMode.Title.color
                      : lightMode.Title.color
                  }
                  fontSize={"md"}
                  fontWeight={"bold"}
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
               backgroundColor={
              colorScheme == "dark" ? colorsDark.primaryColor : colorsLight.primaryColor
            }
            padding={2}
            borderRadius={10}
            paddingLeft={10}
            paddingRight={10}
            marginBottom={5}
                onPress={() => {
                  if (email.length == 0 || password.length == 0) {
                    Alert.alert("Please fill out all fields");
                  } else {
                    if (termsCheck && ageCheck) {
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
                  bold
                  fontSize={'lg'}
                >
                  Sign Up
                </Text>
              </Button>
              <Text
             fontSize={"sm"} >
                Have an account?{" "}
                <Text
                  fontSize={"md"}
                  bold
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
