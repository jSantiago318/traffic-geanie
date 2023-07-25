import { Button, FormErrorMessage, TextInput, View } from "../components";
import { Center, Checkbox, HStack, Image, Modal, Text } from "native-base";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import React, { useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth, database } from "../config/firebase";
import { darkMode, lightMode } from "../config";

import { AntDesign } from '@expo/vector-icons';
import { Formik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { PrivacyPolicy } from "../assets/PrivacyPolicy";
import { getCurrentTime } from "../utils";
import logo from "../assets/car-blue.png";
import { signupValidationSchema } from "../utils";
import { useTogglePasswordVisibility } from "../hooks";

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const colorScheme = useColorScheme();
  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility,
  } = useTogglePasswordVisibility();

  const handleSignup = async (values) => {
    const { email, password, phone } = values;

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        try {
          const id = getAuth().currentUser.uid;
          const userRef = doc(database, "users", id);
          setDoc(userRef, {
            email: email,
            phone: phone,
          });
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      })

      .catch((error) => setErrorState(error.message));
  };

  return (
    <View isSafe style={ colorScheme == "dark" ? darkMode.View : lightMode.View }>
      <KeyboardAwareScrollView enableOnAndroid={true}  >
        {/* LogoContainer: consits app logo and screen title */}
        <View style={styles.logoContainer}>
            <Image
              source={logo}
              alt="Logo"
              size="md"
              resizeMode="contain"
              style={{ width: 150, height: 150 }}
            />
          </View>
        {/* Formik Wrapper */}
        <Formik
          initialValues={{
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={signupValidationSchema}
          style={styles.form}
          onSubmit={(values) => handleSignup(values)}
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
          <Text style={colorScheme == 'dark'? darkMode.Title:lightMode.Title }>Creating Account</Text>
              <TextInput
                name="email"
                leftIconName="email"
                placeholder="Enter email"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoFocus={true}
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
              />
              <TextInput
                name="phone"
                leftIconName="phone"
                placeholder="Enter phone"
                autoCapitalize="none"
                keyboardType="number-pad"
                textContentType="telephoneNumber"
                value={values.phone}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
              />
              <FormErrorMessage error={errors.email} visible={touched.email} />
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
              <TextInput
                name="confirmPassword"
                leftIconName="key-variant"
                placeholder="Enter password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={confirmPasswordVisibility}
                textContentType="password"
                rightIcon={confirmPasswordIcon}
                handlePasswordVisibility={handleConfirmPasswordVisibility}
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
              />
              <FormErrorMessage
                error={errors.confirmPassword}
                visible={touched.confirmPassword}
              />
              {/* Display Screen Error Mesages */}
              {errorState !== "" ? (
                <FormErrorMessage error={errorState} visible={true} />
              ) : null}
              {/* Signup button */}
              <Button style={styles.button} onPress={
                checkbox ? handleSubmit : () => {
                  alert("Please agree to the terms and conditions")
                }
              }>
                <Text style={styles.buttonText}>Sign Up</Text>
              </Button>
            </>
          )}
        </Formik>
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
                    style={useColorScheme == 'dark'? darkMode.subtleBtn : lightMode.subtleBtn}
                  >
                    <Text>Continue</Text>
                  </Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
    </Center>
        {/* Button to navigate to Login screen */}
        <Button
          style={styles.borderlessButtonContainer}
          borderless
          title={"Already have an account?"}
          onPress={() => navigation.navigate("Login")}
        />
      </KeyboardAwareScrollView>
      
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: "center",
    height: '100%'
    // justifyContent: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 50,
    backgroundColor: 'blue',
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: 'white',
    fontSize: 12,
  },View:{
    flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffff',
      width:'100%',
  },
  
  input:{
    backgroundColor: 'white',
    borderColor: 'black',
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10  },

  logo: {
    width: 200,
    height: 200,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: 'black',
  },
  button: {
    backgroundColor: 'black',
    marginTop: 5,
    marginBottom: 10,
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontWeight: "bold",
    fontSize: 16,
  },
  borderlessButtonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  keyboardView: {
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  },
  
});


