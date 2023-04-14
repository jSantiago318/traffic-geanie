import { GoogleAuthProvider, getReactNativePersistence, initializeAuth, onAuthStateChanged } from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getPerformance} from "firebase/performance";
import { initializeApp } from 'firebase/app';

// add firebase config
const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
  
};

// initialize firebase
const app = initializeApp(firebaseConfig);

const database = getFirestore(app);
const perf = getPerformance(app);
// initialize auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})


export { auth, database};
