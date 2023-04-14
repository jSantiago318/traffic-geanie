import 'dotenv/config';

export default {
  expo: {
    name: 'MayaBus',
    slug: 'mayabus',
    "owner": "josiba",
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
      bundleIdentifier: 'com.josiba.MayaBus',
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/car-blue.png",
        "backgroundColor": "#FFFFFF"
      },
      "versionCode": 4,
      "package": "com.josiba.MayaBus"
    },
    extra: {
      "eas": {
        "projectId": "5b970694-53a2-40c3-8c93-dff502ffa57f"      },
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID
    }
  }
};
