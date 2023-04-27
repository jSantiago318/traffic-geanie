import { Button, FormErrorMessage, TextInput, View } from "../components";
import { Center, Checkbox, HStack, Image, Modal, Text } from "native-base";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import React, { useState } from "react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth, database } from "../config/firebase";

import { AntDesign } from '@expo/vector-icons';
import { Colors } from "../config";
import { Formik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StyleSheet } from "react-native";
import { getCurrentTime } from "../utils";
import logo from "../assets/car-blue.png";
import { signupValidationSchema } from "../utils";
import { useTogglePasswordVisibility } from "../hooks";

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
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
    <View isSafe style={styles.container}>
    <View style={styles.keyboardView} >
      <KeyboardAwareScrollView enableOnAndroid={true}  >
        {/* LogoContainer: consits app logo and screen title */}
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={logo}
            alt="Logo"
            resizeMode={"contain"}
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
          <Text style={styles.screenTitle}>Creating Account</Text>
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
        {/* Button to navigate to Login screen */}
        <Button
          style={styles.borderlessButtonContainer}
          borderless
          title={"Already have an account?"}
          onPress={() => navigation.navigate("Login")}
        />
      </KeyboardAwareScrollView>
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    height: '100%'
    // justifyContent: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 50,
    backgroundColor: Colors.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: Colors.white,
    fontSize: 12,
  },
  
  input:{
    backgroundColor: Colors.white,
    borderColor: Colors.highlihgted,
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
    color: Colors.highlihgted,
  },
  button: {
    backgroundColor: Colors.highlihgted,
    marginTop: 5,
    marginBottom: 10,
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.highlihgtedText,
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


