import { Button, FormErrorMessage, TextInput, View } from "../components";
import { Colors, Images, auth, provider } from "../config";
import { Heading, Image } from "native-base";
import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";

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
              size="lg"
              resizeMode="contain"
              style={{ width: 200, height: 200 }}
            />
          </View>
          <Text style={styles.screenTitle}>Mayaguez Transit Tracker </Text>

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
                <Button style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Login</Text>
                </Button>
              </>
            )}
          </Formik>
          {/* Button to navigate to SignupScreen to create a new account */}

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

      {/* App info footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This application is used for reasearch purposes
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "space-between",
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
    width: "100%",
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
