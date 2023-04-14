import 'dotenv/config';

export default {
  expo: {
    name: 'MayaBus',
    slug: 'MayaBus',
    platforms: ['ios', 'android'],
    version: '1.15.0',
    orientation: 'portrait',
    icon: './assets/car-blue.png',
    
    updates:{
      "url": "https://u.expo.dev/c73948ff-e76e-488d-8d47-48a9097fcd54"
    },

    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#F57C00'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.joshua.MayaBus',
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/car-blue.png",
        "backgroundColor": "#FFFFFF"
      },
      "versionCode": 4,
      "package": "com.joshua.MayaBus"
    },
    extra: {
      "eas": {
        "projectId": "c73948ff-e76e-488d-8d47-48a9097fcd54"
      },
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID
    }
  }
};
