import 'dotenv/config';

export default {
  expo: {
    name: 'Bus Transit Tracker',
    slug: 'mayatransit',
    "owner": "josiba",
    platforms: ['ios', 'android'],
    version: '1.19.0',
    orientation: 'portrait',
    icon: './assets/car-blue.png',
    
    updates:{
      "url": "https://u.expo.dev/c73948ff-e76e-488d-8d47-48a9097fcd54"
    },

    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    "ios": {
      supportsTablet: true,
      bundleIdentifier: 'com.josiba.mayatransit',
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/car-online.png",
        "backgroundColor": "#FFFFFF",
      },
      "versionCode": 4,
      "package": "com.josiba.mayatransit"
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
    }
  }
};
