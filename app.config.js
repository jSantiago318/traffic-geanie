import 'dotenv/config';

export default {
  expo: {
    name: 'TravelTransitTracker',
    slug: 'mayatransit',
    "owner": "josiba",
    platforms: ['ios', 'android'],
    version: '4.1',
    orientation: 'portrait',
    icon: './assets/car-online.png',
    "userInterfaceStyle": "automatic",
    updates:{
      "url": "https://u.expo.dev/c73948ff-e76e-488d-8d47-48a9097fcd54"
    },

    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    "ios": {
      supportsTablet: true,
      buildNumber: '4.1',
      bundleIdentifier: 'com.josiba.mayatransit',
      config:{
        googleMapsApiKey: process.env.MAPS_API_IOS
      },
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false,
        "UIBackgroundModes": ["location", "fetch"],
        "CFBundleAllowMixedLocalizations": true,
        "NSLocationAlwaysUsageDescription": "App requires geolocation to improve the quality of the service",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "App requires geolocation to improve the quality of the service",
        "NSLocationWhenInUseUsageDescription": "App requires geolocation to improve the quality of the service",
        "NSCameraUsageDescription": "This will allow user user to connect to routes and stops using QR codes",

      }

    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/car-online.png",
        "backgroundColor": "#FFFFFF",
      },
      
      "config":{
        "googleMaps":{
          "apiKey": process.env.MAPS_API
        }
      },
      "versionCode": 41,
      "package": "com.josiba.mayatransit",
      "permissions":["ACCESS_COARSE_LOCATION","ACCESS_FINE_LOCATION","ACCESS_BACKGROUND_LOCATION"]
    },
    extra: {
      "eas": {
        "projectId": "2dd6aac0-107b-4e54-87b6-d632e1083aec"      },
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID
    },
  }, 
  'plugins':[
    [
      'expo-camera', 
      {
        'cameraPermission': 'Allow $(PRODUCT_NAME) to access camera to register onboard bus',
      }
    ],
    [
      'expo-location',
      {
        'locationPermission': 'Allow $(PRODUCT_NAME) to access location to provide real time arrival predictions',
        'NSLocationAlwaysAndWhenInUseUsageDescription': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
        'NSLocationWhenInUseUsageDescription': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
        'locationAlwaysAndWhenInUsePermission': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
        'locationAlwayPermission': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
        'isIosBackgroundLocationEnabled': true, 
        'allowsBackgroundLocationUpdates': true,
        'NSLocationAlwaysUsageDescription': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
         'isAndroidBackgroundLocationEnabled': true,
      }
    ],[
      "expo-tracking-transparency",
      {
        "userTrackingPermission": "Your data will be shared with third party companies, this will help us provide you with the best user expierence."
            }
    ],
  ]
};
