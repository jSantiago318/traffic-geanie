import { Button, FormErrorMessage, TextInput, View } from "../components";
import { Center, Checkbox, HStack, Heading, Image, Modal, Text } from "native-base";
import { Colors, Images, auth, darkMode, lightMode, provider } from "../config";
import React, { useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";

import { AntDesign } from '@expo/vector-icons';
import { Formik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { loginValidationSchema } from "../utils";
import logo from "../assets/car-blue.png";
import { useTogglePasswordVisibility } from "../hooks";

export const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();

  const handleLogin = (values) => {
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password).catch((error) =>
      setErrorState(error.message)
    );
  };
  const colorScheme = useColorScheme();
  const [showModal, setShowModal] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  return (
    <View isSafe style={styles.container}>
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
              style={{ width: 150, height: 150 }}
            />
          </View>
          <Text style={ colorScheme == 'dark'? darkMode.Title:lightMode.Title }>Mayaguez Transit Tracker </Text>

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
                {/* Input fields */}
                <TextInput
                  name="email"
                  leftIconName="email"
                  placeholder="Enter email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={values.email}
                  borderColor={Colors.lightGray}
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
                <Button style={colorScheme == 'dark'?  darkMode.loginBtn : lightMode.loginBtn } onPress={
                    checkbox ? handleSubmit : () => {
                      alert("Please accept terms and read conditions");
                    } 

                }>
                  <Text style={colorScheme == 'dark'?  darkMode.btnText : lightMode.btnText }>Login</Text>
                </Button>
                {/* <Disclaimer /> */}
              </>
            )}
          </Formik>
          {/* Button to navigate to SignupScreen to create a new account */}
          <Center>
      <HStack alignItems="center" justifyContent="space-between" style={{marginTop:5}}  >
        <Checkbox
value="one"
            
          colorScheme="blue"
          accessibilityLabel="This is a dummy checkbox"
          onChange={(e) => {
            setCheckbox(e);
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
          <Modal.Header>Disclaimer</Modal.Header>
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
              <Text>Continue</Text> 
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            title={"Create a new account?"}
            onPress={() => navigation.navigate("Signup")}
          />
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            title={"Forgot Password"}
            onPress={() => navigation.navigate("ForgotPassword")}
          />
        </View>
      </KeyboardAwareScrollView>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderColor: Colors.lightGray,
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
    color: Colors.textMain,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.highlihgted,
    marginTop: 20,
    marginBottom: 20,
    width: "50%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.highlihgtedText,
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
    backgroundColor: Colors.highlihgted,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  keyboardView: {
    width: "100%",
  },
});
