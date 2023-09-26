import 'dotenv/config';

export default {
  expo: {
    name: 'TravelTransitTracker',
    slug: 'mayatransit',
    "owner": "josiba",
    platforms: ['ios', 'android'],
    version: '9.0.23',
    "runTimeVersion": "9.0.23",
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
      
      buildNumber: '9.0.23',
      bundleIdentifier: 'com.josiba.mayatransit',
      config:{
        googleMapsApiKey: process.env.EXPO_PUBLIC_MAPS_API_IOS
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
          "apiKey": process.env.EXPO_PUBLIC_MAPS_API
        }
      },
      "versionCode": 9023,
      "package": "com.josiba.mayatransit",

    },
    extra: {
      "eas": {
        "projectId": "2dd6aac0-107b-4e54-87b6-d632e1083aec"      },
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
        'NSLocationWhenInUseUsageDescription': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
        'locationAlwaysAndWhenInUsePermission': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
        'locationAlwayPermission': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
        'isIosBackgroundLocationEnabled': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
        'isAndroidBackgroundLocationEnabledgit': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
      }
    ],[
      "expo-tracking-transparency",
      {
        "userTrackingPermission": "Your data will be shared with third party companies, this will help us provide you with the best user expierence."
            }
    ],
   
  ]
};
