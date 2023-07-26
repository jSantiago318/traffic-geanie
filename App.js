import React, {useEffect} from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthenticatedUserProvider } from './providers';
import { LogBox } from "react-native"
// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';
import { NativeBaseProvider } from 'native-base';
import { RootNavigator } from './navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createTheme } from '@mui/material/styles';
import { enableScreens } from 'react-native-screens';

enableScreens();
const slides = [
  {
    key: 'one',
    title: 'User Privacy and Data Policy',
    text: 'This app may ask for user location, this data could be stored.\nBut it will not be shared with any third party.\nThe data collected by the app is used to provide the user with the best and complete user expierence',
    // image: require('./assets/1.jpg'),
    backgroundColor: '#8ecae6',
  },
  {
    key: 'two',
    title: 'Active Development',
    text: 'Without the user\'s data, the app will not be able to provide the user with the best expierence.\n\nThe app is still in active development, so there may be bugs and issues.\n\nIf you find any bugs or issues, please report them to the developer.',
    // image: require('./assets/2.jpg'),
    backgroundColor: '#e9c46a',
  },
  {
    key: 'three',
    title: 'Active Features',
    text:'This app is still in active development\nIt is used to provide transit data and predictions\nto the Mayaguez, Puerto Rico transit system',
    backgroundColor: '#a3b18a',
  },
];
const App = () => {
  const [mode, setMode] = React.useState('light');
  LogBox.ignoreLogs([ 'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.', ])

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@firstTime', value)
    } catch (e) {
      // saving error
    }
  }

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@firstTime')
    if(value !== null) {
      setShowRealApp(true);
      return true;
    }
  } catch(e) {
    // error reading value
    return false;
  }
}

  _renderItem = ({ item }) => {
    return (
      <View style={styles.slide} backgroundColor={item.backgroundColor} >
        <Text style={styles.title}>{item.title}</Text>
        {/* <Image source={item.image} /> */}
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  }
  _onDone = () => {

    //store data to asyncstorage
   storeData('true');
    
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
  setShowRealApp(true );
  }
  
    if (getData()) {
      return (
        <AuthenticatedUserProvider>
          <SafeAreaProvider>
          <NativeBaseProvider>
            <RootNavigator />
          </NativeBaseProvider>
          </SafeAreaProvider>
        </AuthenticatedUserProvider>
      );
    } else {
      return <AppIntroSlider renderItem={this._renderItem} data={slides} onDone={this._onDone}/>;
    }
  
};
const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'blue',
  },
  text: {
    color: 'white',
    maxWidth: '80%',
    textAlign: 'center',
    fontSize: 14,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 32,
  },
});


export default App;
