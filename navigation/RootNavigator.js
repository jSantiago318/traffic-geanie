import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';

import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';
import { AuthenticatedUserContext } from '../providers';
import { LoadingIndicator } from '../components';
import { auth } from '../config';
import { onAuthStateChanged } from 'firebase/auth';
import { useColorScheme } from 'react-native';

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useColorScheme();
  const appearance = useColorScheme();

  useEffect(() => {
    
  

    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuthStateChanged;
  }, [user]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer  theme={theme === 'dark' ? DarkTheme : DefaultTheme } >
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
