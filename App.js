import * as eva from '@eva-design/eva';

import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';

import { AppNavigator } from './navigation/AppNavigator';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { default as theme } from './custom-theme.json';

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack}/>
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <SafeAreaProvider>
            <AppNavigator />
        </SafeAreaProvider>
    </ApplicationProvider>
  </>
);
