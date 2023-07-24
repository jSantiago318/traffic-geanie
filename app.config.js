import 'dotenv/config';

export default {
  expo: {
    name: 'Travel Transit Tracker',
    slug: 'mayatransit',
    "owner": "josiba",
    platforms: ['ios', 'android'],
    version: '3.6',
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
      
      buildNumber: '3.6',
      bundleIdentifier: 'com.josiba.mayatransit',
      config:{
        googleMapsApiKey: process.env.MAPS_API_IOS
      },
      "infoPlist": {
        "UIBackgroundModes": [
          "location",
          "fetch"
        ],
        "NSLocation*UsageDescription": "App requires geolocation to improve the quality of the service",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "App requires geolocation to improve the quality of the service",
        "NSLocationAlwaysUsageDescription": "App requires geolocation to improve the quality of the service",
        "NSLocationWhenInUseUsageDescription": "App requires geolocation to improve the quality of the service",
        "NSCameraUsageDescription": "The picture will be used to inform the state of the packages during delivery"
   
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
      "versionCode": 36,
      "package": "com.josiba.mayatransit",

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
        "isIosBackgroundLocationEnabled": true,
        "isAndroidBackgroundLocationEnabled": true,
        'locationAlwaysAndWhenInUsePermission': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
        'locationAlwayPermission': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
        'isIosBackgroundLocationEnabled': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
        'isAndroidBackgroundLocationEnabledgit': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
      }
    ],[
      "expo-tracking-transparency",
      {
        "userTrackingPermission": "Your data will be used to deliver personalized ads for products that are most relevant to you."
            }
    ],
    [
      'expo-build-properties',
      {
        'ios':{
          'flipper': true
        },
      }
    ]
  ]
};
