import { Alert, View } from 'react-native'
// import { Button, FormErrorMessage, TextInput, View } from "../components";
import {
  Button,
  Center,
  Checkbox,
  HStack,
  Heading,
  Image,
  Input,
  Modal,
  Text,
} from "native-base";
import { FormErrorMessage, TextInput } from "../components";
import { Images, auth, darkMode, lightMode, provider } from "../config";
import React, { useState } from 'react'
import { StyleSheet, useColorScheme } from "react-native";
import { signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";

import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {PrivacyPolicy} from "../assets/PrivacyPolicy";
import { loginValidationSchema } from "../utils";
import logo from "../assets/car-blue.png";
import { supabase } from '../utils/supabase'
import { useTogglePasswordVisibility } from "../hooks";

export const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
  
  const colorScheme = useColorScheme();
  const [showModal, setShowModal] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  
  return (
    <View isSafe style={ colorScheme == "dark" ? darkMode.View : lightMode.View }>
      <KeyboardAwareScrollView
        style={styles.keyboardView}
        enableOnAndroid={true}
      >
        <View style={styles.keyView}>
          <View style={styles.logoContainer}>
            <Image
              source={logo}
              alt="Logo"
              size="md"
              resizeMode="contain"
              style={{ width: 125, height: 125 }}
            />
          </View>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginValidationSchema}
            onSubmit={(values) => handleLogin(values)}
            width="100%"
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              handleBlur,
            }) => (
              <>
                <Text
                  style={
                    colorScheme == "dark" ? darkMode.Title : lightMode.Title
                  }
                >
                  Mayaguez Transit Tracker{" "}
                </Text>

                {/* Input fields */}
                <TextInput
                  name="email"
                  leftIconName="email"
                  placeholder="Enter email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={values.email}
                  borderColor={'grey'}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                />
                <FormErrorMessage
                  error={errors.email}
                  visible={touched.email}
                />
                <TextInput
                  name="password"
                  leftIconName="key-variant"
                  placeholder="Enter password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType="newPassword"
                  rightIcon={rightIcon}
                  handlePasswordVisibility={handlePasswordVisibility}
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                />

                <FormErrorMessage
                  error={errors.password}
                  visible={touched.password}
                />
                {/* Display Screen Error Mesages */}
                {errorState !== "" ? (
                  <FormErrorMessage error={errorState} visible={true} />
                ) : null}
                {/* Login button */}
                <Button
                  onPress={
                    checkbox
                      ? signInWithEmail
                      : () => {
                          alert("Please accept terms and read conditions");
                        }
                  }
                  style={
              colorScheme == "dark"
                ? darkMode.LoginBtn
                : lightMode.LoginBtn
                
            }

                >
                  <Text
                  style={
              colorScheme == "dark"
                ? darkMode.Text
                : lightMode.Text
                
            }
                  >Login</Text>
                </Button>
              </>
            )}
          </Formik>
          {/* Button to navigate to SignupScreen to create a new account */}
          <Center>
            <HStack
              alignItems="center"
              justifyContent="space-between"
              style={{ marginTop: 5 }}
            >
              <Checkbox
                value="one"
                colorScheme="blue"
                accessibilityLabel="This is a dummy checkbox"
                onChange={(e) => {
                  setCheckbox(e);
                }}
              >
                <Text
                  style={
                    colorScheme == "dark"
                      ? darkMode.Text
                      : lightMode.Text
                  }
                
                  > I agree to the terms and conditions
                </Text>
              </Checkbox>

              <AntDesign
                name="infocirlceo"
                style={
                    colorScheme == "dark"
                      ? darkMode.icon
                      : lightMode.icon
                  }
                size={18}
                onPress={() => setShowModal(true)}
              />
            </HStack>
            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              size="lg"
            >
              <Modal.Content maxWidth="350">
                <Modal.CloseButton />
                <Modal.Header>Privacy Policy</Modal.Header>
                <Modal.Body>
                  <PrivacyPolicy />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    flex="1"
                    onPress={() => {
                      setShowModal(false);
                    }}
                    style={useColorScheme == 'dark'? darkMode.textMain : lightMode.textMain}
                  >
                    <Text>Continue</Text>
                  </Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Center>
          <Button
            style={
              colorScheme == "dark"
                ? darkMode.LoginBtn
                : lightMode.LoginBtn
            }
            borderless 
            
            title={"Create a new account?"}
            onPress={() => navigation.navigate("Signup")}
          >
           <Text
              style={ colorScheme == "dark" ? darkMode.Text : lightMode.Text }
            > New Acount
            </Text>
          </Button>
          <Button
            style={
              colorScheme == "dark"
                ? darkMode.LoginBtn
                : lightMode.LoginBtn
                
            }
            borderless
            title={"Forgot Password"}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text
              style={ colorScheme == "dark" ? darkMode.Text : lightMode.Text }
            > Forgot Password
            </Text>
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};



// export const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)

//   async function signInWithEmail() {
//     setLoading(true)
//     const { error } = await supabase.auth.signInWithPassword({
//       email: email,
//       password: password,
//     })

//     if (error) Alert.alert(error.message)
//     setLoading(false)
//   }

//   async function signUpWithEmail() {
//     setLoading(true)
//     const { error } = await supabase.auth.signUp({
//       email: email,
//       password: password,
//     })

//     if (error) Alert.alert(error.message)
//     setLoading(false)
//   }

//   return (
//     <View style={styles.container}>
//       <View style={
//         styles.input
//       }>
//         <Input
//           label="Email"
//           leftIcon={{ type: 'font-awesome', name: 'envelope' }}
//           onChangeText={(text) => setEmail(text)}
//           value={email}
//           placeholder="email@address.com"
//           autoCapitalize={'none'}
//         />
//       </View>
//       <View style={styles.verticallySpaced}>
//         <Input
//           label="Password"
//           leftIcon={{ type: 'font-awesome', name: 'lock' }}
//           onChangeText={(text) => setPassword(text)}
//           value={password}
//           secureTextEntry={true}
//           placeholder="Password"
//           autoCapitalize={'none'}
//         />
//       </View>
//       <View style={[styles.verticallySpaced, styles.mt20]}>
//         <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
//       </View>
//       <View style={styles.verticallySpaced}>
//         <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
//       </View>
//     </View>
//   )
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderColor: 'grey',
  },
  keyView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: 'black',
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: 'black',
    marginTop: 20,
    marginBottom: 20,
    width: "50%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: "bold",
  },
  borderlessButtonContainer: {
    marginTop: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  footer: {
    backgroundColor: 'black',
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  keyboardView: {
    width: "100%",
  },
  View:{
    flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffff',
      width:'100%',
  },
});