import 'dotenv/config';

const config = {
    expo: {
    name: 'TravelTransitTracker',
    slug: 'mayatransit',
    "owner": "josiba",
    platforms: ['ios', 'android'],
    version: '802',
    orientation: 'portrait',
    icon: './assets/car-online.png',
    "userInterfaceStyle": "automatic",
    "updates": {
      "url": "https://u.expo.dev/2dd6aac0-107b-4e54-87b6-d632e1083aec"
    },
    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    "ios": {
      supportsTablet: true,
      buildNumber: '802',
      bundleIdentifier: 'com.josiba.mayatransit',
      config:{
        googleMapsApiKey: process.env.MAPS_API_IOS
      },
      "infoPlist": {
        "UIBackgroundModes": ["location", "fetch"],
        "CFBundleAllowMixedLocalizations": true,
        "NSLocationAlwaysUsageDescription": "App requires geolocation to improve the quality of the service",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "App requires geolocation to improve the quality of the service",
        "NSCameraUsageDescription": "This will allow user user to connect to routes and stops using QR codes",
        "NSLocationWhenInUseUsageDescription": "App requires geolocation to improve the quality of the service",
        "NSLocationUsageDescription": "App requires geolocation to improve the quality of the service",
        "NSLocationTemporaryUsageDescriptionDictionary": {
          "NSLocationTemporaryUsageDescriptionDictionary": "App requires geolocation to improve the quality of the service"
        },
        "NSUserTrackingUsageDescription": "Your data will be shared with third party companies, this will help us provide you with the best user expierence.",
        
           

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
      "versionCode": 802,
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
        'NSLocationAlwaysAndWhenInUseUsageDescription': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
        'locationAlwaysAndWhenInUsePermission': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
        'locationAlwayPermission': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
        'NSLocationAlwaysUsageDescription': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
         'NSLocationWhenInUseUsageDescription': 'Your location is used to determine the recomended nearest and provide in real time arival predictions for your arrival at routes or stops.',
      }
    ],[
      "expo-tracking-transparency",
      {
        "userTrackingPermission": "Your data will be shared with third party companies, this will help us provide you with the best user expierence."
            }
    ],
  ]
}
export default config;